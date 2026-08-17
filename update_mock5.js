const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');

const products = mockProducts.getProducts();

const updatedProducts = products.map((p, index) => {
  let val_results = [];
  let overall_status = "PASS";
  let rec = "approved";
  let critical = 0;
  let warning = 0;
  let pass_count = 25;

  const title = p.enrichment?.product_identifiers?.standardized_title || 'Product';

  // Inject a Warning for the Ball Valve
  if (index === 0) {
    val_results.push({
      rule_id: "A2",
      rule_description: "Pressure Rating Logic vs Class Norm",
      severity: "WARNING",
      affected_attributes: ["Pressure Rating", "Connection Type"],
      detected_issue: "Working pressure (1000 WOG) is exceptionally high for a standard threaded fitting without specified wall thickness class.",
      expected_range_or_value: "Typically 600 WOG for standard class",
      actual_value: "1000 WOG",
      remediation_suggestion: "Verify if this is a heavy-duty class valve."
    });
    overall_status = "WARNING";
    rec = "review_required";
    warning = 1;
  }

  // Inject a CRITICAL for the Pressure Transmitter
  if (index === 1) {
    val_results.push({
      rule_id: "A1",
      rule_description: "Temperature Range Logic vs Material",
      severity: "CRITICAL",
      affected_attributes: ["Operating Temperature", "Wetted Parts Material"],
      detected_issue: "Specified max operating temperature exceeds standard limits for standard electronics without heat sinks.",
      expected_range_or_value: "Max 85°C for standard electronics",
      actual_value: "125°C",
      remediation_suggestion: "Confirm if high-temperature variant/cooling tower is included in this exact SKU."
    });
    overall_status = "CRITICAL_BLOCK";
    rec = "blocked";
    critical = 1;
  }

  if (val_results.length === 0) {
    val_results.push({
      rule_id: "ALL",
      rule_description: "All standard rules passed",
      severity: "PASS",
      affected_attributes: [],
      detected_issue: "None",
      expected_range_or_value: "N/A",
      actual_value: "N/A",
      remediation_suggestion: "None"
    });
  }

  p.validation = {
    pipeline_id: "pl_" + Math.random().toString(36).substr(2, 9),
    validation_timestamp: new Date().toISOString(),
    product_type_detected: title,
    overall_validation_status: overall_status,
    publish_recommendation: rec,
    validation_results: val_results,
    completeness_report: {
      mandatory_fields_present: ["Body Material", "Pressure Rating", "Temperature Range", "Size / DN"],
      mandatory_fields_missing: [],
      completeness_score: 100,
      completeness_label: "complete"
    },
    inferred_attributes_review: [
      {
        attribute_name: "Certifications",
        inferred_value: "ISO 9001",
        consistency_with_extracted: "consistent",
        review_priority: "low"
      }
    ],
    validation_summary: {
      total_checks_run: 26,
      critical_count: critical,
      warning_count: warning,
      info_count: 0,
      pass_count: pass_count,
      blocking_issues: critical > 0 ? ["A1"] : []
    }
  };
  
  return p;
});

const output = `// Mock Data for DocForge
// Contains full payloads for 7 stages: extraction, normalization, enrichment, validation, cataloging
const products = ${JSON.stringify(updatedProducts, null, 2)};

module.exports = {
  getProducts: () => products,
  selectProduct: (keywords) => {
    if (!keywords) return products[0];
    const kw = keywords.toLowerCase();
    if (kw.includes('ball valve')) return products[0];
    if (kw.includes('pressure transmitter')) return products[1];
    if (kw.includes('solenoid')) return products[2];
    if (kw.includes('fitting') || kw.includes('elbow')) return products[3];
    if (kw.includes('vfd') || kw.includes('drive')) return products[4];
    if (kw.includes('rtd') || kw.includes('sensor')) return products[5];
    return products[0]; // fallback
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'server', 'data', 'mockProducts.js'), output);
console.log('mockProducts.js updated with validation data!');
