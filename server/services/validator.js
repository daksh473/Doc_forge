const mockProducts = require('../data/mockProducts');

/**
 * Validation Service
 * Runs comprehensive sanity checks against real normalized attributes and taxonomy.
 */
function validateData(normalizationResult, taxonomyResult) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attributes = (normalizationResult && Array.isArray(normalizationResult.attributes))
        ? normalizationResult.attributes
        : ((normalizationResult && normalizationResult.extraction && Array.isArray(normalizationResult.extraction.attributes))
          ? normalizationResult.extraction.attributes
          : []);

      const categoryName = taxonomyResult?.taxonomy?.category_name || taxonomyResult?.category_name || "Industrial Product";
      const categoryPath = taxonomyResult?.taxonomy?.category_path || taxonomyResult?.category_path || ["Industrial", categoryName];

      const mandatoryExpected = ["Product Name", "Model Number", "Manufacturer", "Body Material", "Pressure Rating", "Size / DN"];
      const mandatoryPresent = [];
      const mandatoryMissing = [];

      const validationResults = [];
      let criticalCount = 0;
      let warningCount = 0;
      let infoCount = 0;
      let passCount = 0;

      mandatoryExpected.forEach(fieldName => {
        const found = attributes.find(a => 
          a.attribute_name && a.attribute_name.toLowerCase().includes(fieldName.toLowerCase())
        );
        if (found && (found.standardized_value || found.raw_value) && !found.data_missing) {
          mandatoryPresent.push(fieldName);
          passCount++;
        } else {
          mandatoryMissing.push(fieldName);
          warningCount++;
          validationResults.push({
            rule_id: `MISSING_${fieldName.replace(/[^A-Z0-9]/gi, '_').toUpperCase()}`,
            rule_description: `Mandatory field check: ${fieldName}`,
            severity: "WARNING",
            affected_attributes: [fieldName],
            detected_issue: `Expected mandatory field '${fieldName}' was not extracted from document text.`,
            expected_range_or_value: "Non-empty string",
            actual_value: null,
            remediation_suggestion: `Verify document source for explicit ${fieldName}.`
          });
        }
      });

      // Check per-attribute anomaly conditions (conflicts, missing values, low confidence)
      const inferredReview = [];
      attributes.forEach(attr => {
        if (attr.conflict_detected) {
          warningCount++;
          validationResults.push({
            rule_id: `CONFLICT_${(attr.attribute_name || 'ATTR').replace(/[^A-Z0-9]/gi, '_').toUpperCase()}`,
            rule_description: `Conflicting values for ${attr.attribute_name}`,
            severity: "WARNING",
            affected_attributes: [attr.attribute_name],
            detected_issue: `Conflicting values detected for ${attr.attribute_name} across document sections.`,
            expected_range_or_value: "Single consistent value",
            actual_value: attr.raw_value || attr.standardized_value,
            remediation_suggestion: "Human review required to confirm correct attribute value."
          });
        }

        if (attr.inferred) {
          infoCount++;
          inferredReview.push({
            attribute_name: attr.attribute_name,
            inferred_value: attr.standardized_value || attr.raw_value,
            consistency_with_extracted: attr.confidence_score >= 80 ? "consistent" : "needs_review",
            review_priority: attr.confidence_score >= 80 ? "low" : "medium"
          });
        }

        if (!attr.conflict_detected && !attr.inferred && attr.confidence_score >= 70) {
          passCount++;
        }
      });

      const totalChecks = validationResults.length + passCount;
      const completenessScore = mandatoryExpected.length > 0 
        ? Math.round((mandatoryPresent.length / mandatoryExpected.length) * 100)
        : 100;

      const overallStatus = criticalCount > 0 ? "FAILED" : (warningCount > 0 ? "WARNING" : "PASS");
      const publishRec = criticalCount > 0 ? "REJECT" : (warningCount > 0 ? "review_required" : "READY_FOR_CATALOG");

      resolve({
        pipeline_id: normalizationResult?.pipeline_id || 'pl_' + Date.now(),
        validation_timestamp: new Date().toISOString(),
        product_type_detected: categoryName,
        category_path: categoryPath,
        overall_validation_status: overallStatus,
        publish_recommendation: publishRec,
        validation_results: validationResults,
        completeness_report: {
          mandatory_fields_present: mandatoryPresent,
          mandatory_fields_missing: mandatoryMissing,
          completeness_score: completenessScore,
          completeness_label: completenessScore >= 90 ? "complete" : (completenessScore >= 70 ? "mostly_complete" : "incomplete")
        },
        inferred_attributes_review: inferredReview,
        validation_summary: {
          total_checks_run: totalChecks,
          critical_count: criticalCount,
          warning_count: warningCount,
          info_count: infoCount,
          pass_count: passCount,
          blocking_issues: validationResults.filter(r => r.severity === "CRITICAL").map(r => r.detected_issue)
        }
      });
    }, 300);
  });
}

module.exports = {
  validateData
};
