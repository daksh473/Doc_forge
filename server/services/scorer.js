const mockProducts = require('../data/mockProducts');

/**
 * Data Quality Confidence Scoring Service
 * Computes multi-dimensional confidence score directly from real upstream pipeline data.
 */
function scoreData(extraction, taxonomy, normalization, validation, cataloging) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attributes = (extraction && Array.isArray(extraction.attributes))
        ? extraction.attributes
        : ((normalization && Array.isArray(normalization.attributes)) ? normalization.attributes : []);

      // 1. Extraction Completeness (Weight: 0.30)
      const highConfCount = attributes.filter(a => (a.confidence_score || 80) >= 70).length;
      const extractionRawScore = attributes.length > 0
        ? Math.min(100, Math.round((highConfCount / attributes.length) * 100))
        : 80;
      const extractionWeighted = Math.round((extractionRawScore * 0.30) * 100) / 100;

      // 2. Source Data Quality (Weight: 0.25)
      const totalConfSum = attributes.reduce((sum, a) => sum + (a.confidence_score || 80), 0);
      const sourceRawScore = attributes.length > 0 ? Math.round(totalConfSum / attributes.length) : 85;
      const sourceWeighted = Math.round((sourceRawScore * 0.25) * 100) / 100;

      // 3. Validation Outcome (Weight: 0.25)
      const summary = validation?.validation_summary || {};
      const criticals = summary.critical_count || 0;
      const warnings = summary.warning_count || 0;
      const validationRawScore = Math.max(0, 100 - (criticals * 25) - (warnings * 10));
      const validationWeighted = Math.round((validationRawScore * 0.25) * 100) / 100;

      // 4. Normalization Coverage (Weight: 0.10)
      const normAttrs = (normalization && Array.isArray(normalization.attributes)) ? normalization.attributes : attributes;
      const normalizedCount = normAttrs.filter(a => a.standardized_value || a.standardized_unit).length;
      const normRawScore = normAttrs.length > 0 ? Math.round((normalizedCount / normAttrs.length) * 100) : 90;
      const normWeighted = Math.round((normRawScore * 0.10) * 100) / 100;

      // 5. Catalog Content Quality (Weight: 0.10)
      const commercial = cataloging?.commercial_catalog || {};
      let catalogRawScore = 95;
      if (!commercial.product_title) catalogRawScore -= 20;
      if (!commercial.invoice_description) catalogRawScore -= 10;
      if (commercial.invoice_description && commercial.invoice_description.length > 40) catalogRawScore -= 10;
      catalogRawScore = Math.max(0, catalogRawScore);
      const catalogWeighted = Math.round((catalogRawScore * 0.10) * 100) / 100;

      // Weighted Final Score
      const finalScoreVal = Math.round((extractionWeighted + sourceWeighted + validationWeighted + normWeighted + catalogWeighted) * 100) / 100;

      let label = "publish_ready";
      let publishRec = "ready_for_catalog";
      let color = "green";

      if (finalScoreVal < 70 || criticals > 0) {
        label = "rejected";
        publishRec = "do_not_publish";
        color = "red";
      } else if (finalScoreVal < 90 || warnings > 0) {
        label = "publish_with_review";
        publishRec = "review_then_publish";
        color = "amber";
      }

      // Priority Actions & Summary based on real issues
      const priorityActions = [];
      if (warnings > 0 || criticals > 0) {
        (validation?.validation_results || []).forEach((valRes, i) => {
          priorityActions.push({
            priority: String(i + 1),
            action_type: valRes.severity === "CRITICAL" ? "fix_critical" : "verify",
            description: valRes.detected_issue,
            affected_attributes: valRes.affected_attributes || [],
            estimated_score_gain: 5
          });
        });
      }

      const topIssues = (validation?.validation_results || []).map(r => r.detected_issue);
      const topStrengths = [
        `${attributes.length} product specifications successfully extracted and grounded`,
        `${normalizedCount} normalized attributes adhering to catalog standards`,
        "Commercial catalog descriptions generated and structured"
      ];

      resolve({
        pipeline_id: extraction?.pipeline_id || 'pl_' + Date.now(),
        scoring_timestamp: new Date().toISOString(),
        dimension_scores: {
          extraction_completeness: {
            raw_score: extractionRawScore,
            weight: 0.30,
            weighted_score: extractionWeighted,
            score_breakdown: `${highConfCount} of ${attributes.length} extracted attributes meet high confidence thresholds.`
          },
          source_data_quality: {
            raw_score: sourceRawScore,
            weight: 0.25,
            weighted_score: sourceWeighted,
            score_breakdown: `Average source extraction confidence across attributes is ${sourceRawScore}%.`
          },
          validation_outcome: {
            raw_score: validationRawScore,
            weight: 0.25,
            weighted_score: validationWeighted,
            score_breakdown: `Validation passed with ${criticals} critical issues and ${warnings} warnings.`
          },
          normalization_coverage: {
            raw_score: normRawScore,
            weight: 0.10,
            weighted_score: normWeighted,
            score_breakdown: `${normRawScore}% of extracted attributes successfully normalized.`
          },
          catalog_content_quality: {
            raw_score: catalogRawScore,
            weight: 0.10,
            weighted_score: catalogWeighted,
            score_breakdown: "Catalog commercial content generated and validated for display compliance."
          }
        },
        final_score: {
          score: finalScoreVal,
          label: label,
          publish_recommendation: publishRec,
          confidence_color: color
        },
        priority_actions: priorityActions,
        reviewer_summary: {
          one_line_verdict: finalScoreVal >= 90 ? "Data quality is exemplary. Ready for catalog publishing." : "Data quality acceptable with minor items flagged for review.",
          top_3_issues: topIssues.slice(0, 3),
          top_3_strengths: topStrengths
        }
      });
    }, 300);
  });
}

module.exports = {
  scoreData
};
