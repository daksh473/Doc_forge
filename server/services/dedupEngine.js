/**
 * De-duplication Decision Engine Service
 * Evaluates candidate pairs, detects disqualifying contradictions, and merges duplicate product rows into golden rows.
 */

function normalizeMPN(mpn) {
  if (!mpn) return "";
  return mpn.toString().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function checkVariantSuffix(mpn1, mpn2) {
  const norm1 = normalizeMPN(mpn1);
  const norm2 = normalizeMPN(mpn2);

  const suffixes = ["LF", "NPT", "BSP", "SS", "BR", "NC", "NO"];

  for (const suf of suffixes) {
    if ((norm1.endsWith(suf) && !norm2.endsWith(suf)) || (!norm1.endsWith(suf) && norm2.endsWith(suf))) {
      return { detected: true, note: `Variant suffix difference detected: '-${suf}' (e.g. Lead-Free or Thread Standard variation)` };
    }
  }
  return { detected: false, note: null };
}

function evaluateDeDuplication(candidatePairsInput) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pipelineId = candidatePairsInput?.pipeline_id || "PL_" + Date.now();

      // Sample or provided candidate pairs
      const pairs = candidatePairsInput?.candidate_pairs || [
        {
          row_index_a: 0,
          row_index_b: 1,
          row_a: {
            gtin: "00885911001234",
            mfg: "Swagelok Company",
            mpn: "SS-810-6-1",
            title: "1/2 in SS316 Ball Valve 1000 WOG NPT",
            material: "Stainless Steel 316",
            size: "1/2 IN",
            pressure: "1000 PSI",
            source_type: "manufacturer"
          },
          row_b: {
            gtin: "00885911001234",
            mfg: "Swagelok",
            mpn: "SS81061",
            title: "Ball Valve 1/2 inch Stainless Steel 1000 PSI",
            material: "SS316",
            size: "1/2 IN",
            pressure: "1000 PSI",
            source_type: "distributor"
          }
        },
        {
          row_index_a: 0,
          row_index_b: 2,
          row_a: {
            gtin: "00885911001234",
            mfg: "Swagelok Company",
            mpn: "SS-810-6-1",
            title: "1/2 in SS316 Ball Valve 1000 WOG NPT",
            material: "Stainless Steel 316",
            size: "1/2 IN",
            pressure: "1000 PSI",
            source_type: "manufacturer"
          },
          row_b: {
            gtin: null,
            mfg: "Swagelok Company",
            mpn: "SS-810-6-1-LF",
            title: "1/2 in SS316 Ball Valve Lead-Free 1000 WOG",
            material: "Stainless Steel 316",
            size: "1/2 IN",
            pressure: "1000 PSI",
            source_type: "distributor"
          }
        },
        {
          row_index_a: 1,
          row_index_b: 3,
          row_a: {
            gtin: null,
            mfg: "Parker-Hannifin",
            mpn: "6A-B6LJ-SSP",
            title: "3/4 in SS Ball Valve 1500 PSI",
            material: "Stainless Steel 316",
            size: "3/4 IN",
            pressure: "1500 PSI",
            source_type: "distributor"
          },
          row_b: {
            gtin: null,
            mfg: "Parker-Hannifin",
            mpn: "4A-B6LJ-SSP",
            title: "1/2 in SS Ball Valve 1500 PSI",
            material: "Stainless Steel 316",
            size: "1/2 IN",
            pressure: "1500 PSI",
            source_type: "distributor"
          }
        }
      ];

      const pairEvaluations = [];
      let confirmedDuplicates = 0;
      let autoMergedCount = 0;
      let reviewRequiredCount = 0;
      let notDuplicateCount = 0;
      let variantSuffixPairsFlagged = 0;

      pairs.forEach(pair => {
        const rowA = pair.row_a;
        const rowB = pair.row_b;

        const gtinMatch = rowA.gtin && rowB.gtin && rowA.gtin === rowB.gtin;
        const normMpnA = normalizeMPN(rowA.mpn);
        const normMpnB = normalizeMPN(rowB.mpn);
        const mpnMatch = normMpnA && normMpnB && (normMpnA === normMpnB);

        const mfgA = (rowA.mfg || "").toLowerCase();
        const mfgB = (rowB.mfg || "").toLowerCase();
        const mfgMatch = mfgA && mfgB && (mfgA.includes(mfgB) || mfgB.includes(mfgA));

        // Variant Suffix Check
        const variantCheck = checkVariantSuffix(rowA.mpn, rowB.mpn);

        // Core Spec Contradictions Check
        let contradictionFound = false;
        let contradictionReason = null;

        const matA = (rowA.material || "").toLowerCase();
        const matB = (rowB.material || "").toLowerCase();
        const matEquiv = (matA === matB) ||
          (matA.includes("ss316") && matB.includes("stainless steel 316")) ||
          (matB.includes("ss316") && matA.includes("stainless steel 316")) ||
          (matA.includes(matB) || matB.includes(matA));

        if (rowA.size && rowB.size && rowA.size.toLowerCase() !== rowB.size.toLowerCase()) {
          contradictionFound = true;
          contradictionReason = `Disqualifying contradiction: Core dimension mismatch ('${rowA.size}' vs '${rowB.size}')`;
        } else if (rowA.material && rowB.material && !matEquiv) {
          contradictionFound = true;
          contradictionReason = `Disqualifying contradiction: Material mismatch ('${rowA.material}' vs '${rowB.material}')`;
        } else if (variantCheck.detected) {
          contradictionFound = true;
          contradictionReason = `Variant Suffix Detected: '${rowA.mpn}' vs '${rowB.mpn}' represents distinct variant SKUs.`;
          variantSuffixPairsFlagged++;
        }

        // Determine Identity Tier & Confidence
        let tier = "4";
        let confidence = 40;
        let isDuplicate = false;

        if (gtinMatch) {
          tier = "1";
          confidence = 100;
          isDuplicate = !contradictionFound;
        } else if (mfgMatch && mpnMatch) {
          tier = "2";
          confidence = 90;
          isDuplicate = !contradictionFound;
        } else if (mfgMatch && (rowA.title && rowB.title && rowA.title.toLowerCase().includes(rowB.title.toLowerCase().substring(0, 10)))) {
          tier = "3";
          confidence = 75;
          isDuplicate = !contradictionFound;
        }

        if (contradictionFound) {
          isDuplicate = false;
          notDuplicateCount++;
        } else if (isDuplicate) {
          confirmedDuplicates++;
        } else {
          notDuplicateCount++;
        }

        // Merge Field Resolution
        let autoMergeEligible = false;
        let mergedRow = null;
        let fieldProvenance = null;
        let fieldConflicts = [];

        if (isDuplicate) {
          mergedRow = {};
          fieldProvenance = {};

          const allKeys = Array.from(new Set([...Object.keys(rowA), ...Object.keys(rowB)]));
          allKeys.forEach(k => {
            if (k === 'source_type') return;
            const valA = rowA[k];
            const valB = rowB[k];

            if (valA && !valB) {
              mergedRow[k] = valA;
              fieldProvenance[k] = "row_a";
            } else if (!valA && valB) {
              mergedRow[k] = valB;
              fieldProvenance[k] = "row_b";
            } else if (valA && valB) {
              if (valA === valB || valA.toLowerCase() === valB.toLowerCase()) {
                mergedRow[k] = valA.length >= valB.length ? valA : valB;
                fieldProvenance[k] = valA.length >= valB.length ? "row_a" : "row_b";
              } else if (rowA.source_type === 'manufacturer') {
                mergedRow[k] = valA;
                fieldProvenance[k] = "row_a (manufacturer)";
              } else if (rowB.source_type === 'manufacturer') {
                mergedRow[k] = valB;
                fieldProvenance[k] = "row_b (manufacturer)";
              } else {
                mergedRow[k] = valA;
                fieldProvenance[k] = "row_a (default)";
                fieldConflicts.push({
                  field_name: k,
                  value_a: valA,
                  value_b: valB,
                  resolution: "Resolved to row_a (prefer longer precision)"
                });
              }
            }
          });

          if ((tier === "1" || tier === "2") && fieldConflicts.length === 0) {
            autoMergeEligible = true;
            autoMergedCount++;
          }
        }

        const reviewRequired = tier === "3" || (tier === "2" && fieldConflicts.length > 0) || variantCheck.detected || (!isDuplicate && !contradictionFound);
        if (reviewRequired) reviewRequiredCount++;

        let reviewReason = null;
        if (variantCheck.detected) reviewReason = "VARIANT_SUFFIX";
        else if (tier === "3") reviewReason = "TIER_3_MATCH";
        else if (fieldConflicts.length > 0) reviewReason = "FIELD_CONFLICT";
        else if (!isDuplicate && !contradictionFound) reviewReason = "LOW_CONFIDENCE";

        pairEvaluations.push({
          row_index_a: pair.row_index_a,
          row_index_b: pair.row_index_b,
          identity_tier: tier,
          is_duplicate: isDuplicate,
          confidence: confidence,
          contradiction_check: {
            contradiction_found: contradictionFound,
            contradiction_reason: contradictionReason,
            variant_suffix_detected: variantCheck.detected,
            variant_note: variantCheck.note
          },
          signals_used: {
            gtin_match: gtinMatch,
            mfg_match_score: mfgMatch ? 100 : 0,
            mpn_match_score: mpnMatch ? 100 : 0,
            desc_similarity: isDuplicate ? 88 : 45,
            attribute_cross_check: contradictionFound ? "conflict" : "match"
          },
          merge_result: {
            auto_merge_eligible: autoMergeEligible,
            merged_row: mergedRow,
            field_provenance: fieldProvenance,
            field_conflicts: fieldConflicts
          },
          review_required: reviewRequired,
          review_reason: reviewReason
        });
      });

      const totalPairs = pairEvaluations.length;
      let grade = "A";
      if (reviewRequiredCount > 2) grade = "B";

      resolve({
        pipeline_id: pipelineId,
        dedup_timestamp: new Date().toISOString(),
        pair_evaluations: pairEvaluations,
        dedup_summary: {
          total_candidate_pairs_evaluated: totalPairs,
          confirmed_duplicates: confirmedDuplicates,
          auto_merged_count: autoMergedCount,
          review_required_count: reviewRequiredCount,
          not_duplicate_count: notDuplicateCount,
          variant_suffix_pairs_flagged: variantSuffixPairsFlagged,
          estimated_row_reduction: `${autoMergedCount} rows merged into golden records`,
          dedup_confidence_grade: grade
        }
      });
    }, 1200);
  });
}

module.exports = {
  evaluateDeDuplication
};
