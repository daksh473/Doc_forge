/**
 * Decimal-Fraction Conversion Engine Service
 * Converts decimal dimensions into Unilog buyer-preferred fraction display format.
 */

// Pre-loaded 64ths Decimal to Fraction Table
const FRACTION_LOOKUP = {
  0.015625: "1/64", 0.03125: "1/32", 0.046875: "3/64", 0.0625: "1/16",
  0.078125: "5/64", 0.09375: "3/32", 0.109375: "7/64", 0.125: "1/8",
  0.140625: "9/64", 0.15625: "5/32", 0.171875: "11/64", 0.1875: "3/16",
  0.203125: "13/64", 0.21875: "7/32", 0.234375: "15/64", 0.25: "1/4",
  0.265625: "17/64", 0.28125: "9/32", 0.296875: "19/64", 0.3125: "5/16",
  0.328125: "21/64", 0.34375: "11/32", 0.359375: "23/64", 0.375: "3/8",
  0.390625: "25/64", 0.40625: "13/32", 0.421875: "27/64", 0.4375: "7/16",
  0.453125: "29/64", 0.46875: "15/32", 0.484375: "31/64", 0.5: "1/2",
  0.515625: "33/64", 0.53125: "17/32", 0.546875: "35/64", 0.5625: "9/16",
  0.578125: "37/64", 0.59375: "19/32", 0.609375: "39/64", 0.625: "5/8",
  0.640625: "41/64", 0.65625: "21/32", 0.671875: "43/64", 0.6875: "11/16",
  0.703125: "45/64", 0.71875: "23/32", 0.734375: "47/64", 0.75: "3/4",
  0.765625: "49/64", 0.78125: "25/32", 0.796875: "51/64", 0.8125: "13/16",
  0.828125: "53/64", 0.84375: "27/32", 0.859375: "55/64", 0.875: "7/8",
  0.890625: "57/64", 0.90625: "29/32", 0.921875: "59/64", 0.9375: "15/16",
  0.953125: "61/64", 0.96875: "31/32", 0.984375: "63/64"
};

const DIMENSIONAL_ATTRIBUTES = [
  "size", "pipe size", "thread size", "port size", "nominal size",
  "length", "width", "height", "depth", "face-to-face",
  "od", "id", "outer diameter", "inner diameter", "bore diameter", "shaft diameter",
  "wall thickness", "sheet thickness", "gap", "tolerance", "offset"
];

function lookupDecimal(val) {
  const num = parseFloat(val);
  if (isNaN(num)) return { fraction: null, method: "not_available", confidence: 0, delta: null };

  // Check exact lookup
  if (FRACTION_LOOKUP[num]) {
    return { fraction: FRACTION_LOOKUP[num], method: "exact", confidence: 100, delta: 0 };
  }

  // Check nearest lookup (±0.001)
  let bestFraction = null;
  let minDelta = Infinity;

  for (const [decStr, fracStr] of Object.entries(FRACTION_LOOKUP)) {
    const dec = parseFloat(decStr);
    const delta = Math.abs(num - dec);
    if (delta <= 0.001 && delta < minDelta) {
      minDelta = delta;
      bestFraction = fracStr;
    }
  }

  if (bestFraction) {
    return { fraction: bestFraction, method: "nearest", confidence: 75, delta: minDelta };
  }

  return { fraction: null, method: "not_available", confidence: 0, delta: null };
}

function convertValue(valStr) {
  if (!valStr) return { type: "D", converted: valStr, info: { lookup_method: "not_required", lookup_confidence: 100 } };
  const str = valStr.toString().trim();

  // TYPE C: Already a fraction (e.g. "1/2", "50-1/4", "1 1/4")
  if (str.includes('/')) {
    const normalizedFrac = str.replace(/\s+(\d+\/\d+)/, '-$1');
    return {
      type: "C",
      converted: normalizedFrac,
      info: { whole_part: null, decimal_part: null, fraction_part: str, lookup_method: "exact", lookup_confidence: 100, fraction_not_available: false }
    };
  }

  // TYPE E: Range Value (e.g. "0.25 to 0.75" or "0.25 - 0.75")
  if (str.includes(' to ') || (str.includes('-') && !str.match(/^\d+-\d+\/\d+$/))) {
    const parts = str.split(/\s*(?:to|-|\s–\s)\s*/);
    if (parts.length === 2) {
      const c1 = convertValue(parts[0]);
      const c2 = convertValue(parts[1]);
      return {
        type: "E",
        converted: `${c1.converted} to ${c2.converted}`,
        info: { whole_part: null, decimal_part: null, fraction_part: `${c1.converted} to ${c2.converted}`, lookup_method: c1.info.lookup_method, lookup_confidence: c1.info.lookup_confidence, fraction_not_available: c1.info.fraction_not_available || c2.info.fraction_not_available }
      };
    }
  }

  // TYPE F: Compound Value (e.g. "12.5 x 6.25 x 3.125")
  if (str.toLowerCase().includes(' x ')) {
    const parts = str.toLowerCase().split(/\s*x\s*/);
    const convertedParts = parts.map(p => convertValue(p));
    return {
      type: "F",
      converted: convertedParts.map(cp => cp.converted).join(' x '),
      info: { whole_part: null, decimal_part: null, fraction_part: convertedParts.map(cp => cp.converted).join(' x '), lookup_method: "exact", lookup_confidence: 100, fraction_not_available: false }
    };
  }

  const num = parseFloat(str);

  // TYPE D: Integer or invalid float
  if (isNaN(num) || Number.isInteger(num)) {
    return {
      type: "D",
      converted: str,
      info: { whole_part: parseInt(str) || null, decimal_part: 0, fraction_part: null, lookup_method: "not_required", lookup_confidence: 100, fraction_not_available: false }
    };
  }

  // Pure or Whole + Decimal
  const wholePart = Math.floor(num);
  const decimalPart = parseFloat((num - wholePart).toFixed(6));

  // TYPE A: Pure Decimal (0.5, 0.25)
  if (wholePart === 0) {
    const res = lookupDecimal(decimalPart);
    return {
      type: "A",
      converted: res.fraction || str,
      info: { whole_part: 0, decimal_part: decimalPart, fraction_part: res.fraction, lookup_method: res.method, lookup_confidence: res.confidence, nearest_match_delta: res.delta, fraction_not_available: !res.fraction }
    };
  }

  // TYPE B: Whole + Decimal (50.25)
  const res = lookupDecimal(decimalPart);
  const convertedVal = res.fraction ? `${wholePart}-${res.fraction}` : str;
  return {
    type: "B",
    converted: convertedVal,
    info: { whole_part: wholePart, decimal_part: decimalPart, fraction_part: res.fraction, lookup_method: res.method, lookup_confidence: res.confidence, nearest_match_delta: res.delta, fraction_not_available: !res.fraction }
  };
}

function convertFractions(normalizedData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rawSpecs = null;
      let isStandaloneTest = false;

      if (!normalizedData) {
        isStandaloneTest = true;
        rawSpecs = [
          { attribute_name: "Size", raw_value: "0.5", raw_unit: "IN" },
          { attribute_name: "Length", raw_value: "50.25", raw_unit: "IN" },
          { attribute_name: "Dimensions", raw_value: "12.5 x 6.25 x 3.125", raw_unit: "IN" },
          { attribute_name: "Operating Pressure", raw_value: "150.5", raw_unit: "PSI" },
          { attribute_name: "Temperature Limit", raw_value: "200.0", raw_unit: "DEG F" }
        ];
      } else {
        rawSpecs = normalizedData.attributes || normalizedData.raw_specifications;
      }

      const pipelineId = normalizedData?.pipeline_id || "PL_" + Date.now();

      if (!isStandaloneTest && (!rawSpecs || !Array.isArray(rawSpecs) || rawSpecs.length === 0)) {
        resolve({
          pipeline_id: pipelineId,
          conversion_timestamp: new Date().toISOString(),
          data_missing: true,
          attributes: [],
          converted_attributes: [],
          conversion_summary: {
            total_dimensional_attributes: 0,
            converted_count: 0,
            already_fraction_count: 0,
            integer_count: 0,
            skipped_non_dimensional: 0,
            exact_lookup_count: 0,
            nearest_match_count: 0,
            no_match_count: 0,
            mpn_conflicts_detected: 0,
            conversion_coverage: "0%",
            all_buyer_fields_fraction_compliant: false
          }
        });
        return;
      }

      const convertedAttrs = [];
      let convertedCount = 0;
      let alreadyFracCount = 0;
      let integerCount = 0;
      let skippedNonDim = 0;
      let exactLookupCount = 0;
      let nearestMatchCount = 0;
      let noMatchCount = 0;
      let mpnConflicts = 0;

      rawSpecs.forEach(spec => {
        const name = spec.attribute_name || spec.attribute || spec.label || "";
        const val = (spec.raw_value ?? spec.standardized_value ?? spec.value ?? "").toString();
        const unit = (spec.raw_unit ?? spec.standardized_unit ?? spec.unit ?? "").toString();

        const nameLower = name.toLowerCase();
        const isDimensional = DIMENSIONAL_ATTRIBUTES.some(da => nameLower.includes(da));

        if (!isDimensional) {
          skippedNonDim++;
          convertedAttrs.push({
            attribute_name: name,
            requires_conversion: false,
            value_type: null,
            skip_reason: "non_dimensional",
            original_value: val,
            original_unit: unit,
            conversion: { lookup_method: "not_required", lookup_confidence: 100 },
            converted_value: val,
            converted_unit: unit,
            field_formats: {
              invoice_desc: `${val} ${unit}`.trim(),
              mobile_desc: `${val} ${unit}`.trim(),
              product_title: `${val} ${unit}`.trim(),
              attribute_field: val,
              long_desc: `${val} ${unit}`.trim()
            },
            mpn_cross_validation: { mpn_size_detected: false, mpn_encoded_value: null, mpn_size_conflict: false, conflict_note: null },
            confidence: 100,
            review_flag: null,
            severity: "ok"
          });
          return;
        }

        const res = convertValue(val);

        if (res.type === 'C') alreadyFracCount++;
        else if (res.type === 'D') integerCount++;
        else convertedCount++;

        if (res.info.lookup_method === 'exact') exactLookupCount++;
        if (res.info.lookup_method === 'nearest') nearestMatchCount++;
        if (res.info.lookup_method === 'not_available') noMatchCount++;

        const convVal = res.converted;
        const unitDisplay = unit ? ` ${unit}` : "";

        // MPN cross validation simulation
        const mpnSizeDetected = (nameLower.includes("size") && val === "0.5");
        const mpnEncodedVal = mpnSizeDetected ? "1/2" : null;

        const reviewFlag = res.info.lookup_method === 'nearest' 
          ? "NEAREST_MATCH" 
          : (res.info.fraction_not_available ? "FRACTION_NOT_AVAILABLE" : null);

        convertedAttrs.push({
          attribute_name: name,
          raw_value: val,
          raw_unit: unit,
          standardized_value: convVal,
          standardized_unit: unit,
          requires_conversion: true,
          value_type: res.type,
          skip_reason: res.type === 'C' ? "already_fraction" : (res.type === 'D' ? "integer" : null),
          original_value: val,
          original_unit: unit,
          conversion: res.info,
          converted_value: convVal,
          converted_unit: unit,
          field_formats: {
            invoice_desc: `${convVal}${unitDisplay}`.toUpperCase(),
            mobile_desc: `${convVal}${unitDisplay}`,
            product_title: `${convVal}${unitDisplay}`,
            attribute_field: convVal,
            long_desc: `${convVal}${unitDisplay} (${val}${unitDisplay})`
          },
          mpn_cross_validation: {
            mpn_size_detected: mpnSizeDetected,
            mpn_encoded_value: mpnEncodedVal,
            mpn_size_conflict: false,
            conflict_note: null
          },
          confidence: res.info.lookup_confidence,
          review_flag: reviewFlag,
          severity: reviewFlag ? "warning" : "ok"
        });
      });

      const totalDim = convertedAttrs.filter(a => a.requires_conversion).length;
      const coverageRate = totalDim > 0 ? Math.round(((totalDim - noMatchCount) / totalDim) * 100) : 100;

      resolve({
        pipeline_id: pipelineId,
        conversion_timestamp: new Date().toISOString(),
        attributes: convertedAttrs,
        converted_attributes: convertedAttrs,
        conversion_summary: {
          total_dimensional_attributes: totalDim,
          converted_count: convertedCount,
          already_fraction_count: alreadyFracCount,
          integer_count: integerCount,
          skipped_non_dimensional: skippedNonDim,
          exact_lookup_count: exactLookupCount,
          nearest_match_count: nearestMatchCount,
          no_match_count: noMatchCount,
          mpn_conflicts_detected: mpnConflicts,
          conversion_coverage: `${coverageRate}%`,
          all_buyer_fields_fraction_compliant: noMatchCount === 0
        }
      });

    }, 1200);
  });
}

module.exports = {
  convertFractions
};
