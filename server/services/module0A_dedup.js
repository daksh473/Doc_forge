/**
 * Module 0A — Pre-Pipeline Batch De-duplication & Merge Engine
 * Runs BEFORE Module 1A (Extraction) on the full raw batch of product rows.
 * 3-Stage Chain:
 * - Stage 1: Candidate Pre-Filtering (Code Engine: Blocking Keys & Fuzzy Pre-Score >= 55)
 * - Stage 2: Duplicate Decision Engine (Decision Logic: Tiers, Contradictions, Merge Field Resolution)
 * - Stage 3: Merge Execution & Transitive Union-Find (Code Engine: DSU Merging & Review Queue Routing)
 */

function normalizeString(str) {
  if (!str) return "";
  return str.toString().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function stringSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const n1 = normalizeString(s1);
  const n2 = normalizeString(s2);
  if (n1 === n2) return 100;
  if (n1.includes(n2) || n2.includes(n1)) return 85;
  return 40;
}

// Disjoint Set Union (DSU / Union-Find) for Transitive Merging
class DisjointSet {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
  }

  find(i) {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
    }
  }
}

// ── STAGE 1: Candidate Pre-Filtering ──
function stage1PreFilter(rawRows) {
  const blocks = {};

  rawRows.forEach((row, idx) => {
    const keys = [];
    if (row.gtin) keys.push("GTIN_" + normalizeString(row.gtin));
    if (row.mpn) keys.push("MPN_" + normalizeString(row.mpn));
    if (row.mfg && row.mpn) keys.push("MFGMPN_" + normalizeString(row.mfg + "_" + row.mpn));

    // Fingerprint key
    if (row.mfg) {
      const fp = [row.mfg, row.size, row.material, row.type].filter(Boolean).sort().join("_");
      keys.push("FP_" + normalizeString(fp));
    }

    keys.forEach(k => {
      if (!blocks[k]) blocks[k] = [];
      if (!blocks[k].includes(idx)) blocks[k].push(idx);
    });
  });

  const pairsSet = new Set();
  const candidatePairs = [];

  for (const [key, indices] of Object.entries(blocks)) {
    // Discard any block with >50 rows (key is too generic)
    if (indices.length > 50) continue;

    for (let i = 0; i < indices.length; i++) {
      for (let j = i + 1; j < indices.length; j++) {
        const idxA = Math.min(indices[i], indices[j]);
        const idxB = Math.max(indices[i], indices[j]);
        const pairKey = `${idxA}_${idxB}`;

        if (!pairsSet.has(pairKey)) {
          pairsSet.add(pairKey);
          const rowA = rawRows[idxA];
          const rowB = rawRows[idxB];

          let score = 0;
          if (rowA.gtin && rowB.gtin && normalizeString(rowA.gtin) === normalizeString(rowB.gtin)) {
            score = 100;
          } else {
            const mfgSim = stringSimilarity(rowA.mfg, rowB.mfg);
            const mpnSim = stringSimilarity(rowA.mpn, rowB.mpn);
            const descSim = stringSimilarity(rowA.title || rowA.desc, rowB.title || rowB.desc);
            score = Math.round((mfgSim * 0.3) + (mpnSim * 0.4) + (descSim * 0.3));
          }

          // Filter score >= 55
          if (score >= 55) {
            candidatePairs.push({
              row_index_a: idxA,
              row_index_b: idxB,
              row_a: rowA,
              row_b: rowB,
              pre_score: score
            });
          }
        }
      }
    }
  }

  return candidatePairs;
}

// ── STAGE 2: Duplicate Decision Engine ──
function stage2Decision(candidatePairs) {
  const pairEvaluations = [];

  candidatePairs.forEach(pair => {
    const rowA = pair.row_a;
    const rowB = pair.row_b;

    const gtinMatch = rowA.gtin && rowB.gtin && normalizeString(rowA.gtin) === normalizeString(rowB.gtin);
    const mpnMatch = rowA.mpn && rowB.mpn && normalizeString(rowA.mpn) === normalizeString(rowB.mpn);
    const mfgMatch = rowA.mfg && rowB.mfg && stringSimilarity(rowA.mfg, rowB.mfg) >= 80;
    const descSim = stringSimilarity(rowA.title || rowA.desc, rowB.title || rowB.desc);

    // Contradiction Checks
    let contradictionFound = false;
    let contradictionReason = null;
    let variantSuffixDetected = false;

    if (rowA.mpn && rowB.mpn) {
      const normA = normalizeString(rowA.mpn);
      const normB = normalizeString(rowB.mpn);
      if (normA !== normB && (normA.endsWith("LF") || normB.endsWith("LF") || normA.endsWith("NPT") || normB.endsWith("BSP"))) {
        variantSuffixDetected = true;
        contradictionFound = true;
        contradictionReason = `Variant Suffix Detected: '${rowA.mpn}' vs '${rowB.mpn}' represents distinct SKUs.`;
      }
    }

    if (!contradictionFound && rowA.size && rowB.size && normalizeString(rowA.size) !== normalizeString(rowB.size)) {
      contradictionFound = true;
      contradictionReason = `Disqualifying contradiction: Core dimension mismatch ('${rowA.size}' vs '${rowB.size}')`;
    }

    // Identity Tier
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
    } else if (mfgMatch && descSim >= 80) {
      tier = "3";
      confidence = 75;
      isDuplicate = !contradictionFound;
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
        const valA = rowA[k];
        const valB = rowB[k];

        if (valA && !valB) {
          mergedRow[k] = valA;
          fieldProvenance[k] = "row_a";
        } else if (!valA && valB) {
          mergedRow[k] = valB;
          fieldProvenance[k] = "row_b";
        } else if (valA && valB) {
          if (valA === valB || normalizeString(valA) === normalizeString(valB)) {
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
            fieldProvenance[k] = "row_a";
            fieldConflicts.push({ field_name: k, value_a: valA, value_b: valB, resolution: "Resolved to row_a" });
          }
        }
      });

      if ((tier === "1" || tier === "2") && fieldConflicts.length === 0) {
        autoMergeEligible = true;
      }
    }

    const reviewRequired = tier === "3" || (tier === "2" && fieldConflicts.length > 0) || variantSuffixDetected;
    let reviewReason = null;
    if (variantSuffixDetected) reviewReason = "VARIANT_SUFFIX";
    else if (tier === "3") reviewReason = "TIER_3_MATCH";
    else if (fieldConflicts.length > 0) reviewReason = "FIELD_CONFLICT";

    pairEvaluations.push({
      row_index_a: pair.row_index_a,
      row_index_b: pair.row_index_b,
      identity_tier: tier,
      is_duplicate: isDuplicate,
      confidence: confidence,
      contradiction_check: {
        contradiction_found: contradictionFound,
        contradiction_reason: contradictionReason,
        variant_suffix_detected: variantSuffixDetected,
        variant_note: variantSuffixDetected ? "Variant suffix mismatch" : null
      },
      signals_used: {
        gtin_match: gtinMatch,
        mfg_match_score: mfgMatch ? 100 : 0,
        mpn_match_score: mpnMatch ? 100 : 0,
        desc_similarity: descSim,
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

  return pairEvaluations;
}

// ── STAGE 3: Merge Execution (DSU Union-Find) ──
function stage3MergeExecution(rawRows, pairEvaluations) {
  const dsu = new DisjointSet(rawRows.length);
  const reviewQueue = [];

  pairEvaluations.forEach(evalResult => {
    if (evalResult.is_duplicate && evalResult.merge_result.auto_merge_eligible) {
      dsu.union(evalResult.row_index_a, evalResult.row_index_b);
    }

    if (evalResult.review_required) {
      reviewQueue.push({
        row_a: rawRows[evalResult.row_index_a],
        row_b: rawRows[evalResult.row_index_b],
        conflict_details: evalResult.merge_result.field_conflicts,
        review_reason: evalResult.review_reason
      });
    }
  });

  // Group connected rows by DSU root
  const groups = {};
  rawRows.forEach((row, idx) => {
    const root = dsu.find(idx);
    if (!groups[root]) groups[root] = [];
    groups[root].push(row);
  });

  // Build final deduplicated rows
  const deduplicatedRows = [];
  Object.values(groups).forEach(groupRows => {
    if (groupRows.length === 1) {
      deduplicatedRows.push(groupRows[0]);
    } else {
      // Merge all rows in group into single Golden Row
      let golden = { ...groupRows[0] };
      for (let i = 1; i < groupRows.length; i++) {
        const nextRow = groupRows[i];
        Object.keys(nextRow).forEach(k => {
          if (!golden[k] && nextRow[k]) golden[k] = nextRow[k];
          else if (nextRow.source_type === 'manufacturer') golden[k] = nextRow[k];
        });
      }
      golden.is_golden_row = true;
      golden.merged_from_count = groupRows.length;
      deduplicatedRows.push(golden);
    }
  });

  return { deduplicatedRows, reviewQueue };
}

function runModule0A(rawBatchRows) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const defaultRows = rawBatchRows && rawBatchRows.length > 0 ? rawBatchRows : [
        { gtin: "00885911001234", mfg: "Swagelok Company", mpn: "SS-810-6-1", title: "1/2 in SS316 Ball Valve 1000 WOG NPT", material: "Stainless Steel 316", size: "1/2 IN", source_type: "manufacturer" },
        { gtin: "00885911001234", mfg: "Swagelok", mpn: "SS81061", title: "Ball Valve 1/2 inch Stainless Steel 1000 PSI", material: "SS316", size: "1/2 IN", source_type: "distributor" },
        { gtin: null, mfg: "Swagelok Company", mpn: "SS-810-6-1-LF", title: "1/2 in SS316 Ball Valve Lead-Free 1000 WOG", material: "Stainless Steel 316", size: "1/2 IN", source_type: "distributor" },
        { gtin: null, mfg: "Parker-Hannifin", mpn: "6A-B6LJ-SSP", title: "3/4 in SS Ball Valve 1500 PSI", material: "Stainless Steel 316", size: "3/4 IN", source_type: "distributor" }
      ];

      const stage1Candidates = stage1PreFilter(defaultRows);
      const stage2Evaluations = stage2Decision(stage1Candidates);
      const { deduplicatedRows, reviewQueue } = stage3MergeExecution(defaultRows, stage2Evaluations);

      const totalOriginal = defaultRows.length;
      const totalDeduped = deduplicatedRows.length;
      const reduction = totalOriginal - totalDeduped;

      resolve({
        pipeline_id: "PL_MODULE_0A_" + Date.now(),
        execution_timestamp: new Date().toISOString(),
        stage1_candidate_pairs: stage1Candidates,
        stage2_evaluations: stage2Evaluations,
        stage3_execution: {
          deduplicated_rows: deduplicatedRows,
          review_queue: reviewQueue
        },
        module0a_summary: {
          total_batch_rows_input: totalOriginal,
          candidate_pairs_prefiltered: stage1Candidates.length,
          confirmed_duplicates: stage2Evaluations.filter(e => e.is_duplicate).length,
          auto_merged_count: stage2Evaluations.filter(e => e.merge_result.auto_merge_eligible).length,
          review_queue_count: reviewQueue.length,
          final_deduplicated_rows_count: totalDeduped,
          row_reduction_count: reduction,
          reduction_percentage: `${totalOriginal > 0 ? Math.round((reduction / totalOriginal) * 100) : 0}%`
        }
      });
    }, 1000);
  });
}

module.exports = {
  runModule0A,
  stage1PreFilter,
  stage2Decision,
  stage3MergeExecution
};
