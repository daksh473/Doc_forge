/**
 * Manufacturer and Brand Canonical Normalisation Engine
 * Maps raw, noisy, or misspelled manufacturer/brand strings to UniCat reference entries.
 */

// Known UniCat reference dictionary
const UNICAT_MFG_REFERENCE = [
  { MANUFACTURER_NAME: "Emerson Electric Co.", MANUFACTURER_CODE: "MFG_EMERSON", BRAND_NAME: "ASCO®", BRAND_CODE: "BRD_ASCO" },
  { MANUFACTURER_NAME: "Swagelok Company", MANUFACTURER_CODE: "MFG_SWAGELOK", BRAND_NAME: "SWAGELOK®", BRAND_CODE: "BRD_SWAGELOK" },
  { MANUFACTURER_NAME: "Parker-Hannifin Corporation", MANUFACTURER_CODE: "MFG_PARKER", BRAND_NAME: "PARKER™", BRAND_CODE: "BRD_PARKER" },
  { MANUFACTURER_NAME: "3M Company", MANUFACTURER_CODE: "MFG_3M", BRAND_NAME: "3M™", BRAND_CODE: "BRD_3M" },
  { MANUFACTURER_NAME: "General Electric Company", MANUFACTURER_CODE: "MFG_GE", BRAND_NAME: "GE Appliances®", BRAND_CODE: "BRD_GE" },
  { MANUFACTURER_NAME: "Electrolux Home Products, Inc.", MANUFACTURER_CODE: "MFG_ELECTROLUX", BRAND_NAME: "FRIGIDAIRE®", BRAND_CODE: "BRD_FRIGIDAIRE" },
  { MANUFACTURER_NAME: "Whirlpool Corporation", MANUFACTURER_CODE: "MFG_WHIRLPOOL", BRAND_NAME: "WHIRLPOOL®", BRAND_CODE: "BRD_WHIRLPOOL" },
  { MANUFACTURER_NAME: "Schneider Electric SE", MANUFACTURER_CODE: "MFG_SCHNEIDER", BRAND_NAME: "Square D®", BRAND_CODE: "BRD_SQUARED" },
  { MANUFACTURER_NAME: "NIBCO Inc.", MANUFACTURER_CODE: "MFG_NIBCO", BRAND_NAME: "NIBCO®", BRAND_CODE: "BRD_NIBCO" }
];

// Abbreviation dictionary
const MFG_ABBREVIATIONS = {
  "3M": "3M Company",
  "GE": "General Electric Company",
  "P&G": "Procter & Gamble",
  "J&J": "Johnson & Johnson",
  "PARKER": "Parker-Hannifin Corporation",
  "EMERSON": "Emerson Electric Co."
};

// MPN prefixes
const MPN_PREFIXES = [
  { prefix: "PDSH", mfg: "Electrolux Home Products, Inc.", brand: "FRIGIDAIRE®" },
  { prefix: "FFID", mfg: "Electrolux Home Products, Inc.", brand: "FRIGIDAIRE®" },
  { prefix: "WDT", mfg: "Whirlpool Corporation", brand: "WHIRLPOOL®" },
  { prefix: "WDF", mfg: "Whirlpool Corporation", brand: "WHIRLPOOL®" },
  { prefix: "LDF", mfg: "LG Electronics", brand: "LG®" }
];

function isPlaceholder(val) {
  if (!val) return true;
  const str = val.toString().trim();
  if (str === "") return true;
  const lower = str.toLowerCase();
  if (["n/a", "na", "n.a.", "tbd", "unknown", "none"].includes(lower)) return true;
  if (str.startsWith("--") && str.endsWith("--")) return true;
  return false;
}

function stripLegalSuffix(str) {
  return str.replace(/\b(Inc\.?|Incorporated|LLC|L\.L\.C\.|Ltd\.?|Limited|Corp\.?|Corporation|Co\.?|Company)\b/gi, '').trim();
}

function normalizeMfgBrand(inputSignals = {}, candidates = UNICAT_MFG_REFERENCE) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pipelineId = inputSignals.pipeline_id || "PL_" + Date.now();
      const mpn = inputSignals.Mfg_Part_Num || null;
      const e1Brand = inputSignals.E1_Brand || null;
      const unilogBrand = inputSignals.Unilog_Brand || null;
      const dibBrand = inputSignals.DIB_Brand || null;
      const partManuf = inputSignals.Part_Manuf || null;

      // Step 1: Placeholder Detection
      const e1IsPH = isPlaceholder(e1Brand);
      const unilogIsPH = isPlaceholder(unilogBrand);
      const dibIsPH = isPlaceholder(dibBrand);
      const allBrandsPH = e1IsPH && unilogIsPH && dibIsPH;

      const rawInputSignals = {
        Mfg_Part_Num: mpn,
        E1_Brand: e1IsPH ? null : e1Brand,
        Unilog_Brand: unilogIsPH ? null : unilogBrand,
        DIB_Brand: dibIsPH ? null : dibBrand,
        Part_Manuf: isPlaceholder(partManuf) ? null : partManuf
      };

      const placeholderDetected = {
        E1_Brand: e1IsPH,
        Unilog_Brand: unilogIsPH,
        DIB_Brand: dibIsPH,
        all_brands_placeholder: allBrandsPH
      };

      // Step 2: Signal Aggregation
      const signals = [];
      if (rawInputSignals.Part_Manuf) signals.push({ field: "Part_Manuf", val: rawInputSignals.Part_Manuf, priority: 1 });
      if (rawInputSignals.Unilog_Brand) signals.push({ field: "Unilog_Brand", val: rawInputSignals.Unilog_Brand, priority: 2 });
      if (rawInputSignals.E1_Brand) signals.push({ field: "E1_Brand", val: rawInputSignals.E1_Brand, priority: 3 });
      if (rawInputSignals.DIB_Brand) signals.push({ field: "DIB_Brand", val: rawInputSignals.DIB_Brand, priority: 4 });

      let primarySignal = signals[0] || null;
      let mfgConflict = false;
      const conflictSignals = [];

      // Step 3 & 4: Manufacturer & Brand Matching
      let resolvedMfg = null;
      let matchStrategy = "no_match";
      let matchConfidence = 0;
      let inferredFromMpn = false;
      let matchedField = primarySignal ? primarySignal.field : null;

      if (primarySignal) {
        const inputVal = primarySignal.val.trim();
        const inputUpper = inputVal.toUpperCase();

        // Strategy 1: Exact Match
        let exactMatch = candidates.find(c => c.MANUFACTURER_NAME === inputVal || c.BRAND_NAME === inputVal);
        if (exactMatch) {
          resolvedMfg = exactMatch;
          matchStrategy = "exact";
          matchConfidence = 100;
        }

        // Strategy 2: Case-insensitive Match
        if (!resolvedMfg) {
          let ciMatch = candidates.find(c => c.MANUFACTURER_NAME.toUpperCase() === inputUpper || c.BRAND_NAME.toUpperCase() === inputUpper);
          if (ciMatch) {
            resolvedMfg = ciMatch;
            matchStrategy = "case_insensitive";
            matchConfidence = 95;
          }
        }

        // Strategy 3: Legal Suffix Normalised
        if (!resolvedMfg) {
          const strippedInput = stripLegalSuffix(inputVal).toUpperCase();
          let suffixMatch = candidates.find(c => stripLegalSuffix(c.MANUFACTURER_NAME).toUpperCase() === strippedInput);
          if (suffixMatch) {
            resolvedMfg = suffixMatch;
            matchStrategy = "suffix_normalised";
            matchConfidence = 90;
          }
        }

        // Strategy 4: Abbreviation Expansion
        if (!resolvedMfg) {
          const expanded = MFG_ABBREVIATIONS[inputUpper];
          if (expanded) {
            let abbrevMatch = candidates.find(c => c.MANUFACTURER_NAME.toUpperCase() === expanded.toUpperCase());
            if (abbrevMatch) {
              resolvedMfg = abbrevMatch;
              matchStrategy = "abbreviation";
              matchConfidence = 80;
            }
          }
        }

        // Strategy 5: Fuzzy Match
        if (!resolvedMfg) {
          let fuzzyMatch = candidates.find(c => c.MANUFACTURER_NAME.toLowerCase().includes(inputVal.toLowerCase()) || inputVal.toLowerCase().includes(c.MANUFACTURER_NAME.toLowerCase().split(' ')[0]));
          if (fuzzyMatch) {
            resolvedMfg = fuzzyMatch;
            matchStrategy = "fuzzy";
            matchConfidence = 75;
          }
        }
      }

      // Strategy 6: MPN Prefix Decode if no match yet
      if (!resolvedMfg && mpn) {
        const mpnUpper = mpn.toUpperCase();
        const prefixObj = MPN_PREFIXES.find(p => mpnUpper.startsWith(p.prefix));
        if (prefixObj) {
          resolvedMfg = {
            MANUFACTURER_NAME: prefixObj.mfg,
            MANUFACTURER_CODE: "MFG_INFERRED_" + prefixObj.prefix,
            BRAND_NAME: prefixObj.brand,
            BRAND_CODE: "BRD_INFERRED_" + prefixObj.prefix
          };
          matchStrategy = "mpn_prefix";
          matchConfidence = 50;
          inferredFromMpn = true;
          matchedField = "Mfg_Part_Num";
        }
      }

      // Step 4: Brand Resolution
      let resolvedBrand = null;
      let brandSource = "reference_matched";

      if (resolvedMfg) {
        resolvedBrand = {
          resolved: true,
          BRAND_NAME: resolvedMfg.BRAND_NAME || resolvedMfg.MANUFACTURER_NAME,
          BRAND_CODE: resolvedMfg.BRAND_CODE || resolvedMfg.MANUFACTURER_CODE,
          brand_source: resolvedMfg.BRAND_NAME ? "reference_matched" : "manufacturer_as_brand",
          brand_ambiguous: false,
          brand_candidates: [],
          casing_verified: true
        };
      } else if (allBrandsPH && rawInputSignals.Part_Manuf) {
        resolvedBrand = {
          resolved: true,
          BRAND_NAME: rawInputSignals.Part_Manuf,
          BRAND_CODE: "BRD_FALLBACK",
          brand_source: "manufacturer_fallback",
          brand_ambiguous: false,
          brand_candidates: [],
          casing_verified: false
        };
      } else {
        resolvedBrand = {
          resolved: false,
          BRAND_NAME: null,
          BRAND_CODE: null,
          brand_source: "unresolved",
          brand_ambiguous: false,
          brand_candidates: [],
          casing_verified: false
        };
      }

      // Step 5: Summary & Assessment
      const isResolved = !!resolvedMfg;
      let reviewFlag = null;
      let reviewPriority = "none";
      let reviewerAction = null;
      let needsSupplierContact = false;

      if (!isResolved) {
        reviewFlag = "MFG_UNRESOLVED";
        reviewPriority = "critical";
        reviewerAction = "CONTACT_SUPPLIER";
        needsSupplierContact = true;
      } else if (matchConfidence < 70 || inferredFromMpn) {
        reviewFlag = "LOW_CONFIDENCE";
        reviewPriority = "medium";
        reviewerAction = "CHECK_REFERENCE";
      } else {
        reviewerAction = "APPROVE_IF_CORRECT";
      }

      let confLabel = "unresolved";
      if (matchConfidence >= 90) confLabel = "verified";
      else if (matchConfidence >= 75) confLabel = "high";
      else if (matchConfidence >= 50) confLabel = "medium";

      resolve({
        pipeline_id: pipelineId,
        normalisation_timestamp: new Date().toISOString(),
        raw_input_signals: rawInputSignals,
        placeholder_detected: placeholderDetected,
        canonical_manufacturer: {
          resolved: isResolved,
          MANUFACTURER_NAME: resolvedMfg ? resolvedMfg.MANUFACTURER_NAME : null,
          MANUFACTURER_CODE: resolvedMfg ? resolvedMfg.MANUFACTURER_CODE : null,
          match_strategy: matchStrategy,
          match_confidence: matchConfidence,
          inferred_from_mpn: inferredFromMpn,
          matched_input_signal: matchedField,
          manufacturer_conflict: mfgConflict,
          conflict_signals: conflictSignals
        },
        canonical_brand: resolvedBrand,
        normalisation_summary: {
          overall_confidence: matchConfidence,
          confidence_label: confLabel,
          review_flag: reviewFlag,
          review_priority: reviewPriority,
          reviewer_action: reviewerAction,
          needs_supplier_contact: needsSupplierContact,
          ready_for_pipeline: isResolved
        }
      });

    }, 1200);
  });
}

module.exports = {
  normalizeMfgBrand
};
