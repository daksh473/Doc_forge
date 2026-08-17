const mockProducts = require('../data/mockProducts');

/**
 * AI Reasoning Transparency Service
 * Generates transparent logic chains and audit logs from real extracted attribute metadata.
 */
function reasonData(extraction, validation, grounding) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attributes = (extraction && Array.isArray(extraction.attributes))
        ? extraction.attributes
        : [];

      const reasoningLogs = [];
      let inferredCount = 0;
      let lowConfCount = 0;
      let conflictCount = 0;
      let validationFlaggedCount = 0;

      let approveIfCorrectCount = 0;
      let checkDocumentCount = 0;
      let contactSupplierCount = 0;
      let discardValueCount = 0;

      let fullyGroundedCount = 0;

      attributes.forEach((attr, idx) => {
        const conf = attr.confidence_score || 85;
        const isInferred = Boolean(attr.inferred);
        const hasConflict = Boolean(attr.conflict_detected);
        const isLowConf = conf < 70;

        if (!isInferred && !hasConflict && conf >= 80) {
          fullyGroundedCount++;
        }

        if (isInferred || hasConflict || isLowConf) {
          if (isInferred) inferredCount++;
          if (hasConflict) conflictCount++;
          if (isLowConf) lowConfCount++;

          let recAction = "approve_if_correct";
          if (conf >= 80) {
            recAction = "approve_if_correct";
            approveIfCorrectCount++;
          } else if (conf >= 60) {
            recAction = "check_document";
            checkDocumentCount++;
          } else if (conf >= 40) {
            recAction = "contact_supplier";
            contactSupplierCount++;
          } else {
            recAction = "discard_value";
            discardValueCount++;
          }

          let logType = "low_confidence_attributes";
          let triggerCond = "low_extraction_confidence";
          let chain = `Confidence score is ${conf}%. Grounded snippet: "${attr.source_grounding?.source_snippet || attr.raw_value || ''}".`;

          if (hasConflict) {
            logType = "conflict_attributes";
            triggerCond = "conflicting_sources_found";
            chain = `Conflicting values found across sections. Extracted value '${attr.raw_value}' differs from alternate instances.`;
          } else if (isInferred) {
            logType = "inferred_attributes";
            triggerCond = "missing_explicit_statement";
            chain = attr.inference_basis 
              ? `Inferred using standard domain rule: ${attr.inference_basis}`
              : `Inferred from standard domain context for ${attr.attribute_name}.`;
          }

          reasoningLogs.push({
            log_id: `LOG_${String(reasoningLogs.length + 1).padStart(3, '0')}`,
            attribute_name: attr.attribute_name,
            target_value: attr.standardized_value || attr.raw_value || "",
            log_type: logType,
            trigger_condition: triggerCond,
            reasoning_chain: chain,
            recommended_action: recAction
          });
        }
      });

      const totalLogs = reasoningLogs.length;
      const totalAttrs = attributes.length;
      const explainabilityScore = totalAttrs > 0
        ? Math.round((fullyGroundedCount / totalAttrs) * 100)
        : 100;

      resolve({
        pipeline_id: extraction?.pipeline_id || 'pl_' + Date.now(),
        reasoning_timestamp: new Date().toISOString(),
        total_logs_generated: totalLogs,
        logs_by_type: {
          inferred_attributes: inferredCount,
          low_confidence_attributes: lowConfCount,
          conflict_attributes: conflictCount,
          validation_flagged_attributes: validationFlaggedCount
        },
        reasoning_logs: reasoningLogs,
        module_4_summary: {
          fully_grounded_attributes: fullyGroundedCount,
          inferred_attributes_logged: inferredCount,
          conflict_attributes_logged: conflictCount,
          block_risk_attributes: reasoningLogs.filter(l => l.recommended_action === "discard_value").map(l => l.attribute_name),
          approve_if_correct_count: approveIfCorrectCount,
          check_document_count: checkDocumentCount,
          contact_supplier_count: contactSupplierCount,
          discard_value_count: discardValueCount,
          overall_explainability_score: explainabilityScore,
          ready_for_human_review: totalLogs > 0,
          review_estimated_time: totalLogs === 0 ? "No review needed" : `${totalLogs * 2} mins`
        }
      });
    }, 300);
  });
}

module.exports = {
  reasonData
};
