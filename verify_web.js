/**
 * DocForge Pipeline Web Enrichment Verification Test
 */
const http = require('http');
const fs = require('fs');

const ROW = {
  Mfg_Part_Num: "PDSH4816AF",
  Part_Desc: "PDSH4816AF Dishwasher SS - Display Only",
  E1_Brand: "-- Unbranded --",
  Unilog_Brand: "-- No Unilog Brand --",
  DIB_Brand: "-- No DIB Brand --",
  Part_Manuf: "Appliance Dealers Cooperative (APPDE)"
};

function makeTextBlock(row) {
  return [
    `Manufacturer Part Number: ${row.Mfg_Part_Num}`,
    `Product Description: ${row.Part_Desc}`,
    `Manufacturer: ${row.Part_Manuf}`
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
        try { resolve({ status: res.statusCode, body: JSON.parse(chunks) }); } 
        catch (e) { resolve({ status: res.statusCode, body: chunks }); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log("Web Enrichment Verification Test: PDSH4816AF");
  console.log("==================================================");

  const textBlock = makeTextBlock(ROW);
  const result = await postJSON("/api/pipeline/full", {
    text: textBlock,
    originalRow: ROW
  });

  if (result.status !== 200) {
    console.log(`ERROR: HTTP ${result.status}`);
    return;
  }

  const stages = result.body.stages || {};
  
  const mfg = stages.mfg?.result || {};
  console.log(`MANUFACTURER_NAME: ${mfg.canonical_manufacturer?.MANUFACTURER_NAME || "MISSING"}`);

  const web = stages.webEnrichment?.result || {};
  console.log(`\n--- WEB ENRICHMENT ---`);
  console.log(`Status: ${web.status}`);
  if (web.source_resolution) {
    console.log(`Source Found: ${web.source_resolution.source_found}`);
    console.log(`Source URL: ${web.source_resolution.source_url}`);
    console.log(`Domain: ${web.source_resolution.official_domain}`);
  }
  if (web.fetch_metadata) {
     console.log(`Fetch HTTP Status: ${web.fetch_metadata.http_status}`);
  }
  console.log(`Conflicts Detected: ${web.conflicts_detected}`);
  console.log(`\nEnrichment Log:`);
  (web.enrichment_log || []).forEach(log => {
     console.log(` - [${log.field}] ${log.action}: ${typeof log.value === 'string' ? log.value.substring(0, 80) + '...' : JSON.stringify(log.value)}`);
  });

  const assets = stages.digitalAssets?.result || {};
  console.log(`\n--- DIGITAL ASSETS ---`);
  console.log(`Status: ${assets.status}`);
  if (assets.technical_validation_summary) {
    console.log(`Candidates Evaluated: ${assets.technical_validation_summary.candidates_evaluated}`);
    console.log(`Passed Technical Validation: ${assets.technical_validation_summary.passed_technical_validation}`);
  }
  if (assets.digital_assets_portfolio) {
    const primary = assets.digital_assets_portfolio.primary_image;
    if (primary) {
       console.log(`Primary Image: ${primary.source_url}`);
       console.log(`Resolution: ${primary.technical_specs?.resolution}`);
    }
  }

  console.log("\nDone.");
}

main();
