/**
 * Industrial Catalog Export Engine Service (UniHack Expected Output - Delivery Format)
 * Computes exact 252-column UniHack delivery format CSV output from real pipeline data.
 */

const EXPORT_HEADERS_252 = [
  "MFR URL", "Ref URL 1", "Ref URL 2", "Ref URL 3", "Ref URL 4", "Ref URL 5", "PART_NUMBER",
  "Dept", "Class", "Fine", "SKU - MY_PART_NUMBER", "Mfg_Part_Num", "Part_Desc", "E1_Brand",
  "Unilog_Brand", "DIB_Brand", "Part_Manuf", "MANUFACTURER_NAME", "BRAND_NAME", "TRADE_NAME",
  "MANUFACTURER_PART_NUMBER", "ALTERNATE_PART_NUMBER", "Classpath", "MOBILE_DESC", "INVOICE_DESC",
  "SHORT_DESC", "LONG_DESC1", "RETAIL_DESC", "MARKETING_DESCRIPTION",
  "ITEM_FEATURES_1", "ITEM_FEATURES_2", "ITEM_FEATURES_3", "ITEM_FEATURES_4", "ITEM_FEATURES_5",
  "ITEM_FEATURES_6", "ITEM_FEATURES_7", "ITEM_FEATURES_8", "ITEM_FEATURES_9", "ITEM_FEATURES_10",
  "ITEM_FEATURES_11", "ITEM_FEATURES_12", "ITEM_FEATURES_13", "ITEM_FEATURES_14", "ITEM_FEATURES_15",
  "ITEM_FEATURES_16", "ITEM_FEATURES_17", "ITEM_FEATURES_18", "ITEM_FEATURES_19", "ITEM_FEATURES_20",
  "With", "Standard/Approvals", "Prop 65", "Application", "Includes", "Product Name",
  "ATTRIBUTE_LABEL 1", "ATTRIBUTE_VALUE 1", "ATTRIBUTE_UOM 1",
  "ATTRIBUTE_LABEL 2", "ATTRIBUTE_VALUE 2", "ATTRIBUTE_UOM 2",
  "ATTRIBUTE_LABEL 3", "ATTRIBUTE_VALUE 3", "ATTRIBUTE_UOM 3",
  "ATTRIBUTE_LABEL 4", "ATTRIBUTE_VALUE 4", "ATTRIBUTE_UOM 4",
  "ATTRIBUTE_LABEL 5", "ATTRIBUTE_VALUE 5", "ATTRIBUTE_UOM 5",
  "ATTRIBUTE_LABEL 6", "ATTRIBUTE_VALUE 6", "ATTRIBUTE_UOM 6",
  "ATTRIBUTE_LABEL 7", "ATTRIBUTE_VALUE 7", "ATTRIBUTE_UOM 7",
  "ATTRIBUTE_LABEL 8", "ATTRIBUTE_VALUE 8", "ATTRIBUTE_UOM 8",
  "ATTRIBUTE_LABEL 9", "ATTRIBUTE_VALUE 9", "ATTRIBUTE_UOM 9",
  "ATTRIBUTE_LABEL 10", "ATTRIBUTE_VALUE 10", "ATTRIBUTE_UOM 10",
  "ATTRIBUTE_LABEL 11", "ATTRIBUTE_VALUE 11", "ATTRIBUTE_UOM 11",
  "ATTRIBUTE_LABEL 12", "ATTRIBUTE_VALUE 12", "ATTRIBUTE_UOM 12",
  "ATTRIBUTE_LABEL 13", "ATTRIBUTE_VALUE 13", "ATTRIBUTE_UOM 13",
  "ATTRIBUTE_LABEL 14", "ATTRIBUTE_VALUE 14", "ATTRIBUTE_UOM 14",
  "ATTRIBUTE_LABEL 15", "ATTRIBUTE_VALUE 15", "ATTRIBUTE_UOM 15",
  "ATTRIBUTE_LABEL 16", "ATTRIBUTE_VALUE 16", "ATTRIBUTE_UOM 16",
  "ATTRIBUTE_LABEL 17", "ATTRIBUTE_VALUE 17", "ATTRIBUTE_UOM 17",
  "ATTRIBUTE_LABEL 18", "ATTRIBUTE_VALUE 18", "ATTRIBUTE_UOM 18",
  "ATTRIBUTE_LABEL 19", "ATTRIBUTE_VALUE 19", "ATTRIBUTE_UOM 19",
  "ATTRIBUTE_LABEL 20", "ATTRIBUTE_VALUE 20", "ATTRIBUTE_UOM 20",
  "ATTRIBUTE_LABEL 21", "ATTRIBUTE_VALUE 21", "ATTRIBUTE_UOM 21",
  "ATTRIBUTE_LABEL 22", "ATTRIBUTE_VALUE 22", "ATTRIBUTE_UOM 22",
  "ATTRIBUTE_LABEL 23", "ATTRIBUTE_VALUE 23", "ATTRIBUTE_UOM 23",
  "ATTRIBUTE_LABEL 24", "ATTRIBUTE_VALUE 24", "ATTRIBUTE_UOM 24",
  "ATTRIBUTE_LABEL 25", "ATTRIBUTE_VALUE 25", "ATTRIBUTE_UOM 25",
  "ATTRIBUTE_LABEL 26", "ATTRIBUTE_VALUE 26", "ATTRIBUTE_UOM 26",
  "ATTRIBUTE_LABEL 27", "ATTRIBUTE_VALUE 27", "ATTRIBUTE_UOM 27",
  "ATTRIBUTE_LABEL 28", "ATTRIBUTE_VALUE 28", "ATTRIBUTE_UOM 28",
  "ATTRIBUTE_LABEL 29", "ATTRIBUTE_VALUE 29", "ATTRIBUTE_UOM 29",
  "ATTRIBUTE_LABEL 30", "ATTRIBUTE_VALUE 30", "ATTRIBUTE_UOM 30",
  "ATTRIBUTE_LABEL 31", "ATTRIBUTE_VALUE 31", "ATTRIBUTE_UOM 31",
  "ATTRIBUTE_LABEL 32", "ATTRIBUTE_VALUE 32", "ATTRIBUTE_UOM 32",
  "ATTRIBUTE_LABEL 33", "ATTRIBUTE_VALUE 33", "ATTRIBUTE_UOM 33",
  "ATTRIBUTE_LABEL 34", "ATTRIBUTE_VALUE 34", "ATTRIBUTE_UOM 34",
  "ATTRIBUTE_LABEL 35", "ATTRIBUTE_VALUE 35", "ATTRIBUTE_UOM 35",
  "ATTRIBUTE_LABEL 36", "ATTRIBUTE_VALUE 36", "ATTRIBUTE_UOM 36",
  "ATTRIBUTE_LABEL 37", "ATTRIBUTE_VALUE 37", "ATTRIBUTE_UOM 37",
  "ATTRIBUTE_LABEL 38", "ATTRIBUTE_VALUE 38", "ATTRIBUTE_UOM 38",
  "ATTRIBUTE_LABEL 39", "ATTRIBUTE_VALUE 39", "ATTRIBUTE_UOM 39",
  "ATTRIBUTE_LABEL 40", "ATTRIBUTE_VALUE 40", "ATTRIBUTE_UOM 40",
  "ATTRIBUTE_LABEL 41", "ATTRIBUTE_VALUE 41", "ATTRIBUTE_UOM 41",
  "ATTRIBUTE_LABEL 42", "ATTRIBUTE_VALUE 42", "ATTRIBUTE_UOM 42",
  "ATTRIBUTE_LABEL 43", "ATTRIBUTE_VALUE 43", "ATTRIBUTE_UOM 43",
  "ATTRIBUTE_LABEL 44", "ATTRIBUTE_VALUE 44", "ATTRIBUTE_UOM 44",
  "ATTRIBUTE_LABEL 45", "ATTRIBUTE_VALUE 45", "ATTRIBUTE_UOM 45",
  "ATTRIBUTE_LABEL 46", "ATTRIBUTE_VALUE 46", "ATTRIBUTE_UOM 46",
  "ATTRIBUTE_LABEL 47", "ATTRIBUTE_VALUE 47", "ATTRIBUTE_UOM 47",
  "ATTRIBUTE_LABEL 48", "ATTRIBUTE_VALUE 48", "ATTRIBUTE_UOM 48",
  "ATTRIBUTE_LABEL 49", "ATTRIBUTE_VALUE 49", "ATTRIBUTE_UOM 49",
  "ATTRIBUTE_LABEL 50", "ATTRIBUTE_VALUE 50", "ATTRIBUTE_UOM 50",
  "UPC", "EAN", "GTIN", "UNSPSC", "Warranty", "List Price", "Selling Qty", "Selling UOM",
  "Standard Packaging Information", "LENGTH", "LENGTH_UOM", "HEIGHT", "HEIGHT_UOM",
  "WIDTH", "WIDTH_UOM", "WEIGHT", "WEIGHT_UOM", "VOLUME", "VOLUME_UOM",
  "Product Image", "Alternate Image 1", "Alternate Image 2", "Alternate Image 3", "Alternate Image 4",
  "SDS", "SDS_1", "Warranty Information", "Catalog", "Specification Sheet",
  "Instruction/Installation Manual", "Service Manual", "Owners/User Manual", "Line Drawing",
  "MTR", "RoHS", "Full Engineering Drawing", "Energy Star Guide", "Technical Bulletin",
  "Submittal", "Compatibility Chart", "Size Chart", "Product Label/Insert", "Video Link",
  "Video Link 1", "Country Of Origin", "Discontinued", "Actual Image (Yes/No)"
];

function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return "";
  const str = String(cell);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function build252ColumnMap(job) {
  const original = job.originalRow || {};
  const stages = job.stages || {};

  const extraction = stages.extract?.result || job.extraction || {};
  const normalization = stages.normalize?.result || job.normalization || {};
  // BUG 2 FIX: Read from stages.taxonomy (real LLM product taxonomy), NOT stages.classify (document format classifier)
  const taxonomy = stages.taxonomy?.result || job.taxonomyResult || {};
  const cataloging = stages.catalog?.result || job.cataloging || {};
  const mfg = stages.mfg?.result || job.mfg || {};
  const webEnrich = stages.webEnrichment?.result || job.webEnrichment || {};
  const digitalAssets = stages.digitalAssets?.result || job.digitalAssets || {};
  const pId = extraction.product_identification || {};
  const comm = cataloging.commercial_catalog || cataloging.commercial_content || {};

  const mfgPartNum = original.Mfg_Part_Num || pId.model_number || pId.part_number || "";
  const partDesc = original.Part_Desc || pId.raw_title || "";
  const e1Brand = original.E1_Brand || "";
  const unilogBrand = original.Unilog_Brand || "";
  const dibBrand = original.DIB_Brand || "";
  const partManuf = original.Part_Manuf || pId.manufacturer || "";

  // Taxonomy — read from real LLM taxonomy classification (category_path array)
  const catPath = taxonomy.taxonomy?.category_path || taxonomy.category_path || [];
  const dept = catPath[0] || "";
  const classCol = catPath[1] || "";
  const fine = catPath[2] || "";
  const classPathStr = catPath.length > 0 ? catPath.join(">") : "";

  // BUG 3 FIX: Manufacturer / Brand — read from mfgNormalizer's canonical_manufacturer / canonical_brand objects
  const mfgObj = mfg.canonical_manufacturer || {};
  const brandObj = mfg.canonical_brand || {};
  const canonicalMfg = mfgObj.MANUFACTURER_NAME || pId.manufacturer || "";
  const brandName = brandObj.BRAND_NAME || (canonicalMfg ? canonicalMfg + "®" : "");

  // Product Name & Descriptions
  const productName = pId.raw_title || comm.product_title || partDesc || "";
  const mobileDesc = comm.mobile_description || "";
  const invoiceDesc = comm.invoice_description || "";
  const shortDesc = comm.short_description || "";
  const longDesc1 = comm.long_description || "";
  const retailDesc = comm.retail_description || "";
  const marketingDesc = comm.marketing_description || "";

  // Features (up to 20)
  const features = Array.isArray(comm.bullet_features) ? comm.bullet_features : [];

  // Attributes list (excluding dedicated fields)
  const rawAttrs = (normalization.attributes && Array.isArray(normalization.attributes))
    ? normalization.attributes
    : (extraction.attributes || []);

  const dedicatedNames = new Set(["product name", "manufacturer", "mfg", "brand", "model number", "part number"]);
  const filteredAttrs = rawAttrs.filter(a => a.attribute_name && !dedicatedNames.has(a.attribute_name.toLowerCase()));
  filteredAttrs.sort((a, b) => (b.confidence_score || 85) - (a.confidence_score || 85));

  // Certifications / Context
  let certsStr = "";
  if (Array.isArray(extraction.certifications_and_compliance)) {
    certsStr = extraction.certifications_and_compliance.map(c => c.standard || c.raw_value).filter(Boolean).join("|");
  }
  const certAttr = rawAttrs.find(a => a.attribute_name && (a.attribute_name.toLowerCase().includes("certif") || a.attribute_name.toLowerCase().includes("approval")));
  if (!certsStr && certAttr) {
    certsStr = certAttr.standardized_value || certAttr.raw_value || "";
  }

  const withAttr = rawAttrs.find(a => a.attribute_name && a.attribute_name.toLowerCase().includes("with"));
  const withVal = withAttr ? (withAttr.standardized_value || withAttr.raw_value || "") : "";

  const appAttr = rawAttrs.find(a => a.attribute_name && a.attribute_name.toLowerCase().includes("application"));
  const appVal = appAttr ? (appAttr.standardized_value || appAttr.raw_value || "") : "";

  const incAttr = rawAttrs.find(a => a.attribute_name && a.attribute_name.toLowerCase().includes("include"));
  const incVal = incAttr ? (incAttr.standardized_value || incAttr.raw_value || "") : "";

  const prop65Attr = rawAttrs.find(a => a.attribute_name && a.attribute_name.toLowerCase().includes("prop 65"));
  const prop65Val = prop65Attr ? (prop65Attr.standardized_value || prop65Attr.raw_value || "") : "";

  // Group I (Logistics / Explicitly present attrs)
  const findAttrVal = (term) => {
    const found = rawAttrs.find(a => a.attribute_name && a.attribute_name.toLowerCase() === term.toLowerCase());
    return found ? (found.standardized_value || found.raw_value || "") : "";
  };

  const upcVal = findAttrVal("upc");
  const eanVal = findAttrVal("ean");
  const gtinVal = findAttrVal("gtin") || pId.gtin || "";
  const unspscVal = findAttrVal("unspsc");
  const warrantyVal = findAttrVal("warranty");
  const countryOfOriginVal = findAttrVal("country of origin") || pId.country_of_origin || "";

  // Digital Assets
  const portfolio = digitalAssets.portfolio || {};
  const primaryImg = portfolio.primary_image?.url || "";
  const altImgs = Array.isArray(portfolio.alternate_images) ? portfolio.alternate_images.map(img => img.url) : [];
  const actualImgYesNo = primaryImg ? "Yes" : "No";

  // MFR URL
  const mfrUrl = webEnrich.source_resolution?.source_url || "";

  // Note: Ref URL 1-5, SDS, Manuals, Line Drawing, MTR, RoHS require extending Manufacturer Web Enrichment module document classification.
  
  const rowMap = {};

  // Group A
  rowMap["MFR URL"] = mfrUrl;
  rowMap["PART_NUMBER"] = mfgPartNum;
  rowMap["Dept"] = dept;
  rowMap["Class"] = classCol;
  rowMap["Fine"] = fine;
  rowMap["SKU - MY_PART_NUMBER"] = mfgPartNum;
  rowMap["Mfg_Part_Num"] = mfgPartNum;
  rowMap["Part_Desc"] = partDesc;
  rowMap["E1_Brand"] = e1Brand;
  rowMap["Unilog_Brand"] = unilogBrand;
  rowMap["DIB_Brand"] = dibBrand;
  rowMap["Part_Manuf"] = partManuf;
  rowMap["MANUFACTURER_NAME"] = canonicalMfg;
  rowMap["BRAND_NAME"] = brandName;
  rowMap["TRADE_NAME"] = "";
  rowMap["MANUFACTURER_PART_NUMBER"] = mfgPartNum;
  rowMap["ALTERNATE_PART_NUMBER"] = "";
  rowMap["Classpath"] = classPathStr;

  // Descriptions
  rowMap["MOBILE_DESC"] = mobileDesc;
  rowMap["INVOICE_DESC"] = invoiceDesc;
  rowMap["SHORT_DESC"] = shortDesc;
  rowMap["LONG_DESC1"] = longDesc1;
  rowMap["RETAIL_DESC"] = retailDesc;
  rowMap["MARKETING_DESCRIPTION"] = marketingDesc;

  // Features
  for (let f = 1; f <= 20; f++) {
    rowMap[`ITEM_FEATURES_${f}`] = features[f - 1] || "";
  }

  // Certifications/Context
  rowMap["With"] = withVal;
  rowMap["Standard/Approvals"] = certsStr;
  rowMap["Prop 65"] = prop65Val;
  rowMap["Application"] = appVal;
  rowMap["Includes"] = incVal;
  rowMap["Product Name"] = productName;

  // Attribute Triples (1 to 50)
  for (let i = 1; i <= 50; i++) {
    const attr = filteredAttrs[i - 1];
    rowMap[`ATTRIBUTE_LABEL ${i}`] = attr ? attr.attribute_name : "";
    rowMap[`ATTRIBUTE_VALUE ${i}`] = attr ? (attr.standardized_value || attr.raw_value || "") : "";
    rowMap[`ATTRIBUTE_UOM ${i}`] = attr ? (attr.standardized_unit || attr.raw_unit || "") : "";
  }

  // Group I
  rowMap["UPC"] = upcVal;
  rowMap["EAN"] = eanVal;
  rowMap["GTIN"] = gtinVal;
  rowMap["UNSPSC"] = unspscVal;
  rowMap["Warranty"] = warrantyVal;
  rowMap["Country Of Origin"] = countryOfOriginVal;

  // Digital Assets
  rowMap["Product Image"] = primaryImg;
  rowMap["Alternate Image 1"] = altImgs[0] || "";
  rowMap["Alternate Image 2"] = altImgs[1] || "";
  rowMap["Alternate Image 3"] = altImgs[2] || "";
  rowMap["Alternate Image 4"] = altImgs[3] || "";
  rowMap["Actual Image (Yes/No)"] = actualImgYesNo;

  return rowMap;
}

function generateBatchCSV(jobsList) {
  if (!Array.isArray(jobsList) || jobsList.length === 0) {
    return "";
  }

  const csvLines = [EXPORT_HEADERS_252.map(escapeCsvCell).join(",")];

  jobsList.forEach(job => {
    const rowMap = build252ColumnMap(job);
    const rowCells = EXPORT_HEADERS_252.map(h => escapeCsvCell(rowMap[h] ?? ""));
    csvLines.push(rowCells.join(","));
  });

  return csvLines.join("\n");
}

function generateExports(approvedData, targetFormats = "all") {
  return new Promise((resolve) => {
    setTimeout(() => {
      const jobId = approvedData.jobId || approvedData.pipeline_id || ("PL_" + Date.now());
      const timestamp = new Date().toISOString();

      const targets = (targetFormats === "all" || !targetFormats) 
        ? ["json_standard", "csv_flat", "pim_akeneo", "erp_sap", "woocommerce"]
        : (Array.isArray(targetFormats) ? targetFormats : [targetFormats]);

      const exports = {};
      const formatsGenerated = [];

      const rowMap = build252ColumnMap(approvedData);

      if (targets.includes("json_standard")) {
        exports.json_standard = {
          generated: true,
          record_count: 1,
          payload: {
            pipeline_id: jobId,
            export_timestamp: timestamp,
            product: rowMap
          }
        };
        formatsGenerated.push("json_standard");
      }

      if (targets.includes("csv_flat")) {
        const csvString = generateBatchCSV([approvedData]);
        const lines = csvString.split("\n");
        const headers = EXPORT_HEADERS_252;
        const row = lines[1] ? lines[1].split(",") : [];

        exports.csv_flat = {
          generated: true,
          headers,
          row,
          csv_string: csvString
        };
        formatsGenerated.push("csv_flat");
      }

      if (targets.includes("pim_akeneo")) {
        exports.pim_akeneo = {
          generated: true,
          payload: {
            identifier: rowMap["SKU - MY_PART_NUMBER"] || rowMap["Mfg_Part_Num"],
            family: rowMap["Class"] || "industrial_catalog",
            categories: [rowMap["Dept"], rowMap["Class"], rowMap["Fine"]].filter(Boolean),
            values: rowMap
          }
        };
        formatsGenerated.push("pim_akeneo");
      }

      if (targets.includes("erp_sap")) {
        const warnings = [];
        const matnr = (rowMap["Mfg_Part_Num"] || "").substring(0, 18);
        const maktx = (rowMap["Product Name"] || "").substring(0, 40);

        exports.erp_sap = {
          generated: true,
          field_mapping_warnings: warnings,
          payload: {
            MATNR: matnr,
            MAKTX: maktx,
            MATKL: rowMap["Class"] || "INDUSTRIAL",
            MEINS: "PCE",
            SAP_ATTRIBUTES: rowMap
          }
        };
        formatsGenerated.push("erp_sap");
      }

      if (targets.includes("woocommerce")) {
        const wooCsvString = generateBatchCSV([approvedData]);
        exports.woocommerce = {
          generated: true,
          csv_string: wooCsvString
        };
        formatsGenerated.push("woocommerce");
      }

      resolve({
        pipeline_id: jobId,
        export_timestamp: timestamp,
        approved_for_export: true,
        exports,
        export_summary: {
          formats_generated: formatsGenerated,
          formats_failed: [],
          export_grade: "A",
          traceability_id: `${jobId}_${Date.now()}`
        }
      });
    }, 300);
  });
}

module.exports = {
  EXPORT_HEADERS_252,
  generateExports,
  generateBatchCSV
};
