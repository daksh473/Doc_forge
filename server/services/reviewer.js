/**
 * Human Review Integration Service
 * Processes edits made by a human reviewer on the dashboard.
 */

function processReview(dashboardPayload, humanEdits) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let editSummary = {
        total_fields_reviewed: humanEdits.length,
        approved_count: 0,
        corrected_count: 0,
        discarded_count: 0,
        escalated_count: 0
      };

      let processedEdits = [];
      let regenRequired = {
        catalog_description: false,
        bullet_features: false,
        category_path: false,
        search_keywords: false,
        unit_normalization: false,
        compliance_validation: false,
        affected_attributes_list: []
      };

      let learningLog = {
        major_corrections: 0,
        moderate_corrections: 0,
        minor_corrections: 0,
        correction_patterns: []
      };

      humanEdits.forEach(edit => {
        let processed = {
          field_id: edit.field_id,
          attribute_name: edit.attribute_name,
          edit_classification: "correction",
          original_ai_value: edit.original_value,
          human_corrected_value: edit.corrected_value,
          reviewer_note: edit.reviewer_note || null,
          updated_confidence: 100,
          human_verified: true,
          delta_log: null,
          cascade_impact: {
            cascade_review_required: false,
            affected_attributes: []
          }
        };

        if (edit.action === 'approved') {
          processed.edit_classification = 'approval';
          processed.updated_confidence = 100;
          editSummary.approved_count++;
        } else if (edit.action === 'discarded') {
          processed.edit_classification = 'discard';
          processed.human_corrected_value = null;
          processed.updated_confidence = 0;
          editSummary.discarded_count++;
        } else if (edit.action === 'escalated') {
          processed.edit_classification = 'escalation';
          processed.human_corrected_value = edit.original_value;
          processed.updated_confidence = 0;
          processed.human_verified = false;
          editSummary.escalated_count++;
        } else if (edit.action === 'corrected') {
          processed.edit_classification = 'correction';
          processed.updated_confidence = 95;
          editSummary.corrected_count++;
          
          let mag = "minor";
          if (edit.original_value && edit.corrected_value && edit.original_value.length > 0) {
             if (!edit.original_value.includes(edit.corrected_value) && !edit.corrected_value.includes(edit.original_value)) {
               mag = "moderate";
             }
          }
          if (edit.attribute_name === 'Body Material' && edit.corrected_value === 'Carbon Steel') {
             mag = "major";
          }

          if (mag === 'minor') learningLog.minor_corrections++;
          if (mag === 'moderate') learningLog.moderate_corrections++;
          if (mag === 'major') learningLog.major_corrections++;

          processed.delta_log = {
            delta_type: "value_change",
            correction_magnitude: mag,
            learning_flag: mag !== 'minor'
          };

          // Cascade logic
          const attr = edit.attribute_name.toLowerCase();
          if (attr.includes('material')) {
            processed.cascade_impact.cascade_review_required = true;
            processed.cascade_impact.affected_attributes = ["Media Compatibility", "Temperature Range", "Certifications"];
            regenRequired.compliance_validation = true;
            regenRequired.affected_attributes_list.push("Media Compatibility");
          } else if (attr.includes('pressure')) {
            processed.cascade_impact.cascade_review_required = true;
            processed.cascade_impact.affected_attributes = ["Class Rating"];
            regenRequired.affected_attributes_list.push("Class Rating");
          } else if (attr.includes('enclosure')) {
             regenRequired.catalog_description = true;
             regenRequired.bullet_features = true;
          }

          if (mag === 'moderate' || mag === 'major') {
            learningLog.correction_patterns.push({
              attribute_name: edit.attribute_name,
              correction_type: mag,
              frequency_note: "Model misidentified value context."
            });
          }
        }

        processedEdits.push(processed);
      });

      // Final Approval Gate
      // If we have an escalation, it blocks.
      let gatePassed = editSummary.escalated_count === 0;
      let blockingReasons = [];
      if (!gatePassed) {
        blockingReasons.push(`${editSummary.escalated_count} fields awaiting supplier contact.`);
      }

      resolve({
        pipeline_id: dashboardPayload.pipeline_id || "pl_UNKNOWN",
        review_session_id: "rev_" + Math.random().toString(36).substr(2, 9),
        review_timestamp: new Date().toISOString(),
        reviewer_id: "human_reviewer_01",
        edit_summary: editSummary,
        processed_edits: processedEdits,
        regeneration_required: regenRequired,
        final_approval_gate: {
          gate_passed: gatePassed,
          blocking_reasons: blockingReasons,
          approved_for_export: gatePassed,
          approval_timestamp: gatePassed ? new Date().toISOString() : null
        },
        model_learning_log: learningLog
      });

    }, 1500);
  });
}

module.exports = {
  processReview
};
