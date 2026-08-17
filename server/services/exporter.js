/**
 * Industrial Catalog Export Engine Service
 * Transforms real approved product data / job objects into 5 target export formats:
 * - json_standard
 * - csv_flat
 * - pim_akeneo
 * - erp_sap
 * - woocommerce
 */

function extractProductRecord(approvedData) {
  const jobId = approvedData.jobId || approvedData.pipeline_id || ("PL_" + Date.now());
  const stages = approvedData.stages || {};
  
  const extraction = stages.extract?.result || approvedData.extraction || {};
  const normalization = stages.normalize?.result || approvedData.normalization || {};
  const taxonomy = stages.classify?.result || approvedData.taxonomy || {};
  const cataloging = stages.catalog?.result || approvedData.cataloging || {};
  const validation = stages.validate?.result || approvedData.validation || {};
  const scoring = stages.score?.result || approvedData.score?.result || approvedData.scoring || {};
  const mod0a = stages.module0a?.result || approvedData.module0a || {};
  const mfg = stages.mfg?.result || approvedData.mfg || {};

  const originalRow = approvedData.originalRow || {};

  const productIdent = extraction.product_identification || {};
  const title = cataloging.commercial_catalog?.product_title || productIdent.raw_title || originalRow.Part_Desc || "Industrial Product";
  const sku = productIdent.model_number || productIdent.part_number || originalRow.Mfg_Part_Num || ("SKU_" + String(jobId).substring(0, 8));
  const mfgName = mfg.canonical_mfg || mfg.Unilog_Brand || productIdent.manufacturer || originalRow.Part_Manuf || originalRow.Unilog_Brand || "";

  const categoryPath = taxonomy.taxonomy?.category_path || taxonomy.category_path || (taxonomy.document_type ? ["Industrial", taxonomy.document_type] : ["Industrial Catalog"]);
  const catL1 = categoryPath[0] || "";
  const catL2 = categoryPath[1] || "";
  const catL3 = categoryPath[2] || "";

  const attributes = (normalization.attributes && Array.isArray(normalization.attributes))
    ? normalization.attributes
    : (extraction.attributes || []);

  const confScore = scoring.final_score?.score || 90;
  const valStatus = validation.overall_validation_status || "PASS";
  const isDuplicate = mod0a.possible_duplicate_of ? "TRUE" : "FALSE";
  const possibleDupOf = mod0a.possible_duplicate_of || "";

  return {
    jobId,
    originalRow,
    sku,
    title,
    mfgName,
    catL1,
    catL2,
    catL3,
    attributes,
    cataloging,
    confScore,
    valStatus,
    isDuplicate,
    possibleDupOf,
    extraction,
    normalization,
    taxonomy,
    validation,
    scoring
  };
}

function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return "";
  const str = String(cell);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRowForRecord(record, allHeaderKeys) {
  const rowMap = {};

  // 1. Original Row fields (if present)
  if (record.originalRow && typeof record.originalRow === 'object') {
    Object.keys(record.originalRow).forEach(k => {
      rowMap[k] = record.originalRow[k];
    });
  }

  // 2. Enriched Pipeline fields
  rowMap["JOB_ID"] = record.jobId;
  rowMap["SKU"] = record.sku;
  rowMap["TITLE"] = record.title;
  rowMap["CANONICAL_MANUFACTURER"] = record.mfgName;
  rowMap["CATEGORY_L1"] = record.catL1;
  rowMap["CATEGORY_L2"] = record.catL2;
  rowMap["CATEGORY_L3"] = record.catL3;
  rowMap["INVOICE_DESCRIPTION"] = record.cataloging.commercial_catalog?.invoice_description || "";
  rowMap["MOBILE_DESCRIPTION"] = record.cataloging.commercial_catalog?.mobile_description || "";
  rowMap["OVERALL_CONFIDENCE_SCORE"] = record.confScore;
  rowMap["VALIDATION_STATUS"] = record.valStatus;
  rowMap["IS_DUPLICATE"] = record.isDuplicate;
  rowMap["POSSIBLE_DUPLICATE_OF"] = record.possibleDupOf;

  // 3. Dynamic Attribute columns
  record.attributes.forEach(attr => {
    if (attr.attribute_name) {
      const colName = "ATTR_" + attr.attribute_name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      const val = attr.standardized_value || attr.raw_value || "";
      const unit = attr.standardized_unit || attr.raw_unit || "";
      rowMap[colName] = unit ? `${val} ${unit}`.trim() : val;
    }
  });

  return allHeaderKeys.map(k => escapeCsvCell(rowMap[k] ?? ""));
}

function generateBatchCSV(jobsList) {
  if (!Array.isArray(jobsList) || jobsList.length === 0) {
    return "";
  }

  const records = jobsList.map(extractProductRecord);
  const headersSet = new Set();

  // First add original row keys if present
  records.forEach(rec => {
    if (rec.originalRow && typeof rec.originalRow === 'object') {
      Object.keys(rec.originalRow).forEach(k => headersSet.add(k));
    }
  });

  // Standard enriched headers
  const standardEnriched = [
    "JOB_ID", "SKU", "TITLE", "CANONICAL_MANUFACTURER",
    "CATEGORY_L1", "CATEGORY_L2", "CATEGORY_L3",
    "INVOICE_DESCRIPTION", "MOBILE_DESCRIPTION",
    "OVERALL_CONFIDENCE_SCORE", "VALIDATION_STATUS",
    "IS_DUPLICATE", "POSSIBLE_DUPLICATE_OF"
  ];
  standardEnriched.forEach(h => headersSet.add(h));

  // Dynamic attribute headers
  records.forEach(rec => {
    rec.attributes.forEach(attr => {
      if (attr.attribute_name) {
        const colName = "ATTR_" + attr.attribute_name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        headersSet.add(colName);
      }
    });
  });

  const allHeaders = Array.from(headersSet);
  const csvLines = [allHeaders.map(escapeCsvCell).join(",")];

  records.forEach(rec => {
    const rowCells = buildCsvRowForRecord(rec, allHeaders);
    csvLines.push(rowCells.join(","));
  });

  return csvLines.join("\n");
}

function generateExports(approvedData, targetFormats = "all") {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rec = extractProductRecord(approvedData);
      const pipelineId = rec.jobId;
      const timestamp = new Date().toISOString();

      const targets = (targetFormats === "all" || !targetFormats) 
        ? ["json_standard", "csv_flat", "pim_akeneo", "erp_sap", "woocommerce"]
        : (Array.isArray(targetFormats) ? targetFormats : [targetFormats]);

      const exports = {};
      const formatsGenerated = [];

      if (targets.includes("json_standard")) {
        exports.json_standard = {
          generated: true,
          record_count: 1,
          payload: {
            pipeline_id: pipelineId,
            export_timestamp: timestamp,
            product: {
              title: rec.title,
              sku: rec.sku,
              manufacturer: rec.mfgName,
              category_l1: rec.catL1,
              category_l2: rec.catL2,
              category_l3: rec.catL3,
              attributes: rec.attributes.map(a => ({
                name: a.attribute_name,
                raw_value: a.raw_value,
                standardized_value: a.standardized_value,
                confidence: a.confidence_score || 85
              })),
              catalog_content: rec.cataloging.commercial_catalog || {},
              data_quality: {
                overall_confidence: rec.confScore,
                validation_status: rec.valStatus
              }
            }
          }
        };
        formatsGenerated.push("json_standard");
      }

      if (targets.includes("csv_flat")) {
        const csvString = generateBatchCSV([approvedData]);
        const lines = csvString.split("\n");
        const headers = lines[0] ? lines[0].split(",") : [];
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
        const attrValues = {};
        rec.attributes.forEach(a => {
          if (a.attribute_name) {
            const key = a.attribute_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            attrValues[key] = [{ data: a.standardized_value || a.raw_value, locale: null, scope: null }];
          }
        });
        exports.pim_akeneo = {
          generated: true,
          payload: {
            identifier: rec.sku,
            family: rec.catL2 ? rec.catL2.toLowerCase().replace(/[^a-z0-9]/g, '_') : "industrial_catalog",
            categories: [rec.catL1, rec.catL2, rec.catL3].filter(Boolean),
            values: {
              title: [{ data: rec.title, locale: null, scope: null }],
              manufacturer: [{ data: rec.mfgName, locale: null, scope: null }],
              ...attrValues
            }
          }
        };
        formatsGenerated.push("pim_akeneo");
      }

      if (targets.includes("erp_sap")) {
        const warnings = [];
        if (rec.sku.length > 18) warnings.push("MATNR exceeded 18 chars limit — truncated.");
        if (rec.title.length > 40) warnings.push("MAKTX exceeded 40 chars limit — truncated.");

        exports.erp_sap = {
          generated: true,
          field_mapping_warnings: warnings,
          payload: {
            MATNR: rec.sku.substring(0, 18).toUpperCase().replace(/\s+/g, ''),
            MAKTX: rec.title.substring(0, 40),
            MATKL: rec.catL2 ? rec.catL2.toUpperCase().replace(/\s+/g, '_') : "INDUSTRIAL",
            MEINS: "PCE",
            SAP_ATTRIBUTES: rec.attributes.reduce((acc, a) => {
              if (a.attribute_name) {
                acc[a.attribute_name.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '_')] = a.standardized_value || a.raw_value;
              }
              return acc;
            }, {})
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
        pipeline_id: pipelineId,
        export_timestamp: timestamp,
        approved_for_export: true,
        exports,
        export_summary: {
          formats_generated: formatsGenerated,
          formats_failed: [],
          export_grade: rec.confScore >= 90 ? "A" : "B",
          traceability_id: `${pipelineId}_${Date.now()}`
        }
      });
    }, 300);
  });
}

module.exports = {
  generateExports,
  generateBatchCSV
};
