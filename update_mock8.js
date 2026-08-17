const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');

const products = mockProducts.getProducts();

const updatedProducts = products.map((p, index) => {
  let logs = [];

  // Inject reasoning log for Product 0 (Ball Valve) resolving the conflict from Phase 10
  if (index === 0) {
    logs.push({
      log_id: "LOG_001",
      attribute_name: "Pressure Rating",
      log_trigger: "conflict",
      trigger_detail: "multi_source_conflict: true",
      current_value: "1000 WOG",
      current_confidence: 85,
      reasoning_chain: {
        observation: "Document header specifies '1000 WOG'. Page 3 text specifies 'Max working pressure is 800 WOG per ANSI'.",
        gap: "Conflicting nominal ratings within the same source document.",
        steps: [
          {
            step_number: 1,
            logic: "Analyze the location of conflicting values.",
            basis: "document_fact",
            basis_reference: null
          },
          {
            step_number: 2,
            logic: "The header value ('1000 WOG') is standard for this series of 2-piece SS316 valves.",
            basis: "industry_norm",
            basis_reference: "General valve spec sheets"
          },
          {
            step_number: 3,
            logic: "The '800 WOG per ANSI' note likely refers to a specific derated application or higher temperature condition, not the cold working pressure (CWP).",
            basis: "assumption",
            basis_reference: null
          },
          {
            step_number: 4,
            logic: "Default to the standard nominal CWP rating for general catalog indexing.",
            basis: "industry_norm",
            basis_reference: null
          }
        ],
        standard_reference: null,
        assumptions_made: ["800 WOG refers to a derated condition, not the nominal rating."],
        inference_risk: "MEDIUM",
        risk_explanation: "If the manufacturer permanently derated this specific SKU to 800 WOG, publishing 1000 WOG could pose a safety risk for buyers."
      },
      conflict_detail: {
        present: true,
        source_a: { value: "1000 WOG", location: "Page 1, Header Identity", confidence: 100 },
        source_b: { value: "800 WOG", location: "Page 3", confidence: 80 },
        resolution_basis: "Header Identity is standard for nominal rating classification.",
        reviewer_check: "Check Page 3 footnote to confirm if 800 WOG applies to high-temp or all conditions."
      },
      verdict: {
        final_value: "1000 WOG",
        final_confidence: 85,
        use_in_catalog: true,
        display_as_inferred: false
      },
      reviewer_action: {
        action_tag: "CHECK_DOCUMENT",
        action_instruction: "Verify the context of '800 WOG' on Page 3.",
        document_reference: "Page 3",
        estimated_review_time: "1-2 minutes"
      }
    });
  }

  // Inject inferred log for Product 1 (Pressure Transmitter)
  if (index === 1) {
    logs.push({
      log_id: "LOG_002",
      attribute_name: "Enclosure Rating",
      log_trigger: "inferred",
      trigger_detail: "confidence: 60",
      current_value: "NEMA 4X / IP66",
      current_confidence: 60,
      reasoning_chain: {
        observation: "Document mentions 'weatherproof' and 'washdown ready'.",
        gap: "No explicit NEMA or IP rating provided.",
        steps: [
          { step_number: 1, logic: "Washdown ready implies protection against high-pressure water jets.", basis: "document_fact", basis_reference: null },
          { step_number: 2, logic: "IP66 and NEMA 4X are the standard ratings for washdown environments.", basis: "engineering_standard", basis_reference: "NEMA 250 / IEC 60529" }
        ],
        standard_reference: "NEMA 250",
        assumptions_made: ["Manufacturer uses standard definitions for 'washdown ready'."],
        inference_risk: "HIGH",
        risk_explanation: "Manufacturer might only meet IP65. Stating IP66 without certification is risky."
      },
      conflict_detail: { present: false },
      verdict: { final_value: "IP65 (Downgraded for safety)", final_confidence: 70, use_in_catalog: true, display_as_inferred: true },
      reviewer_action: {
        action_tag: "CONTACT_SUPPLIER",
        action_instruction: "Request exact IP/NEMA certification document.",
        document_reference: null,
        estimated_review_time: "5+ minutes"
      }
    });
  }

  p.reasoning = {
    pipeline_id: "pl_" + Math.random().toString(36).substr(2, 9),
    reasoning_timestamp: new Date().toISOString(),
    total_logs_generated: logs.length,
    logs_by_type: {
      inferred_attributes: logs.filter(l => l.log_trigger === 'inferred').length,
      low_confidence_attributes: 0,
      conflict_attributes: logs.filter(l => l.log_trigger === 'conflict').length,
      validation_flagged_attributes: 0
    },
    reasoning_logs: logs,
    module_4_summary: {
      fully_grounded_attributes: 12,
      inferred_attributes_logged: logs.filter(l => l.log_trigger === 'inferred').length,
      conflict_attributes_logged: logs.filter(l => l.log_trigger === 'conflict').length,
      block_risk_attributes: logs.filter(l => l.reasoning_chain.inference_risk === 'BLOCK').map(l => l.attribute_name),
      approve_if_correct_count: 0,
      check_document_count: logs.filter(l => l.reviewer_action.action_tag === 'CHECK_DOCUMENT').length,
      contact_supplier_count: logs.filter(l => l.reviewer_action.action_tag === 'CONTACT_SUPPLIER').length,
      discard_value_count: 0,
      overall_explainability_score: 95,
      ready_for_human_review: true,
      review_estimated_time: `~${logs.length * 2} minutes for ${logs.length} flagged attributes`
    }
  };
  
  return p;
});

const output = `// Mock Data for DocForge
// Contains full payloads for 10 stages: extraction, normalization, enrichment, validation, grounding, reasoning, cataloging, scoring
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
console.log('mockProducts.js updated with reasoning data!');
