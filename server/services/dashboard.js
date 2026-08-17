const mockProducts = require('../data/mockProducts');

/**
 * UI Data Preparation Service
 * Generates final dashboard payload for the review interface.
 */
function prepareDashboard(chunking, cataloging, scoring, reasoning) {
  return new Promise((resolve) => {
    // Simulate dashboard generation
    setTimeout(() => {
      const products = mockProducts.getProducts();
      let product = products[0];
      
      if (cataloging && cataloging.product_title && cataloging.product_title.standardized) {
        const title = cataloging.product_title.standardized.toLowerCase();
        if (title.includes('valve')) product = products[0];
        else if (title.includes('pressure')) product = products[1];
        else if (title.includes('solenoid')) product = products[2];
        else if (title.includes('fitting')) product = products[3];
        else if (title.includes('drive')) product = products[4];
        else if (title.includes('temperature')) product = products[5];
      }

      if (product && product.dashboard) {
        resolve(product.dashboard);
      } else {
        resolve({
          pipeline_id: 'pl_' + Date.now(),
          ui_payload_timestamp: new Date().toISOString(),
          source_file: "unknown.pdf",
          left_panel: { pages: [] },
          right_panel: { product_header: {}, field_groups: [] },
          review_queue: { total_fields: 0, auto_approvable_count: 0, needs_review_count: 0, priority_queue: [], estimated_total_review_time: "0 mins" },
          pipeline_status_summary: { overall_pipeline_status: "completed" }
        });
      }
    }, 1500 + Math.random() * 500);
  });
}

module.exports = {
  prepareDashboard
};
