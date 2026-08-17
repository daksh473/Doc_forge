const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');

const products = mockProducts.getProducts();

const updatedProducts = products.map((p, index) => {
  // Base scores
  let ext_score = 95;
  let src_score = 100;
  let val_score = 100;
  let norm_score = 100;
  let cat_score = 95;

  let label = "catalog_ready";
  let rec = "auto_publish";
  let color = "green";
  let issues = [];
  let priority_actions = [];
  let one_line = "Product is fully enriched, validated, and ready for the catalog.";

  // Product 0: Ball Valve (WARNING injected in Phase 8)
  if (index === 0) {
    val_score = 90; // -10 for WARNING
    label = "publish_with_review";
    rec = "review_then_publish";
    color = "amber";
    issues = ["Pressure rating (1000 WOG) lacks wall thickness class."];
    priority_actions = [{
      priority: "2",
      action_type: "verify",
      description: "Verify if 1000 WOG is standard for this series or requires a heavy-duty rating note.",
      affected_attributes: ["Pressure Rating"],
      estimated_score_gain: 10
    }];
    one_line = "Data is solid, but a pressure rating anomaly requires a quick sanity check.";
  }

  // Product 1: Pressure Transmitter (CRITICAL injected in Phase 8)
  if (index === 1) {
    val_score = 70; // -30 for CRITICAL
    ext_score = 80; // Some missing fields maybe
    label = "insufficient_data";
    rec = "return_to_source";
    color = "red";
    issues = [
      "CRITICAL: Operating temp exceeds material limit.",
      "Missing critical identifier for cooling tower."
    ];
    priority_actions = [{
      priority: "1",
      action_type: "fix",
      description: "Resolve temperature limit contradiction or add cooling tower accessory SKU.",
      affected_attributes: ["Operating Temperature", "Accessories"],
      estimated_score_gain: 30
    }];
    one_line = "Cannot publish: critical safety contradiction between operating temperature and specified materials.";
  }

  const final_raw = Math.round((ext_score * 0.3) + (src_score * 0.25) + (val_score * 0.25) + (norm_score * 0.1) + (cat_score * 0.1));

  p.quality_score = {
    pipeline_id: "pl_" + Math.random().toString(36).substr(2, 9),
    scoring_timestamp: new Date().toISOString(),
    dimension_scores: {
      extraction_completeness: {
        raw_score: ext_score, weight: 0.30, weighted_score: ext_score * 0.3, score_breakdown: "Most TIER 1 and TIER 2 attributes extracted."
      },
      source_data_quality: {
        raw_score: src_score, weight: 0.25, weighted_score: src_score * 0.25, score_breakdown: "Clean tabular document structure."
      },
      validation_outcome: {
        raw_score: val_score, weight: 0.25, weighted_score: val_score * 0.25, score_breakdown: val_score === 100 ? "Clean validation." : "Validation issues detected."
      },
      normalization_coverage: {
        raw_score: norm_score, weight: 0.10, weighted_score: norm_score * 0.10, score_breakdown: "100% of numeric attributes normalized."
      },
      catalog_content_quality: {
        raw_score: cat_score, weight: 0.10, weighted_score: cat_score * 0.10, score_breakdown: "Detailed description and bullets successfully generated."
      }
    },
    final_score: {
      score: final_raw,
      label: label,
      publish_recommendation: rec,
      confidence_color: color
    },
    priority_actions: priority_actions,
    reviewer_summary: {
      one_line_verdict: one_line,
      top_3_issues: issues,
      top_3_strengths: [
        "Comprehensive dimensional data extracted.",
        "Accurate taxonomy classification.",
        "High quality commercial content generated."
      ]
    }
  };
  
  return p;
});

const output = `// Mock Data for DocForge
// Contains full payloads for 8 stages: extraction, normalization, enrichment, validation, cataloging, scoring
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
console.log('mockProducts.js updated with quality_score data!');
