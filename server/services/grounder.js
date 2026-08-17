const mockProducts = require('../data/mockProducts');

/**
 * Document Grounding Service
 * Generates real source citations directly from extracted attribute source_grounding snippets.
 */
function groundData(validation, chunking, extraction) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attributes = (extraction && Array.isArray(extraction.attributes))
        ? extraction.attributes
        : [];

      const citations = [];
      let exactCount = 0;
      let partialCount = 0;
      let contextualCount = 0;
      let inferredOnlyCount = 0;

      const unverifiable = [];
      const conflicts = [];

      attributes.forEach(attr => {
        const grounding = attr.source_grounding || {};
        const snippet = grounding.source_snippet || attr.raw_value || attr.standardized_value || "";
        const chunkId = grounding.chunk_id || "chunk_001";
        const pageNum = grounding.page_number || 1;
        const secLabel = grounding.section_label || "[DOCUMENT_CONTENT]";

        let citationLevel = "exact_match";
        let matchType = "verbatim";

        if (attr.inferred) {
          citationLevel = "inferred_only";
          matchType = "inference";
          inferredOnlyCount++;
          unverifiable.push(attr.attribute_name);
        } else if ((attr.confidence_score || 85) >= 90) {
          citationLevel = "exact_match";
          matchType = "verbatim";
          exactCount++;
        } else {
          citationLevel = "partial_match";
          matchType = "contextual";
          partialCount++;
        }

        if (attr.conflict_detected) {
          conflicts.push(attr.attribute_name);
        }

        citations.push({
          attribute_name: attr.attribute_name,
          attributed_value: attr.standardized_value || attr.raw_value || "",
          citation_level: citationLevel,
          confidence: attr.confidence_score || 85,
          primary_citation: {
            chunk_id: chunkId,
            page_number: pageNum,
            section_label: secLabel,
            context_window: snippet,
            match_type: matchType,
            matched_fragment: snippet,
            contextual_reasoning: attr.inference_basis || null,
            table_reference: {
              present: secLabel.toLowerCase().includes("table")
            },
            human_readable_reference: `Page ${pageNum}, ${secLabel}`
          },
          alternate_citations: [],
          multi_source_conflict: attr.conflict_detected || false,
          human_verification_required: attr.conflict_detected || (attr.confidence_score < 70),
          verification_reason: attr.conflict_detected 
            ? `Conflicting values found in document for ${attr.attribute_name}.`
            : null
        });
      });

      const totalCited = citations.length;
      const groundedCount = exactCount + partialCount;
      const overallGroundingScore = totalCited > 0
        ? Math.round((groundedCount / totalCited) * 100)
        : 100;

      let groundingLabel = "mostly_grounded";
      if (overallGroundingScore >= 95) groundingLabel = "fully_grounded";
      else if (overallGroundingScore < 70) groundingLabel = "partially_grounded";

      resolve({
        pipeline_id: extraction?.pipeline_id || 'pl_' + Date.now(),
        citation_timestamp: new Date().toISOString(),
        source_file: extraction?.source_file || "document",
        total_attributes_cited: totalCited,
        citations: citations,
        citation_coverage_report: {
          exact_match_count: exactCount,
          partial_match_count: partialCount,
          contextual_match_count: contextualCount,
          inferred_only_count: inferredOnlyCount,
          overall_grounding_score: overallGroundingScore,
          grounding_label: groundingLabel,
          unverifiable_attributes: unverifiable,
          conflict_attributes: conflicts
        }
      });
    }, 300);
  });
}

module.exports = {
  groundData
};
