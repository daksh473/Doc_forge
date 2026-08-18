const { callLLM } = require('./llmClient');

/**
 * Module 2B — Taxonomy Classification Service
 * Classifies extracted product data into a 3-level industrial/B2B catalog taxonomy.
 */
async function classifyTaxonomy(extractionResult) {
  try {
    if (!extractionResult) {
      return {
        category_path: ["Industrial Products"],
        confidence: 0,
        classification_basis: "No extraction data provided",
        classification_uncertain: true
      };
    }

    const pId = extractionResult.product_identification || {};
    const specs = Array.isArray(extractionResult.raw_specifications) 
      ? extractionResult.raw_specifications 
      : (Array.isArray(extractionResult.attributes) ? extractionResult.attributes : []);

    const rawTitle = pId.raw_title || specs.find(a => (a.attribute_name || a.name) === 'Product Name')?.raw_value || 'Industrial Product';
    const mfg = pId.manufacturer || '';
    const mpn = pId.model_number || pId.part_number || '';
    const textBlocks = extractionResult.raw_text_blocks ? JSON.stringify(extractionResult.raw_text_blocks) : '';

    const formattedSpecs = specs
      .slice(0, 20)
      .map(s => `${s.attribute_name || s.name || 'attr'}: ${s.raw_value || s.standardized_value || ''}`)
      .filter(Boolean)
      .join('; ');

    const systemPrompt = `You are an expert industrial product catalog taxonomist specializing in B2B catalog categorization across industrial, electrical, HVAC, plumbing, instrumentation, and consumer appliance categories.
Your task is to classify an extracted product into a precise 3-level category hierarchy:
- L1: Broad Department (e.g. "Fluid Control", "Instrumentation", "Appliances & Consumer Electronics", "Electrical", "Pipes & Fittings")
- L2: Category (e.g. "Valves", "Temperature Sensors", "Kitchen Appliances", "Motors & Drives", "Pipe Fittings")
- L3: Sub-Category / Fine classification (e.g. "Ball Valves", "RTD Probes", "Built-In Dishwashers", "Variable Frequency Drives", "Pipe Elbows")

Respond ONLY with a valid JSON object matching this schema:
{
  "category_path": ["L1 value", "L2 value", "L3 value"],
  "confidence": number between 0 and 100,
  "classification_basis": "one sentence explaining what in the data led to this classification",
  "classification_uncertain": boolean
}

If the product type CANNOT be confidently determined from the available data:
- Return category_path: ["Industrial Products"] (L2 and L3 empty/absent)
- Set confidence below 50
- Set classification_uncertain: true
- Do NOT fabricate specific sub-categories with no basis`;

    const userPrompt = `Classify this product into the 3-level B2B catalog taxonomy:
Product Title: ${rawTitle}
Manufacturer: ${mfg}
Model Number: ${mpn}
Raw Specifications: ${formattedSpecs}
Source Text Hints: ${textBlocks}`;

    let responseContent;
    try {
      const llmResult = await callLLM({
        prompt: userPrompt,
        systemPrompt: systemPrompt,
        jsonMode: true
      });
      responseContent = typeof llmResult === 'string' ? llmResult : JSON.stringify(llmResult);
    } catch (llmErr) {
      console.warn(`Taxonomy LLM call failed: ${llmErr.message}`);
      return fallbackTaxonomy(rawTitle, formattedSpecs);
    }

    // Strip markdown code fences safely if present
    let cleanJson = responseContent.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.substring(7);
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    cleanJson = cleanJson.trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      return {
        category_path: ["Industrial Products"],
        confidence: 0,
        classification_basis: "Parse error — raw response could not be decoded",
        classification_uncertain: true,
        parse_error: true
      };
    }

    const catPath = Array.isArray(parsed.category_path) && parsed.category_path.length > 0 
      ? parsed.category_path 
      : ["Industrial Products"];

    return {
      taxonomy: {
        category_path: catPath,
        l1: catPath[0] || "",
        l2: catPath[1] || "",
        l3: catPath[2] || ""
      },
      category_path: catPath,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 85,
      classification_basis: parsed.classification_basis || `Classified based on product data for '${rawTitle}'`,
      classification_uncertain: !!parsed.classification_uncertain
    };
  } catch (err) {
    return {
      category_path: ["Industrial Products"],
      confidence: 0,
      classification_basis: `Unexpected error: ${err.message}`,
      classification_uncertain: true,
      parse_error: true
    };
  }
}

function fallbackTaxonomy(rawTitle, formattedSpecs) {
  const text = (rawTitle + ' ' + formattedSpecs).toLowerCase();
  
  let l1 = "Industrial Products";
  let l2 = "General Industrial";
  let l3 = "Unclassified Equipment";

  if (text.includes("valve")) {
    l1 = "Fluid Control";
    l2 = "Valves";
    if (text.includes("ball")) l3 = "Ball Valves";
    else if (text.includes("solenoid")) l3 = "Solenoid Valves";
    else if (text.includes("butterfly")) l3 = "Butterfly Valves";
    else l3 = "Process Valves";
  } else if (text.includes("transmitter") || text.includes("sensor") || text.includes("rtd") || text.includes("pt100") || text.includes("thermocouple")) {
    l1 = "Instrumentation";
    if (text.includes("pressure")) {
      l2 = "Pressure Transmitters";
      l3 = "Differential Pressure Transmitters";
    } else if (text.includes("rtd") || text.includes("temp") || text.includes("pt100")) {
      l2 = "Temperature Sensors";
      l3 = "RTD Probes";
    } else {
      l2 = "Sensors";
      l3 = "Process Sensors";
    }
  } else if (text.includes("dishwasher") || text.includes("appliance") || text.includes("refrigerator") || text.includes("oven")) {
    l1 = "Appliances & Consumer Electronics";
    l2 = "Kitchen Appliances";
    if (text.includes("dishwasher")) l3 = "Built-In Dishwashers";
    else l3 = "Major Appliances";
  } else if (text.includes("drive") || text.includes("vfd") || text.includes("motor") || text.includes("inverter")) {
    l1 = "Electrical";
    l2 = "Motors & Drives";
    l3 = "Variable Frequency Drives";
  } else if (text.includes("fitting") || text.includes("elbow") || text.includes("coupling") || text.includes("pipe")) {
    l1 = "Fluid Control";
    l2 = "Fittings";
    l3 = "Pipe Elbows";
  }

  return {
    taxonomy: {
      category_path: [l1, l2, l3],
      l1, l2, l3
    },
    category_path: [l1, l2, l3],
    confidence: 75,
    classification_basis: `Rule-based fallback taxonomy classification for keywords in '${rawTitle}'`,
    classification_uncertain: false
  };
}

module.exports = {
  classifyTaxonomy
};
