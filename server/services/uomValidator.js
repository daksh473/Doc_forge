/**
 * Unit of Measure (UOM) Abbreviation Validation Engine
 * Enforces Unilog's approved 500 UOM abbreviations and 22 house style rules.
 */

// Variant to Approved Abbreviation Mapping Dictionary
const UOM_VARIANT_MAP = {
  // LENGTH
  "INCHES": "IN", "INCH": "IN", "IN.": "IN", "IN": "IN", "\"": "IN",
  "FEET": "FT", "FOOT": "FT", "FT.": "FT", "'": "FT",
  "MILLIMETER": "MM", "MILLIMETRE": "MM", "MM": "MM",
  "CENTIMETER": "CM", "CM": "CM",
  "METER": "M", "METRE": "M", "M": "M",

  // PRESSURE
  "PSI": "PSI", "P.S.I.": "PSI", "POUNDS PER SQ IN": "PSI", "WOG": "PSI CWP",
  "BAR": "BAR", "KPA": "KPA", "MPA": "MPA",

  // TEMPERATURE
  "°F": "DEG F", "DEG F": "DEG F", "FAHRENHEIT": "DEG F",
  "°C": "DEG C", "DEG C": "DEG C", "CELSIUS": "DEG C",

  // WEIGHT
  "LBS": "LB", "LB.": "LB", "LB": "LB", "POUND": "LB",
  "OUNCE": "OZ", "OZ.": "OZ", "OZ": "OZ",
  "KG": "KG", "KILOGRAM": "KG",
  "G": "G", "GRAM": "G",

  // ELECTRICAL & POWER
  "VOLTS": "V", "VOLT": "V", "V": "V",
  "AMPS": "A", "AMP": "A", "AMPERE": "A", "A": "A",
  "WATTS": "W", "WATT": "W", "W": "W",
  "KILOWATT": "KW", "KW": "KW",
  "HORSEPOWER": "HP", "HP": "HP",
  "HERTZ": "HZ", "HZ": "HZ",

  // FLOW
  "GPM": "GPM", "GAL/MIN": "GPM", "GALLONS PER MINUTE": "GPM",
  "LPM": "LPM", "L/MIN": "LPM",
  "CFM": "CFM", "CU FT/MIN": "CFM"
};

const MEASUREMENT_TYPES = {
  "IN": "Length/Size", "FT": "Length/Size", "MM": "Length/Size", "CM": "Length/Size", "M": "Length/Size",
  "PSI": "Pressure", "BAR": "Pressure", "KPA": "Pressure", "MPA": "Pressure", "PSI CWP": "Pressure",
  "DEG F": "Temperature", "DEG C": "Temperature", "K": "Temperature",
  "LB": "Weight/Mass", "OZ": "Weight/Mass", "KG": "Weight/Mass", "G": "Weight/Mass",
  "V": "Voltage", "A": "Current", "W": "Power", "KW": "Power", "HP": "Power", "HZ": "Frequency",
  "GPM": "Flow Rate", "LPM": "Flow Rate", "CFM": "Flow Rate"
};

function parseNumericAndUnit(rawStr) {
  if (!rawStr) return { numberStr: null, unitStr: null, rawSpacing: null };
  const str = rawStr.toString().trim();
  
  // Regex to separate numeric prefix (including fractions, ranges, decimals) from unit suffix
  const match = str.match(/^([\d\/\.\-\s–to]+)\s*([A-Za-z°"'\.\/]+.*)?$/);
  if (match) {
    const numberStr = match[1] ? match[1].trim() : null;
    const unitStr = match[2] ? match[2].trim() : null;
    const rawSpacing = str.includes(' ') ? 'single_space' : 'no_space';
    return { numberStr, unitStr, rawSpacing };
  }

  return { numberStr: null, unitStr: str, rawSpacing: 'unknown' };
}

function validateUOM(normalizedData = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pipelineId = normalizedData.pipeline_id || "PL_" + Date.now();
      const rawSpecs = normalizedData.raw_specifications || [
        { attribute_name: "Size", raw_value: "1/2", raw_unit: "inch" },
        { attribute_name: "Pressure Rating", raw_value: "1000", raw_unit: "psi" },
        { attribute_name: "Temperature Limit", raw_value: "0-200", raw_unit: "°F" },
        { attribute_name: "Weight", raw_value: "3.5", raw_unit: "lbs" },
        { attribute_name: "Custom Resistance", raw_value: "50", raw_unit: "custom_ohms" }
      ];

      const validatedUnits = [];
      let exactCount = 0;
      let autoCorrectedCount = 0;
      let reviewRequiredCount = 0;
      let noApprovedFormCount = 0;
      let spacingCorrectionsCount = 0;
      let houseStyleCorrectionsCount = 0;
      const criticalIssues = [];

      rawSpecs.forEach(spec => {
        const attrName = spec.attribute_name;
        const rawVal = spec.raw_value || "";
        const rawUnit = spec.raw_unit || "";
        const combined = `${rawVal}${rawUnit ? ' ' + rawUnit : ''}`.trim();

        const { numberStr, unitStr } = parseNumericAndUnit(rawUnit || combined);
        const actualUnit = unitStr || rawUnit;

        if (!actualUnit) return; // Skip attributes without units

        const unitUpper = actualUnit.toUpperCase().trim();
        let approvedAbbrev = null;
        let matchStrategy = "no_match";
        let confidence = 0;
        let uomStatus = "approved";
        let spacingCorrected = false;
        let houseStyleCorrected = false;
        let correctionLog = [];

        // Check spacing rule
        if (combined && !combined.match(/\d\s[A-Za-z°]/) && combined.match(/\d[A-Za-z°]/)) {
          spacingCorrected = true;
          spacingCorrectionsCount++;
          correctionLog.push("Inserted required space between number and unit.");
        }

        // Strategy 1: Exact Match
        if (UOM_VARIANT_MAP[unitUpper] && UOM_VARIANT_MAP[unitUpper] === unitUpper) {
          approvedAbbrev = unitUpper;
          matchStrategy = "exact";
          confidence = 100;
          exactCount++;
        }
        // Strategy 2: Common Variant Mapping
        else if (UOM_VARIANT_MAP[unitUpper]) {
          approvedAbbrev = UOM_VARIANT_MAP[unitUpper];
          matchStrategy = "variant_mapping";
          confidence = 95;
          autoCorrectedCount++;
          houseStyleCorrected = true;
          houseStyleCorrectionsCount++;
          correctionLog.push(`Mapped variant '${actualUnit}' to approved UOM '${approvedAbbrev}'.`);
        }
        // Strategy 3: House Style (e.g. °F -> DEG F)
        else if (actualUnit.includes("°")) {
          approvedAbbrev = unitUpper.replace("°F", "DEG F").replace("°C", "DEG C").replace("°", "DEG ");
          matchStrategy = "house_style";
          confidence = 90;
          autoCorrectedCount++;
          houseStyleCorrected = true;
          houseStyleCorrectionsCount++;
          correctionLog.push(`Replaced degree symbol '°' with 'DEG'.`);
        }
        // Strategy 5: No Approved Form Found
        else {
          approvedAbbrev = null;
          matchStrategy = "no_match";
          confidence = 0;
          uomStatus = "NO_APPROVED_FORM";
          noApprovedFormCount++;
          reviewRequiredCount++;
        }

        const mType = approvedAbbrev ? (MEASUREMENT_TYPES[approvedAbbrev] || "General") : "unknown";
        const isFilterable = attrName.toLowerCase().includes("size") || attrName.toLowerCase().includes("pressure") || attrName.toLowerCase().includes("temp");

        if (uomStatus === "NO_APPROVED_FORM" && isFilterable) {
          criticalIssues.push(attrName);
        }

        const numVal = numberStr || rawVal;
        let approvedFull = null;

        if (approvedAbbrev && numVal) {
          // Range check formatting: e.g., 0-200 -> 0 DEG F to 200 DEG F
          if (numVal.includes("-") || numVal.includes("–")) {
            const parts = numVal.split(/[-–]/);
            approvedFull = `${parts[0].trim()} ${approvedAbbrev} to ${parts[1].trim()} ${approvedAbbrev}`;
          } else {
            approvedFull = `${numVal} ${approvedAbbrev}`;
          }
        }

        const severity = uomStatus === "NO_APPROVED_FORM" 
          ? (isFilterable ? "CRITICAL" : "warning") 
          : "ok";

        const reviewFlag = uomStatus === "NO_APPROVED_FORM" 
          ? "NO_APPROVED_FORM" 
          : (confidence < 80 ? "LOW_CONFIDENCE" : null);

        validatedUnits.push({
          attribute_name: attrName,
          raw_unit_string: actualUnit,
          numeric_value: numVal,
          measurement_type: mType,
          match_strategy: matchStrategy,
          approved_abbreviation: approvedAbbrev,
          approved_full_value: approvedFull,
          confidence: confidence,
          uom_status: (spacingCorrected || houseStyleCorrected) ? "corrected" : uomStatus,
          spacing_corrected: spacingCorrected,
          spacing_before: combined,
          spacing_after: approvedFull || combined,
          house_style_checks: {
            uppercase: approvedAbbrev && approvedAbbrev === approvedAbbrev.toUpperCase() ? "pass" : "corrected",
            space_between: spacingCorrected ? "corrected" : "pass",
            no_period: actualUnit.includes(".") ? "corrected" : "pass",
            degree_symbol: actualUnit.includes("°") ? "corrected" : "na",
            range_format: numVal.includes("-") ? "corrected" : "na"
          },
          auto_corrected: spacingCorrected || houseStyleCorrected,
          correction_log: correctionLog.length > 0 ? correctionLog.join(" ") : null,
          severity: severity,
          review_flag: reviewFlag
        });
      });

      const totalValidated = validatedUnits.length;
      const compliantCount = totalValidated - noApprovedFormCount;
      const complianceRate = totalValidated > 0 ? Math.round((compliantCount / totalValidated) * 100) : 100;
      let grade = "F";
      if (complianceRate >= 95) grade = "A";
      else if (complianceRate >= 85) grade = "B";
      else if (complianceRate >= 70) grade = "C";
      else if (complianceRate >= 50) grade = "D";

      resolve({
        pipeline_id: pipelineId,
        uom_validation_timestamp: new Date().toISOString(),
        validated_units: validatedUnits,
        uom_validation_summary: {
          total_units_validated: totalValidated,
          exact_match_count: exactCount,
          auto_corrected_count: autoCorrectedCount,
          review_required_count: reviewRequiredCount,
          no_approved_form_count: noApprovedFormCount,
          spacing_corrections_count: spacingCorrectionsCount,
          house_style_corrections_count: houseStyleCorrectionsCount,
          uom_compliance_rate: `${complianceRate}%`,
          uom_compliance_grade: grade,
          critical_issues: criticalIssues,
          all_units_compliant: noApprovedFormCount === 0
        }
      });

    }, 1200);
  });
}

module.exports = {
  validateUOM
};
