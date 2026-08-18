const { callLLM } = require('./llmClient');

/**
 * Module 2B — Taxonomy Classification Service
 * Classifies extracted product data into a 3-level industrial/B2B catalog taxonomy.
 */
async function classifyTaxonomy(extractionResult) {
  if (!extractionResult) {
    return {
      taxonomy: {
        category_path: ["Industrial Products"],
        l1: "Industrial Products", l2: "", l3: ""
      },
      category_path: ["Industrial Products"],
      confidence: 30,
      classification_basis: "No extraction data provided",
      classification_uncertain: true
    };
  }

  const pId = extractionResult.product_identification || {};
  const attrs = Array.isArray(extractionResult.attributes) ? extractionResult.attributes : [];

  const rawTitle = pId.raw_title || attrs.find(a => a.attribute_name === 'Product Name')?.raw_value || 'Industrial Product';
  const mfg = pId.manufacturer || '';
  const mpn = pId.model_number || pId.part_number || '';
  const series = pId.series_or_family || '';

  const formattedAttrs = attrs.slice(0, 15).map(a => `${a.attribute_name}: ${a.standardized_value || a.raw_value}`).join('; ');

  const systemPrompt = `You are an expert industrial product catalog taxonomist specializing in B2B catalog categorization across industrial, electrical, HVAC, plumbing, instrumentation, and consumer appliance categories.
Your task is to classify an extracted product into a precise 3-level category hierarchy:
- L1: Broad Department (e.g. "Fluid Control & Valves", "Instrumentation & Sensors", "Appliances & Consumer Electronics", "Electrical & Drives", "Pipes & Fittings", "HVAC & Climate Control")
- L2: Category (e.g. "Valves", "Temperature Sensors", "Kitchen Appliances", "Variable Frequency Drives", "Pipe Fittings")
- L3: Sub-Category / Fine classification (e.g. "Ball Valves", "RTD Probes", "Built-In Dishwashers", "AC Motor Drives", "Threaded Elbows")

Respond ONLY with a valid JSON object matching this schema:
{
  "category_path": ["L1 string", "L2 string", "L3 string"],
  "confidence": 95,
  "classification_basis": "Concise 1-sentence explanation of why this product was classified into this category hierarchy",
  "classification_uncertain": false
}`;

  const userPrompt = `Classify this product into the 3-level B2B catalog taxonomy:
Product Title: ${rawTitle}
Manufacturer: ${mfg}
Model Number: ${mpn}
Series/Family: ${series}
Key Extracted Attributes: ${formattedAttrs}`;

  try {
    const response = await callLLM({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      jsonMode: true
    });

    if (response && Array.isArray(response.category_path) && response.category_path.length > 0) {
      const catPath = response.category_path;
      return {
        taxonomy: {
          category_path: catPath,
          l1: catPath[0] || "",
          l2: catPath[1] || "",
          l3: catPath[2] || ""
        },
        category_path: catPath,
        confidence: typeof response.confidence === 'number' ? response.confidence : 85,
        classification_basis: response.classification_basis || `LLM taxonomy classification for '${rawTitle}'`,
        classification_uncertain: !!response.classification_uncertain
      };
    }
  } catch (err) {
    console.warn(`Taxonomy LLM classification fallback due to error: ${err.message}`);
  }

  // Rule-based fallback if LLM is unavailable or fails
  return fallbackTaxonomy(rawTitle, formattedAttrs);
}

function fallbackTaxonomy(rawTitle, formattedAttrs) {
  const text = (rawTitle + ' ' + formattedAttrs).toLowerCase();
  
  let l1 = "Industrial Products";
  let l2 = "General Industrial";
  let l3 = "Unclassified Equipment";

  if (text.includes("valve")) {
    l1 = "Fluid Control & Valves";
    l2 = "Valves";
    if (text.includes("ball")) l3 = "Ball Valves";
    else if (text.includes("solenoid")) l3 = "Solenoid Valves";
    else if (text.includes("butterfly")) l3 = "Butterfly Valves";
    else l3 = "Process Valves";
  } else if (text.includes("transmitter") || text.includes("sensor") || text.includes("rtd") || text.includes("pt100") || text.includes("thermocouple")) {
    l1 = "Instrumentation & Sensors";
    if (text.includes("pressure")) {
      l2 = "Pressure Instrumentation";
      l3 = "Pressure Transmitters";
    } else if (text.includes("rtd") || text.includes("temp") || text.includes("pt100")) {
      l2 = "Temperature Sensors";
      l3 = "RTD Probes";
    } else {
      l2 = "Process Sensors";
      l3 = "Sensors & Transmitters";
    }
  } else if (text.includes("dishwasher") || text.includes("appliance") || text.includes("refrigerator") || text.includes("oven")) {
    l1 = "Appliances & Consumer Electronics";
    l2 = "Kitchen Appliances";
    if (text.includes("dishwasher")) l3 = "Built-In Dishwashers";
    else l3 = "Major Appliances";
  } else if (text.includes("drive") || text.includes("vfd") || text.includes("motor") || text.includes("inverter")) {
    l1 = "Electrical & Drives";
    l2 = "Motor Drives";
    l3 = "Variable Frequency Drives";
  } else if (text.includes("fitting") || text.includes("elbow") || text.includes("coupling") || text.includes("pipe")) {
    l1 = "Pipes & Fittings";
    l2 = "Pipe Fittings";
    l3 = "Threaded Fittings";
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
