const mockProducts = require('../data/mockProducts');

/**
 * Data Quality Confidence Scoring Service
 * Computes a multi-dimensional confidence score for the complete product entry.
 */
function scoreData(extraction, taxonomy, normalization, validation, cataloging) {
  return new Promise((resolve) => {
    // Simulate deep scoring matrix logic
    setTimeout(() => {
      const products = mockProducts.getProducts();
      let product = products[0];
      
      // Match by taxonomy/title if possible
      if (taxonomy && taxonomy.taxonomy && taxonomy.taxonomy.category_path) {
        const path = taxonomy.taxonomy.category_path || [];
        const L2 = path[1] || '';
        if (L2.toLowerCase().includes('valve')) product = products[0];
        else if (L2.toLowerCase().includes('pressure')) product = products[1];
        else if (L2.toLowerCase().includes('solenoid')) product = products[2];
        else if (L2.toLowerCase().includes('fitting')) product = products[3];
        else if (L2.toLowerCase().includes('drive')) product = products[4];
        else if (L2.toLowerCase().includes('temperature')) product = products[5];
      }

      if (product && product.quality_score) {
        resolve(product.quality_score);
      } else {
        // Fallback score
        resolve({
          pipeline_id: 'pl_' + Date.now(),
          scoring_timestamp: new Date().toISOString(),
          dimension_scores: {
            extraction_completeness: { raw_score: 90, weight: 0.30, weighted_score: 27, score_breakdown: "All Tier 1 present." },
            source_data_quality: { raw_score: 85, weight: 0.25, weighted_score: 21.25, score_breakdown: "Low OCR noise." },
            validation_outcome: { raw_score: 100, weight: 0.25, weighted_score: 25, score_breakdown: "No critical issues." },
            normalization_coverage: { raw_score: 100, weight: 0.10, weighted_score: 10, score_breakdown: "All normalized." },
            catalog_content_quality: { raw_score: 90, weight: 0.10, weighted_score: 9, score_breakdown: "Detailed summary generated." }
          },
          final_score: { score: 92.25, label: "publish_with_review", publish_recommendation: "review_then_publish", confidence_color: "amber" },
          priority_actions: [],
          reviewer_summary: { one_line_verdict: "Ready for quick review.", top_3_issues: [], top_3_strengths: [] }
        });
      }
    }, 1000 + Math.random() * 500);
  });
}

module.exports = {
  scoreData
};
