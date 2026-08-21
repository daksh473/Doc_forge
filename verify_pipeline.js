/**
 * DocForge Pipeline Verification Test
 * Tests 3 genuinely different product rows from the UniHack sample dataset
 * across different product categories.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// ── 3 Real Product Rows ──
// ROW A: Abrasives — Diablo Sanding Belt (Freud Inc)
const ROW_A = {
  Mfg_Part_Num: "DCB518ASTS06G",
  Part_Desc: 'DCB518ASTS06G Diablo 1/2"x18" - Sanding Belt 6pc',
  E1_Brand: "-- Unbranded --",
  Unilog_Brand: "-- No Unilog Brand --",
  DIB_Brand: "-- No DIB Brand --",
  Part_Manuf: "Freud Inc (2435)"
};

// ROW B: Building Materials — TimberTech PVC Decking
const ROW_B = {
  Mfg_Part_Num: "ADB15516CS",
  Part_Desc: "1x6-16' Coastline Sq Edge - Vintage Azek PVC Decking",
  E1_Brand: "TIMBERTECH",
  Unilog_Brand: "-- No Unilog Brand --",
  DIB_Brand: "-- No DIB Brand --",
  Part_Manuf: "Parksite (6151)"
};

// ROW C: Lighting — Satco LED Ceiling Light
const ROW_C = {
  Mfg_Part_Num: "62-1850",
  Part_Desc: '62-1850 11" Led Ceiling Light',
  E1_Brand: "-- Unbranded --",
  Unilog_Brand: "-- No Unilog Brand --",
  DIB_Brand: "-- No DIB Brand --",
  Part_Manuf: "Satco Prod Inc (5573)"
};

function makeTextBlock(row) {
  return [
    `Manufacturer Part Number: ${row.Mfg_Part_Num}`,
    `Product Description: ${row.Part_Desc}`,
    `Manufacturer: ${row.Part_Manuf}`,
    row.E1_Brand !== "-- Unbranded --" ? `E1 Brand: ${row.E1_Brand}` : null
  ].filter(Boolean).join("\n");
}

function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      method: "POST",
      hostname: "localhost",
      port: 3000,
      path: path,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      },
      timeout: 120000
    }, (res) => {
      let chunks = "";
      res.on("data", c => chunks += c);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(chunks) });
        } catch (e) {
          resolve({ status: res.statusCode, body: chunks });
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.write(data);
    req.end();
  });
}

async function processRow(label, row) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`Processing: ${label}`);
  console.log(`  MPN: ${row.Mfg_Part_Num}`);
  console.log(`  Desc: ${row.Part_Desc}`);
  console.log(`${"=".repeat(70)}`);

  const textBlock = makeTextBlock(row);
  const result = await postJSON("/api/pipeline/full", {
    text: textBlock,
    originalRow: row
  });

  if (result.status !== 200) {
    console.log(`  ERROR: HTTP ${result.status}`);
    console.log(`  Body: ${JSON.stringify(result.body).substring(0, 500)}`);
    return null;
  }

  const stages = result.body.stages || {};

  // Classification
  const classify = stages.classify?.result || {};
  console.log(`  Document Type: ${classify.document_type}`);

  // Taxonomy
  const taxonomy = stages.taxonomy?.result || {};
  const catPath = taxonomy.category_path || taxonomy.taxonomy?.category_path || [];
  console.log(`  Classpath: ${catPath.join(" > ")}`);
  console.log(`  Taxonomy Confidence: ${taxonomy.confidence}`);

  // Extraction
  const extract = stages.extract?.result || {};
  const pId = extract.product_identification || {};
  console.log(`  raw_title: ${pId.raw_title}`);
  console.log(`  extraction_failed: ${extract.extraction_failed}`);
  const attrs = extract.attributes || extract.raw_specifications || [];
  console.log(`  Attributes extracted: ${attrs.length}`);
  if (attrs.length > 0) {
    attrs.slice(0, 5).forEach(a => {
      console.log(`    - ${a.attribute_name || a.name}: ${a.raw_value || a.standardized_value} ${a.raw_unit || a.standardized_unit || ""}`);
    });
  }

  // Mfg/Brand
  const mfg = stages.mfgNormalization?.result || {};
  console.log(`  MANUFACTURER_NAME: ${mfg.canonical_manufacturer?.MANUFACTURER_NAME || "MISSING"}`);
  console.log(`  BRAND_NAME: ${mfg.canonical_brand?.BRAND_NAME || "MISSING"}`);

  // Cataloging
  const catalog = stages.catalog?.result || {};
  const cc = catalog.commercial_catalog || catalog.commercial_content || {};
  console.log(`  INVOICE_DESC: ${cc.invoice_description || "MISSING"}`);
  console.log(`  MOBILE_DESC: ${cc.mobile_description || "MISSING"}`);
  console.log(`  SHORT_DESC: ${(cc.short_description || "MISSING").substring(0, 100)}`);

  return result.body;
}

async function main() {
  console.log("DocForge Pipeline Verification Test");
  console.log("====================================\n");
  console.log("Testing 3 real product rows from UniHack dataset...\n");

  // Process each row sequentially (to avoid Groq rate limits)
  const resultA = await processRow("ROW A — Abrasives (Diablo Sanding Belt)", ROW_A);
  // Add delay for Groq rate limits
  await new Promise(r => setTimeout(r, 3000));

  const resultB = await processRow("ROW B — Building Materials (TimberTech PVC Decking)", ROW_B);
  await new Promise(r => setTimeout(r, 3000));

  const resultC = await processRow("ROW C — Lighting (Satco LED Ceiling Light)", ROW_C);

  // Now call batch export
  console.log(`\n${"=".repeat(70)}`);
  console.log("Calling POST /api/export/batch...");
  console.log(`${"=".repeat(70)}`);

  const batchResult = await postJSON("/api/export/batch", {});

  if (batchResult.status !== 200) {
    console.log(`  Batch export ERROR: HTTP ${batchResult.status}`);
    console.log(`  Body: ${JSON.stringify(batchResult.body).substring(0, 500)}`);
  } else {
    const csvData = batchResult.body.csv || batchResult.body;
    if (typeof csvData === "string") {
      const outputPath = path.join(__dirname, "verification_output.csv");
      fs.writeFileSync(outputPath, csvData, "utf-8");
      console.log(`  CSV saved to: ${outputPath}`);

      // Spot-check the CSV
      const lines = csvData.split("\n").filter(l => l.trim());
      console.log(`  Total lines (incl header): ${lines.length}`);
      if (lines.length >= 2) {
        const header = lines[0];
        const cols = header.split(",");
        console.log(`  Columns: ${cols.length}`);

        // Find key column indices
        const mpnIdx = cols.findIndex(c => c.includes("Mfg_Part_Num") || c.includes("MANUFACTURER_PART_NUMBER"));
        const mfgIdx = cols.findIndex(c => c.includes("MANUFACTURER_NAME"));
        const deptIdx = cols.findIndex(c => c.includes("Dept"));
        const classIdx = cols.findIndex(c => c.includes("Class"));
        const mobileIdx = cols.findIndex(c => c.includes("MOBILE_DESC"));
        const invoiceIdx = cols.findIndex(c => c.includes("INVOICE_DESC"));
        const attr1LabelIdx = cols.findIndex(c => c.includes("ATTRIBUTE_LABEL 1") || c.includes("ATTRIBUTE_LABEL_1"));

        console.log(`\n  SPOT-CHECK RESULTS:`);
        for (let i = 1; i < lines.length && i <= 3; i++) {
          // Simple CSV parse (won't handle all edge cases but good enough for spot-check)
          const vals = lines[i].split(",");
          console.log(`\n  Row ${i}:`);
          console.log(`    MPN:               ${mpnIdx >= 0 ? vals[mpnIdx] : "col not found"}`);
          console.log(`    MANUFACTURER_NAME:  ${mfgIdx >= 0 ? vals[mfgIdx] : "col not found"}`);
          console.log(`    Dept:              ${deptIdx >= 0 ? vals[deptIdx] : "col not found"}`);
          console.log(`    Class:             ${classIdx >= 0 ? vals[classIdx] : "col not found"}`);
          console.log(`    MOBILE_DESC:       ${mobileIdx >= 0 ? (vals[mobileIdx] || "").substring(0, 80) : "col not found"}`);
          console.log(`    INVOICE_DESC:      ${invoiceIdx >= 0 ? vals[invoiceIdx] : "col not found"}`);
          console.log(`    ATTR_LABEL_1:      ${attr1LabelIdx >= 0 ? vals[attr1LabelIdx] : "col not found"}`);
          if (attr1LabelIdx >= 0 && vals[attr1LabelIdx + 1]) {
            console.log(`    ATTR_VALUE_1:      ${vals[attr1LabelIdx + 1]}`);
          }
        }
      }
    } else {
      // It returned JSON, not raw CSV
      const outputPath = path.join(__dirname, "verification_output.json");
      fs.writeFileSync(outputPath, JSON.stringify(batchResult.body, null, 2), "utf-8");
      console.log(`  Response was JSON (not CSV). Saved to: ${outputPath}`);
      // Check if there's a rows or data field
      const rows = batchResult.body.rows || batchResult.body.data || [];
      console.log(`  Rows in response: ${Array.isArray(rows) ? rows.length : "N/A"}`);
      if (Array.isArray(rows) && rows.length > 0) {
        rows.forEach((row, i) => {
          console.log(`\n  Row ${i+1}:`);
          console.log(`    MPN:               ${row.Mfg_Part_Num || row.MANUFACTURER_PART_NUMBER || "MISSING"}`);
          console.log(`    MANUFACTURER_NAME:  ${row.MANUFACTURER_NAME || "MISSING"}`);
          console.log(`    Dept:              ${row.Dept || "MISSING"}`);
          console.log(`    Class:             ${row.Class || "MISSING"}`);
          console.log(`    MOBILE_DESC:       ${(row.MOBILE_DESC || "MISSING").substring(0, 80)}`);
          console.log(`    INVOICE_DESC:      ${row.INVOICE_DESC || "MISSING"}`);
          console.log(`    ATTR_LABEL_1:      ${row["ATTRIBUTE_LABEL 1"] || row.ATTRIBUTE_LABEL_1 || "MISSING"}`);
          console.log(`    ATTR_VALUE_1:      ${row["ATTRIBUTE_VALUE 1"] || row.ATTRIBUTE_VALUE_1 || "MISSING"}`);
        });
      }
    }
  }

  console.log("\n\nDone.");
}

main().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
