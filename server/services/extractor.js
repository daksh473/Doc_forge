const { v4: uuidv4 } = require('uuid');
const llmClient = require('./llmClient');

// Few-shot schema reference example for LLM prompt
const SAMPLE_EXTRACTION_SCHEMA = {
  product_identification: {
    raw_title: "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
    model_number: "BV-2PC-050-316",
    part_number: "BV-2PC-050-316",
    manufacturer: "Valco Industries",
    series_or_family: "Series 2PC",
    country_of_origin: "USA"
  },
  attributes: [
    {
      tier: "1",
      attribute_name: "Product Name",
      raw_value: "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
      raw_unit: null,
      standardized_value: "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
      standardized_unit: null,
      inferred: false,
      inference_basis: null,
      confidence_score: 95,
      confidence_label: "high",
      conflict_detected: false,
      conflict_instances: [],
      source_grounding: {
        chunk_id: "chunk_001",
        page_number: 1,
        section_label: "[PRODUCT_IDENTITY]",
        source_snippet: "1/2\" SS316 2-Piece Ball Valve 1000 WOG"
      }
    },
    {
      tier: "1",
      attribute_name: "Size",
      raw_value: "1/2",
      raw_unit: "inch",
      standardized_value: "1/2",
      standardized_unit: "IN",
      inferred: false,
      inference_basis: null,
      confidence_score: 95,
      confidence_label: "high",
      conflict_detected: false,
      conflict_instances: [],
      source_grounding: {
        chunk_id: "chunk_001",
        page_number: 1,
        section_label: "[PRODUCT_IDENTITY]",
        source_snippet: "1/2 inch"
      }
    }
  ]
};

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
      extraction_failed: false,
      product_identification: { raw_title: sourceFile, model_number: null, manufacturer: null },
      attributes: []
    };
  }

  // Format document text chunks for LLM
  const docText = chunks.map(c => `[CHUNK ${c.chunk_id} | ${c.section_label || 'SECTION'}]:\n${c.content}`).join('\n\n');

  const systemPrompt = `You are a high-precision industrial B2B catalog extraction engine.
Your job is to read raw technical document text and extract product identity and technical specifications into structured JSON format.

CRITICAL RULES:
1. Grounding: Every extracted attribute MUST have a 'source_grounding' object where 'source_snippet' is a REAL verbatim text snippet from the document chunk where you found the attribute.
2. Output Key: Return a JSON object with top-level keys "product_identification" and "attributes" (an array of attribute objects).
3. Accuracy & Honesty: Extract ONLY attributes present or explicitly stated in the document. Do NOT invent missing values.
4. Confidence Scoring: Assign confidence_score 80-100 for clear direct facts, 50-79 for inferred facts.

SCHEMA EXAMPLE (Use strictly for JSON shape reference, NOT for answer content):
${JSON.stringify(SAMPLE_EXTRACTION_SCHEMA, null, 2)}`;

  const prompt = `DOCUMENT CONTENT TO EXTRACT FROM:
----------------------------------------
${docText}
----------------------------------------

Extract all product identity details (raw_title, model_number, part_number, manufacturer, series_or_family) and all technical attributes into the JSON schema.`;

  try {
    const result = await llmClient.completeJSON({ prompt, systemPrompt, maxRetries: 1 });

    const attributes = Array.isArray(result.attributes) ? result.attributes : [];
    const productIdent = result.product_identification || {
      raw_title: attributes.find(a => a.attribute_name === 'Product Name')?.raw_value || sourceFile,
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
      product_identification: { raw_title: sourceFile },
      attributes: []
    };
  }
};
