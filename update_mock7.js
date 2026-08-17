const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');

const products = mockProducts.getProducts();

const updatedProducts = products.map((p, index) => {
  
  let citations = [
    {
      attribute_name: "Body Material",
      attributed_value: "SS316",
      citation_level: "exact_match",
      confidence: 100,
      primary_citation: {
        chunk_id: "chk_001",
        page_number: 1,
        section_label: "Specifications",
        context_window: "Body is constructed of → SS316 ← for superior corrosion",
        match_type: "verbatim",
        matched_fragment: "SS316",
        contextual_reasoning: null,
        table_reference: { present: false },
        human_readable_reference: "Page 1, Specifications, Paragraph 2"
      },
      alternate_citations: [],
      multi_source_conflict: false,
      human_verification_required: false,
      verification_reason: null
    },
    {
      attribute_name: "Operating Temperature",
      attributed_value: "0-100°C",
      citation_level: "partial_match",
      confidence: 75,
      primary_citation: {
        chunk_id: "chk_004",
        page_number: 2,
        section_label: "Performance Data",
        context_window: "Temp range from → 0 to 100 Celsius ← max",
        match_type: "synonym_match",
        matched_fragment: "0 to 100 Celsius",
        contextual_reasoning: null,
        table_reference: { present: true, column_header: "Temp Limit", row_label: "Standard", cell_coordinates: "row:2, col:4" },
        human_readable_reference: "Page 2, Performance Data, row:2, col:4"
      },
      alternate_citations: [],
      multi_source_conflict: false,
      human_verification_required: false,
      verification_reason: null
    }
  ];

  // Inject multi-source conflict for Product 0
  if (index === 0) {
    citations.push({
      attribute_name: "Pressure Rating",
      attributed_value: "1000 WOG",
      citation_level: "exact_match",
      confidence: 100,
      primary_citation: {
        chunk_id: "chk_002",
        page_number: 1,
        section_label: "Header Identity",
        context_window: "Ball Valve Series 2000, → 1000 WOG ← rating.",
        match_type: "verbatim",
        matched_fragment: "1000 WOG",
        contextual_reasoning: null,
        table_reference: { present: false },
        human_readable_reference: "Page 1, Header Identity"
      },
      alternate_citations: [
        {
          chunk_id: "chk_005",
          page_number: 3,
          context_window: "Max working pressure is → 800 WOG ← per ANSI.",
          confidence: 80,
          conflict_note: "Differs from primary header. Possible derating in detailed specs."
        }
      ],
      multi_source_conflict: true,
      human_verification_required: true,
      verification_reason: "Conflicting values found in document for Pressure Rating."
    });
  }

  p.grounding = {
    pipeline_id: "pl_" + Math.random().toString(36).substr(2, 9),
    citation_timestamp: new Date().toISOString(),
    source_file: p.classification?.filename || "product_document.pdf",
    total_attributes_cited: citations.length,
    citations: citations,
    citation_coverage_report: {
      exact_match_count: citations.filter(c => c.citation_level === 'exact_match').length,
      partial_match_count: citations.filter(c => c.citation_level === 'partial_match').length,
      contextual_match_count: citations.filter(c => c.citation_level === 'contextual_match').length,
      inferred_only_count: citations.filter(c => c.citation_level === 'inferred_only').length,
      overall_grounding_score: 92,
      grounding_label: "mostly_grounded",
      unverifiable_attributes: citations.filter(c => c.citation_level === 'inferred_only').map(c => c.attribute_name),
      conflict_attributes: citations.filter(c => c.multi_source_conflict).map(c => c.attribute_name)
    }
  };
  
  return p;
});

const output = `// Mock Data for DocForge
// Contains full payloads for 9 stages: extraction, normalization, enrichment, validation, grounding, cataloging, scoring
const products = ${JSON.stringify(updatedProducts, null, 2)};

module.exports = {
  getProducts: () => products,
  selectProduct: (keywords) => {
    if (!keywords) return products[0];
    const kw = keywords.toLowerCase();
    if (kw.includes('ball valve')) return products[0];
    if (kw.includes('pressure transmitter')) return products[1];
    if (kw.includes('solenoid')) return products[2];
    if (kw.includes('fitting') || kw.includes('elbow')) return products[3];
    if (kw.includes('vfd') || kw.includes('drive')) return products[4];
    if (kw.includes('rtd') || kw.includes('sensor')) return products[5];
    return products[0]; // fallback
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'server', 'data', 'mockProducts.js'), output);
console.log('mockProducts.js updated with grounding data!');
