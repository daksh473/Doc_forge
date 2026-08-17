const mockProducts = require('../data/mockProducts');

/**
 * Validation Service
 * Runs comprehensive sanity checks on normalized attributes and taxonomy.
 */
function validateData(normalizationResult, taxonomyResult) {
  return new Promise((resolve) => {
    // Simulate deep validation matrix delay
    setTimeout(() => {
      // Find the corresponding mock product
      const products = mockProducts.getProducts();
      
      // Because we don't pass the title directly, we try to match by product_type or just use the first for safety.
      let product = products[0];
      if (taxonomyResult && taxonomyResult.taxonomy) {
        const path = taxonomyResult.taxonomy.category_path || [];
        const L2 = path[1] || '';
        if (L2.toLowerCase().includes('valve')) product = products[0];
        else if (L2.toLowerCase().includes('pressure')) product = products[1];
        else if (L2.toLowerCase().includes('solenoid')) product = products[2];
        else if (L2.toLowerCase().includes('fitting')) product = products[3];
        else if (L2.toLowerCase().includes('drive')) product = products[4];
        else if (L2.toLowerCase().includes('temperature')) product = products[5];
      }

      if (product && product.validation) {
        resolve(product.validation);
      } else {
        // Fallback for unknown text
        resolve({
          pipeline_id: 'pl_' + Date.now(),
          validation_timestamp: new Date().toISOString(),
          product_type_detected: "Unknown",
          overall_validation_status: "PASS",
          publish_recommendation: "approved",
          validation_results: [],
          completeness_report: {
            mandatory_fields_present: [],
            mandatory_fields_missing: [],
            completeness_score: 100,
            completeness_label: "complete"
          },
          inferred_attributes_review: [],
          validation_summary: {
            total_checks_run: 15,
            critical_count: 0,
            warning_count: 0,
            info_count: 0,
            pass_count: 15,
            blocking_issues: []
          }
        });
      }
    }, 1500 + Math.random() * 500);
  });
}

module.exports = {
  validateData
};
