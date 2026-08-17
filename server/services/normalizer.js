const mockProducts = require('../data/mockProducts');

/**
 * Normalization Service
 * Takes extracted attributes and normalizes units based on B2B engineering matrices.
 */
function normalizeData(extractionResult, classification) {
  return new Promise((resolve) => {
    // Simulate complex math/regex conversion delay
    setTimeout(() => {
      // Get the product logic via keywords from raw title
      const title = extractionResult.product_identification.raw_title || '';
      const product = mockProducts.selectProduct(title);

      if (product && product.normalization) {
        // Return pre-computed normalization block
        resolve(product.normalization);
      } else {
        // Fallback for unknown text
        resolve({
          pipeline_id: 'pl_' + Date.now(),
          normalization_timestamp: new Date().toISOString(),
          normalized_attributes: [],
          normalization_summary: {
            total_attributes: 0,
            normalized_count: 0,
            passthrough_count: 0,
            ambiguous_count: 0,
            manual_review_required: [],
            normalization_quality: 'low'
          }
        });
      }
    }, 1200 + Math.random() * 800);
  });
}

module.exports = {
  normalizeData
};
