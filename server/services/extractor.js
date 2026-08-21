const { v4: uuidv4 } = require('uuid');
const llmClient = require('./llmClient');

// Few-shot examples for the LLM prompt — covering both verbose and compact catalog title formats
const FEW_SHOT_EXAMPLES = [
  {
    input: 'DCB518ASTS06G Diablo 1/2"x18" - Sanding Belt 6pc',
    output: {
      product_identification: {
        raw_title: 'DCB518ASTS06G Diablo 1/2"x18" - Sanding Belt 6pc',
        model_number: "DCB518ASTS06G",
        part_number: "DCB518ASTS06G",
        manufacturer: "Diablo",
        series_or_family: null,
        country_of_origin: null
      },
      attributes: [
        {
          attribute_name: "Product Name",
          raw_value: 'Diablo 1/2"x18" Sanding Belt',
          raw_unit: null,
          standardized_value: 'Diablo 1/2"x18" Sanding Belt',
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: 'Diablo 1/2"x18" - Sanding Belt' }
        },
        {
          attribute_name: "Width",
          raw_value: "1/2",
          raw_unit: "inch",
          standardized_value: "1/2",
          standardized_unit: "IN",
          inferred: false,
          confidence_score: 90,
          source_grounding: { source_snippet: '1/2"x18"' }
        },
        {
          attribute_name: "Length",
          raw_value: "18",
          raw_unit: "inch",
          standardized_value: "18",
          standardized_unit: "IN",
          inferred: false,
          confidence_score: 90,
          source_grounding: { source_snippet: '1/2"x18"' }
        },
        {
          attribute_name: "Product Type",
          raw_value: "Sanding Belt",
          raw_unit: null,
          standardized_value: "Sanding Belt",
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "Sanding Belt" }
        },
        {
          attribute_name: "Pack Quantity",
          raw_value: "6",
          raw_unit: "pc",
          standardized_value: "6",
          standardized_unit: "EA",
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "6pc" }
        },
        {
          attribute_name: "Brand",
          raw_value: "Diablo",
          raw_unit: null,
          standardized_value: "Diablo",
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "Diablo" }
        }
      ]
    }
  },
  {
    input: '62-1850 11" Led Ceiling Light',
    output: {
      product_identification: {
        raw_title: '62-1850 11" Led Ceiling Light',
        model_number: "62-1850",
        part_number: "62-1850",
        manufacturer: null,
        series_or_family: null,
        country_of_origin: null
      },
      attributes: [
        {
          attribute_name: "Product Name",
          raw_value: '11" LED Ceiling Light',
          raw_unit: null,
          standardized_value: '11" LED Ceiling Light',
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: '11" Led Ceiling Light' }
        },
        {
          attribute_name: "Diameter",
          raw_value: "11",
          raw_unit: "inch",
          standardized_value: "11",
          standardized_unit: "IN",
          inferred: false,
          confidence_score: 85,
          source_grounding: { source_snippet: '11"' }
        },
        {
          attribute_name: "Light Source",
          raw_value: "LED",
          raw_unit: null,
          standardized_value: "LED",
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "Led" }
        },
        {
          attribute_name: "Product Type",
          raw_value: "Ceiling Light",
          raw_unit: null,
          standardized_value: "Ceiling Light",
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "Ceiling Light" }
        }
      ]
    }
  },
  {
    input: "1x6-16' Coastline Sq Edge - Vintage Azek PVC Decking",
    output: {
      product_identification: {
        raw_title: "1x6-16' Coastline Sq Edge - Vintage Azek PVC Decking",
        model_number: null,
        part_number: null,
        manufacturer: "Azek",
        series_or_family: "Vintage",
        country_of_origin: null
      },
      attributes: [
        {
          attribute_name: "Product Name",
          raw_value: "Coastline Sq Edge Vintage Azek PVC Decking",
          raw_unit: null,
          standardized_value: "Coastline Sq Edge Vintage Azek PVC Decking",
          standardized_unit: null,
          inferred: false,
          confidence_score: 90,
          source_grounding: { source_snippet: "Coastline Sq Edge - Vintage Azek PVC Decking" }
        },
        {
          attribute_name: "Nominal Width",
          raw_value: "1",
          raw_unit: "inch",
          standardized_value: "1",
          standardized_unit: "IN",
          inferred: true,
          confidence_score: 80,
          source_grounding: { source_snippet: "1x6" }
        },
        {
          attribute_name: "Nominal Thickness",
          raw_value: "6",
          raw_unit: "inch",
          standardized_value: "6",
          standardized_unit: "IN",
          inferred: true,
          confidence_score: 80,
          source_grounding: { source_snippet: "1x6" }
        },
        {
          attribute_name: "Length",
          raw_value: "16",
          raw_unit: "foot",
          standardized_value: "16",
          standardized_unit: "FT",
          inferred: false,
          confidence_score: 90,
          source_grounding: { source_snippet: "16'" }
        },
        {
          attribute_name: "Color/Finish",
          raw_value: "Coastline",
          raw_unit: null,
          standardized_value: "Coastline",
          standardized_unit: null,
          inferred: false,
          confidence_score: 85,
          source_grounding: { source_snippet: "Coastline" }
        },
        {
          attribute_name: "Edge Type",
          raw_value: "Square Edge",
          raw_unit: null,
          standardized_value: "Square Edge",
          standardized_unit: null,
          inferred: false,
          confidence_score: 90,
          source_grounding: { source_snippet: "Sq Edge" }
        },
        {
          attribute_name: "Material",
          raw_value: "PVC",
          raw_unit: null,
          standardized_value: "PVC",
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "PVC Decking" }
        },
        {
          attribute_name: "Series",
          raw_value: "Vintage",
          raw_unit: null,
          standardized_value: "Vintage",
          standardized_unit: null,
          inferred: false,
          confidence_score: 85,
          source_grounding: { source_snippet: "Vintage" }
        },
        {
          attribute_name: "Product Type",
          raw_value: "Decking",
          raw_unit: null,
          standardized_value: "Decking",
          standardized_unit: null,
          inferred: false,
          confidence_score: 95,
          source_grounding: { source_snippet: "PVC Decking" }
        }
      ]
    }
  }
];

/**
 * Genuine LLM-based Extraction Service using Groq API
 */
exports.extractData = async (chunking) => {
  const pipelineId = chunking.pipeline_id || uuidv4();
  const sourceFile = chunking.source_file || 'uploaded_document';

  const chunks = chunking.chunks || [];
  if (chunks.length === 0) {
    return {
      pipeline_id: pipelineId,
      source_file: sourceFile,
      extraction_timestamp: new Date().toISOString(),
      extraction_failed: true,
      product_identification: { raw_title: null, model_number: null, manufacturer: null },
      attributes: []
    };
  }

  // Format document text chunks for LLM
  const docText = chunks.map(c => `[CHUNK ${c.chunk_id} | ${c.section_label || 'SECTION'}]:\n${c.content}`).join('\n\n');

  const systemPrompt = `You are a high-precision industrial/retail B2B catalog extraction engine.
You extract product identity and technical specifications from document text into structured JSON.

IMPORTANT: You will often receive COMPACT, SINGLE-LINE catalog title strings — NOT verbose spec sheets.
These terse titles encode real specs implicitly. You MUST parse them aggressively.

COMPACT TITLE PARSING RULES:
1. DIMENSION PAIRS/TRIPLES: Tokens like '1/2"x18"' encode TWO dimensions (width=1/2 IN, length=18 IN). 
   Tokens like '1x6-16\'' encode nominal width=1 IN, nominal thickness=6 IN, length=16 FT.
   The " symbol means inches, ' means feet. Parse each number as a separate dimension attribute.
2. PACK/QUANTITY INDICATORS: '6pc', '10pk', '2ct', '50 Disc/Box' → Pack Quantity attribute.
3. BARE NUMBER+UNIT before a noun: '11" Led Ceiling Light' → Diameter=11 IN (the 11" describes the light size).
4. GRIT/GRADE: 'P80', 'P150', '60 Grit' → Grit attribute.
5. MATERIAL/FINISH ADJECTIVES: 'PVC', 'SS316', 'Brass', 'Aluminum' → Material attribute.
   Style names like 'Coastline', 'Vintage', 'Mahogany' → Color/Finish attribute.
   'Sq Edge', 'Grooved' → Edge Type attribute.
6. PRODUCT TYPE: The noun phrase at the end ('Sanding Belt', 'Ceiling Light', 'PVC Decking', 'Cut-Off Disc') → Product Type attribute.
7. BRAND/SERIES: Proper nouns like 'Diablo', 'Cubitron II', 'Stikit', 'Azek' → Brand attribute.
   Series indicators like 'Vintage', 'Enhance Naturals', 'Select 2.0' → Series attribute.
8. VOLTAGE/WATTAGE: '24V', '100W', '120V' → Voltage/Wattage attribute.
9. MODEL/MPN at start of title: Leading alphanumeric codes like 'DCB518ASTS06G', '62-1850', '49-94-0013' are typically the model/part number.

GROUNDING RULE: Every extracted attribute MUST have a 'source_grounding.source_snippet' containing the EXACT substring from the input text that you interpreted. Do NOT fabricate snippets.

CONFIDENCE SCORING:
- 90-100: Clearly stated with explicit units (e.g. '18"' → 18 IN)
- 80-89: Reasonable interpretation requiring minimal inference (e.g. '1x6' → nominal lumber dimensions)
- 50-79: Ambiguous interpretation, set inferred:true (e.g. '11"' before 'Ceiling Light' likely means diameter)

OUTPUT FORMAT: Return a JSON object with exactly these top-level keys:
{
  "product_identification": { "raw_title", "model_number", "part_number", "manufacturer", "series_or_family", "country_of_origin" },
  "attributes": [ { "attribute_name", "raw_value", "raw_unit", "standardized_value", "standardized_unit", "inferred", "confidence_score", "source_grounding": { "source_snippet" } }, ... ]
}

ALWAYS include a "Product Name" attribute (the cleaned product name without leading MPN).
Extract ALL discernible specs — dimensions, materials, quantities, types, colors, finishes, edge types, series. 
For compact titles, you should typically extract 3-8 attributes. An empty attributes array from a real product title is WRONG.

FEW-SHOT EXAMPLES (study these carefully):

EXAMPLE 1:
Input: ${JSON.stringify(FEW_SHOT_EXAMPLES[0].input)}
Output: ${JSON.stringify(FEW_SHOT_EXAMPLES[0].output, null, 2)}

EXAMPLE 2:
Input: ${JSON.stringify(FEW_SHOT_EXAMPLES[1].input)}
Output: ${JSON.stringify(FEW_SHOT_EXAMPLES[1].output, null, 2)}

EXAMPLE 3:
Input: ${JSON.stringify(FEW_SHOT_EXAMPLES[2].input)}
Output: ${JSON.stringify(FEW_SHOT_EXAMPLES[2].output, null, 2)}`;

  const prompt = `DOCUMENT CONTENT TO EXTRACT FROM:
----------------------------------------
${docText}
----------------------------------------

Parse the above text (which may be a compact catalog title, a spec sheet, or any product document). Extract ALL product identity details and ALL technical attributes into the JSON schema. For compact single-line titles, parse embedded dimensions, quantities, materials, finishes, and product type tokens aggressively. Return at least 3 attributes for any real product text. Do NOT return an empty attributes array.`;

  try {
    const result = await llmClient.completeJSON({ prompt, systemPrompt, maxRetries: 1 });

    const attributes = Array.isArray(result.attributes) ? result.attributes : [];
    const productIdent = result.product_identification || {
      raw_title: attributes.find(a => a.attribute_name === 'Product Name')?.raw_value || null,
      model_number: attributes.find(a => a.attribute_name === 'Model Number' || a.attribute_name === 'MPN')?.raw_value || null,
      manufacturer: attributes.find(a => a.attribute_name === 'Manufacturer' || a.attribute_name === 'Brand')?.raw_value || null
    };

    // Standardize grounding fallback if missing chunk_id
    attributes.forEach(attr => {
      if (!attr.source_grounding) {
        attr.source_grounding = {
          chunk_id: chunks[0]?.chunk_id || 'chunk_001',
          page_number: 1,
          section_label: chunks[0]?.section_label || '[DOCUMENT_CONTENT]',
          source_snippet: (attr.raw_value || '').toString().slice(0, 100)
        };
      }
    });

    return {
      pipeline_id: pipelineId,
      source_file: sourceFile,
      extraction_timestamp: new Date().toISOString(),
      extraction_failed: false,
      product_identification: productIdent,
      attributes: attributes,
      extraction_summary: {
        total_attributes_extracted: attributes.length,
        high_confidence_count: attributes.filter(a => (a.confidence_score || 0) >= 80).length,
        low_confidence_count: attributes.filter(a => (a.confidence_score || 0) < 80).length
      }
    };
  } catch (err) {
    console.error('Groq LLM Extraction Error:', err.message);
    // Requirement 5: Graceful failure return rather than silent mock fallback
    return {
      pipeline_id: pipelineId,
      source_file: sourceFile,
      extraction_timestamp: new Date().toISOString(),
      extraction_failed: true,
      error: `LLM Extraction Failed: ${err.message}`,
      product_identification: { raw_title: null, model_number: null, manufacturer: null },
      attributes: []
    };
  }
};
