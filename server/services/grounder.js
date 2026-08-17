const mockProducts = require('../data/mockProducts');

/**
 * Document Grounding Service
 * Generates source citations for extracted attributes.
 */
function groundData(validation, chunking) {
  return new Promise((resolve) => {
    // Simulate citation generation
    setTimeout(() => {
      const products = mockProducts.getProducts();
      let product = products[0];
      
      // Match by title/type
      if (validation && validation.product_type_detected) {
        const type = validation.product_type_detected.toLowerCase();
        if (type.includes('valve')) product = products[0];
        else if (type.includes('pressure')) product = products[1];
        else if (type.includes('solenoid')) product = products[2];
        else if (type.includes('fitting')) product = products[3];
        else if (type.includes('drive')) product = products[4];
        else if (type.includes('temperature')) product = products[5];
      }

      if (product && product.grounding) {
        resolve(product.grounding);
      } else {
        resolve({
          pipeline_id: 'pl_' + Date.now(),
          citation_timestamp: new Date().toISOString(),
          source_file: "document.pdf",
          total_attributes_cited: 0,
          citations: [],
          citation_coverage_report: {
            exact_match_count: 0,
            partial_match_count: 0,
            contextual_match_count: 0,
            inferred_only_count: 0,
            overall_grounding_score: 0,
            grounding_label: "poorly_grounded",
            unverifiable_attributes: [],
            conflict_attributes: []
          }
        });
      }
    }, 1200 + Math.random() * 500);
  });
}

module.exports = {
  groundData
};
