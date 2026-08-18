const { callLLM } = require('./llmClient');

/**
 * Module 2B — Taxonomy Classification Service
 * Classifies extracted product data into a 3-level industrial/B2B catalog taxonomy.
 * Uses Part_Desc + Mfg_Part_Num + Part_Manuf from originalRow when available for accuracy.
 */
async function classifyTaxonomy(extractionResult, originalRow) {
  try {
    if (!extractionResult && !originalRow) {
      return {
        category_path: ["Industrial Products"],
        confidence: 0,
        classification_basis: "No extraction data provided",
        classification_uncertain: true
      };
    }

    const pId = (extractionResult && extractionResult.product_identification) || {};
    const specs = Array.isArray(extractionResult?.raw_specifications) 
      ? extractionResult.raw_specifications 
      : (Array.isArray(extractionResult?.attributes) ? extractionResult.attributes : []);

    // Prefer originalRow fields (Part_Desc, Mfg_Part_Num) over LLM-extracted equivalents
    const partDesc = originalRow?.Part_Desc || '';
    const mfgPartNum = originalRow?.Mfg_Part_Num || '';
    const partManuf = originalRow?.Part_Manuf || '';
    const rawTitle = partDesc || pId.raw_title || specs.find(a => (a.attribute_name || a.name) === 'Product Name')?.raw_value || 'Industrial Product';
    const mfg = pId.manufacturer || '';
    const mpn = mfgPartNum || pId.model_number || pId.part_number || '';

    const formattedSpecs = specs
      .slice(0, 20)
      .map(s => `${s.attribute_name || s.name || 'attr'}: ${s.raw_value || s.standardized_value || ''}`)
      .filter(Boolean)
      .join('; ');

    const systemPrompt = `You are an expert industrial/retail PRODUCT catalog taxonomist.
Your ONLY task is to classify a PRODUCT into a 3-level B2B catalog category hierarchy based on what the product IS.

CRITICAL RULES:
- You are classifying the PRODUCT TYPE, NOT the document format.
- NEVER use document format terms as categories (csv_structured, pdf_datasheet, plain_text, image_scan, etc.)
- NEVER return "Industrial" as L1 with a document format as L2.
- Read the product description and part number to determine what physical product this is.

L1 = Broad department (e.g. "Abrasives", "Appliances & Consumer Electronics", "Electrical", "Fluid Control", "Tools", "HVAC & Climate Control", "Instrumentation", "Plumbing", "Safety & PPE")
L2 = Category (e.g. "Coated Abrasives", "Kitchen Appliances", "Lighting", "Valves", "Power Tools", "Temperature Sensors", "Wire & Cable")
L3 = Sub-category (e.g. "Sanding Belts", "Built-In Dishwashers", "LED Bulbs", "Ball Valves", "Circular Saws", "RTD Probes", "Building Wire")

REAL CATEGORY EXAMPLES (use these as style reference):
- Sanding belts/discs → "Abrasives>Coated Abrasives>Sanding Belts" or "Abrasives>Coated Abrasives>Sanding Discs"
- Dishwashers → "Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers"
- Light bulbs → "Electrical>Lighting>LED Bulbs"
- Circular saws → "Tools>Power Tools>Circular Saws"
- Pipe fittings → "Fluid Control>Fittings>Pipe Elbows"
- Wire → "Electrical>Wire & Cable>Building Wire"
- Ball valves → "Fluid Control>Valves>Ball Valves"
- Temperature sensors → "Instrumentation>Temperature Sensors>RTD Probes"
- VFDs → "Electrical>Motors & Drives>Variable Frequency Drives"

Respond ONLY with a valid JSON object — no markdown fences, no explanation:
{
  "category_path": ["L1 value", "L2 value", "L3 value"],
  "confidence": number between 0 and 100,
  "classification_basis": "one sentence explaining what in the data led to this classification",
  "classification_uncertain": boolean
}

If the product type CANNOT be confidently determined:
- Return category_path: ["Industrial Products"] (L2 and L3 empty/absent)
- Set confidence below 50
- Set classification_uncertain: true
- Do NOT fabricate specific sub-categories with no basis`;

    const userPrompt = `Classify this PRODUCT into the 3-level B2B catalog taxonomy.

Product Description: ${rawTitle}
Manufacturer Part Number: ${mpn}
Manufacturer/Supplier: ${mfg || partManuf}
Extracted Specifications: ${formattedSpecs || 'None available'}

What physical product is this? Classify it.`;

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

    // GUARD: reject if LLM returned document format terms as category
    const catPath = Array.isArray(parsed.category_path) && parsed.category_path.length > 0 
      ? parsed.category_path 
      : ["Industrial Products"];
    
    const docFormatTerms = ['csv_structured', 'csv_messy', 'pdf_datasheet', 'pdf_unstructured', 'image_scan', 'plain_text'];
    const hasDocFormatTerm = catPath.some(level => docFormatTerms.includes((level || '').toLowerCase()));
    if (hasDocFormatTerm) {
      console.warn('Taxonomy LLM returned document format terms as category — falling back');
      return fallbackTaxonomy(rawTitle, formattedSpecs);
    }

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
  const text = (rawTitle + ' ' + (formattedSpecs || '')).toLowerCase();
  
  let l1 = "Industrial Products";
  let l2 = "General Industrial";
  let l3 = "Unclassified Equipment";

  if (text.includes("sanding") || text.includes("abrasive") || text.includes("stikit") || text.includes("cubitron") || text.includes("grit") || text.includes("hiolit")) {
    l1 = "Abrasives";
    if (text.includes("belt")) { l2 = "Coated Abrasives"; l3 = "Sanding Belts"; }
    else if (text.includes("disc") || text.includes("disk")) { l2 = "Coated Abrasives"; l3 = "Sanding Discs"; }
    else if (text.includes("sheet")) { l2 = "Coated Abrasives"; l3 = "Sanding Sheets"; }
    else { l2 = "Coated Abrasives"; l3 = "Abrasive Products"; }
  } else if (text.includes("dishwasher")) {
    l1 = "Appliances & Consumer Electronics";
    l2 = "Kitchen Appliances";
    l3 = "Built-In Dishwashers";
  } else if (text.includes("refrigerator") || text.includes("fridge")) {
    l1 = "Appliances & Consumer Electronics";
    l2 = "Kitchen Appliances";
    l3 = "Refrigerators";
  } else if (text.includes("oven") || text.includes("range")) {
    l1 = "Appliances & Consumer Electronics";
    l2 = "Kitchen Appliances";
    l3 = "Ovens & Ranges";
  } else if (text.includes("valve")) {
    l1 = "Fluid Control";
    l2 = "Valves";
    if (text.includes("ball")) l3 = "Ball Valves";
    else if (text.includes("solenoid")) l3 = "Solenoid Valves";
    else if (text.includes("butterfly")) l3 = "Butterfly Valves";
    else l3 = "Process Valves";
  } else if (text.includes("transmitter") || text.includes("sensor") || text.includes("rtd") || text.includes("pt100") || text.includes("thermocouple")) {
    l1 = "Instrumentation";
    if (text.includes("pressure")) { l2 = "Pressure Instruments"; l3 = "Pressure Transmitters"; }
    else if (text.includes("rtd") || text.includes("temp") || text.includes("pt100")) { l2 = "Temperature Sensors"; l3 = "RTD Probes"; }
    else { l2 = "Sensors"; l3 = "Process Sensors"; }
  } else if (text.includes("drive") || text.includes("vfd") || text.includes("motor") || text.includes("inverter")) {
    l1 = "Electrical";
    l2 = "Motors & Drives";
    l3 = "Variable Frequency Drives";
  } else if (text.includes("fitting") || text.includes("elbow") || text.includes("coupling") || text.includes("pipe")) {
    l1 = "Fluid Control";
    l2 = "Fittings";
    l3 = "Pipe Fittings";
  } else if (text.includes("bulb") || text.includes("lamp") || text.includes("led") || text.includes("light")) {
    l1 = "Electrical";
    l2 = "Lighting";
    l3 = "LED Bulbs";
  } else if (text.includes("saw") || text.includes("drill") || text.includes("grinder")) {
    l1 = "Tools";
    l2 = "Power Tools";
    if (text.includes("circular")) l3 = "Circular Saws";
    else if (text.includes("drill")) l3 = "Drills";
    else l3 = "Power Tools";
  } else if (text.includes("wire") || text.includes("cable")) {
    l1 = "Electrical";
    l2 = "Wire & Cable";
    l3 = "Building Wire";
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
