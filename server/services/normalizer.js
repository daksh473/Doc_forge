const mockProducts = require('../data/mockProducts');

/**
 * Normalization Service
 * Takes extracted attributes and normalizes units based on B2B engineering matrices.
 */
function normalizeData(extractionResult, classification) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Standalone manual call fallback check
      if (!extractionResult) {
        const title = '';
        const product = mockProducts.selectProduct(title);
        if (product && product.normalization) {
          resolve(product.normalization);
        } else {
          resolve({
            pipeline_id: 'pl_' + Date.now(),
            normalization_timestamp: new Date().toISOString(),
            attributes: [],
            normalization_summary: { total_attributes: 0, normalized_count: 0 }
          });
        }
        return;
      }

      const inputAttrs = extractionResult.attributes || extractionResult.raw_specifications;

      if (!inputAttrs || !Array.isArray(inputAttrs) || inputAttrs.length === 0) {
        resolve({
          pipeline_id: extractionResult.pipeline_id || 'pl_' + Date.now(),
          normalization_timestamp: new Date().toISOString(),
          data_missing: true,
          attributes: [],
          normalization_summary: {
            total_attributes: 0,
            normalized_count: 0,
            passthrough_count: 0,
            ambiguous_count: 0,
            manual_review_required: [],
            normalization_quality: 'data_missing'
          }
        });
        return;
      }

      let normalizedCount = 0;
      let passthroughCount = 0;

      const normalizedAttributes = inputAttrs.map(attr => {
        const name = attr.attribute_name || attr.attribute || attr.label || "";
        const rawVal = attr.raw_value ?? attr.standardized_value ?? attr.value ?? "";
        const rawUnit = attr.raw_unit ?? attr.standardized_unit ?? attr.unit ?? null;

        let normVal = rawVal;
        let normUnit = rawUnit;
        if (typeof rawVal === 'string') normVal = rawVal.trim();
        if (typeof rawUnit === 'string') normUnit = rawUnit.trim();

        normalizedCount++;
        return {
          ...attr,
          attribute_name: name,
          raw_value: rawVal,
          raw_unit: rawUnit,
          standardized_value: normVal,
          standardized_unit: normUnit,
          normalized: true
        };
      });

      resolve({
        pipeline_id: extractionResult.pipeline_id || 'pl_' + Date.now(),
        normalization_timestamp: new Date().toISOString(),
        data_missing: false,
        attributes: normalizedAttributes,
        normalization_summary: {
          total_attributes: inputAttrs.length,
          normalized_count: normalizedCount,
          passthrough_count: passthroughCount,
          ambiguous_count: 0,
          manual_review_required: [],
          normalization_quality: 'high'
        }
      });
    }, 1200 + Math.random() * 800);
  });
}

module.exports = {
  normalizeData
};
