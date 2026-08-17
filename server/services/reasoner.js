const mockProducts = require('../data/mockProducts');

/**
 * AI Reasoning Transparency Service
 * Generates clear logic chains for inferred attributes.
 */
function reasonData(extraction, validation, grounding) {
  return new Promise((resolve) => {
    // Simulate reasoning generation
    setTimeout(() => {
      const products = mockProducts.getProducts();
      let product = products[0];
      
      if (validation && validation.product_type_detected) {
        const type = validation.product_type_detected.toLowerCase();
        if (type.includes('valve')) product = products[0];
        else if (type.includes('pressure')) product = products[1];
        else if (type.includes('solenoid')) product = products[2];
        else if (type.includes('fitting')) product = products[3];
        else if (type.includes('drive')) product = products[4];
        else if (type.includes('temperature')) product = products[5];
      }

      if (product && product.reasoning) {
        resolve(product.reasoning);
      } else {
        resolve({
          pipeline_id: 'pl_' + Date.now(),
          reasoning_timestamp: new Date().toISOString(),
          total_logs_generated: 0,
          logs_by_type: { inferred_attributes: 0, low_confidence_attributes: 0, conflict_attributes: 0, validation_flagged_attributes: 0 },
          reasoning_logs: [],
          module_4_summary: {
            fully_grounded_attributes: 0,
            inferred_attributes_logged: 0,
            conflict_attributes_logged: 0,
            block_risk_attributes: [],
            approve_if_correct_count: 0,
            check_document_count: 0,
            contact_supplier_count: 0,
            discard_value_count: 0,
            overall_explainability_score: 100,
            ready_for_human_review: true,
            review_estimated_time: "No review needed"
          }
        });
      }
    }, 1500 + Math.random() * 500);
  });
}

module.exports = {
  reasonData
};
