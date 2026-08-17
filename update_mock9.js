const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');

const products = mockProducts.getProducts();

const updatedProducts = products.map((p, index) => {
  let dashboard = {
    pipeline_id: "pl_" + Math.random().toString(36).substr(2, 9),
    ui_payload_timestamp: new Date().toISOString(),
    source_file: "spec_sheet_v2.pdf",
    left_panel: {
      pages: [
        {
          page_number: 1,
          sections: [
            {
              section_label: "Header Identity",
              content_type: "mixed",
              raw_content: "Ball Valve 1/2\" SS316, 1000 WOG",
              cited_spans: [
                { span_text: "1/2\"", attribute_name: "Size", highlight_color: "green" },
                { span_text: "SS316", attribute_name: "Body Material", highlight_color: "green" },
                { span_text: "1000 WOG", attribute_name: "Pressure Rating", highlight_color: "yellow" }
              ],
              ocr_noise_present: false,
              ocr_noise_segments: []
            }
          ]
        },
        {
          page_number: 3,
          sections: [
            {
              section_label: "Application Notes",
              content_type: "paragraph",
              raw_content: "For high temp applications, max working pressure is 800 WOG per ANSI. Washdown ready enclosure.",
              cited_spans: [
                { span_text: "800 WOG", attribute_name: "Pressure Rating", highlight_color: "red" },
                { span_text: "Washdown ready", attribute_name: "Enclosure Rating", highlight_color: "orange" }
              ],
              ocr_noise_present: false,
              ocr_noise_segments: []
            }
          ]
        }
      ]
    },
    right_panel: {
      product_header: {
        standardized_title: p.enrichment?.product_title?.standardized || "Unknown Product",
        short_title: p.enrichment?.product_title?.short_form || "Unknown",
        model_sku: p.enrichment?.model_sku?.extracted || "GEN-1234",
        category_path: p.enrichment?.category_path ? `${p.enrichment.category_path.l1} > ${p.enrichment.category_path.l2} > ${p.enrichment.category_path.l3}` : "Unknown",
        overall_confidence: p.scoring?.final_score?.overall_score || 85,
        publish_recommendation: "review_then_publish"
      },
      field_groups: []
    },
    review_queue: {
      total_fields: 15,
      auto_approvable_count: 13,
      needs_review_count: 2,
      priority_queue: [],
      estimated_total_review_time: "~4 minutes"
    },
    pipeline_status_summary: {
      module_1_status: "completed",
      module_2_status: "completed",
      module_3_status: "completed",
      module_4_status: "completed",
      overall_pipeline_status: "completed",
      confidence_score: p.scoring?.final_score?.overall_score || 85,
      confidence_label: "Good",
      confidence_color: p.scoring?.final_score?.confidence_color || "green"
    }
  };

  // Inject logic for Product 0 (Ball Valve)
  if (index === 0) {
    dashboard.right_panel.field_groups.push({
      group_name: "Mechanical Specs",
      group_completion: 100,
      fields: [
        {
          field_id: "f_001",
          attribute_name: "Body Material",
          field_type: "select",
          current_value: "SS316",
          current_unit: null,
          standardized_value: "Stainless Steel 316",
          standardized_unit: null,
          display_flag: "✓ verified",
          highlight_level: "none",
          confidence_score: 100,
          inferred: false,
          conflict_detected: false,
          document_link: { chunk_id: "chk_001", page_number: 1, section_label: "Header Identity", context_window: "Ball Valve 1/2\" →SS316←, 1000 WOG", linkable: true },
          inline_reasoning: { has_reasoning_log: false },
          edit_config: { editable: true, select_options: ["SS304", "SS316", "Brass", "Bronze", "Carbon Steel"] }
        },
        {
          field_id: "f_002",
          attribute_name: "Pressure Rating",
          field_type: "text",
          current_value: "1000 WOG",
          current_unit: "PSI",
          standardized_value: "1000",
          standardized_unit: "PSI",
          display_flag: "⚡ conflict",
          highlight_level: "warning",
          confidence_score: 85,
          inferred: false,
          conflict_detected: true,
          document_link: { chunk_id: "chk_001", page_number: 1, section_label: "Header Identity", context_window: "Ball Valve 1/2\" SS316, →1000 WOG←", linkable: true },
          inline_reasoning: {
            has_reasoning_log: true,
            log_id: "LOG_001",
            reasoning_steps: [
              "Analyze the location of conflicting values.",
              "The header value ('1000 WOG') is standard for this series of 2-piece SS316 valves.",
              "The '800 WOG per ANSI' note likely refers to a specific derated application or higher temperature condition, not the cold working pressure (CWP).",
              "Default to the standard nominal CWP rating for general catalog indexing."
            ],
            reviewer_action_tag: "CHECK_DOCUMENT",
            estimated_review_time: "1-2 minutes"
          },
          edit_config: { editable: true }
        }
      ]
    });

    dashboard.review_queue.priority_queue.push({
      priority: 2,
      field_id: "f_002",
      attribute_name: "Pressure Rating",
      reason: "Multi-source conflict detected between Page 1 (1000 WOG) and Page 3 (800 WOG).",
      reviewer_action: "CHECK_DOCUMENT",
      estimated_time: "1-2 minutes"
    });
  }

  // Inject logic for Product 1 (Pressure Transmitter)
  if (index === 1) {
    dashboard.right_panel.field_groups.push({
      group_name: "Electrical & Enclosure",
      group_completion: 100,
      fields: [
        {
          field_id: "f_003",
          attribute_name: "Enclosure Rating",
          field_type: "select",
          current_value: "IP65 (Downgraded for safety)",
          current_unit: null,
          standardized_value: "IP65",
          standardized_unit: null,
          display_flag: "❌ critical",
          highlight_level: "critical",
          confidence_score: 60,
          inferred: true,
          conflict_detected: false,
          document_link: { chunk_id: "chk_008", page_number: 3, section_label: "Application Notes", context_window: "For high temp applications... →Washdown ready← enclosure.", linkable: true },
          inline_reasoning: {
            has_reasoning_log: true,
            log_id: "LOG_002",
            reasoning_steps: [
              "Washdown ready implies protection against high-pressure water jets.",
              "IP66 and NEMA 4X are the standard ratings for washdown environments."
            ],
            reviewer_action_tag: "CONTACT_SUPPLIER",
            estimated_review_time: "5+ minutes"
          },
          edit_config: { editable: true, select_options: ["IP65", "IP66", "IP67", "NEMA 4X", "NEMA 7"] }
        }
      ]
    });

    dashboard.review_queue.priority_queue.push({
      priority: 1,
      field_id: "f_003",
      attribute_name: "Enclosure Rating",
      reason: "High risk inference from 'washdown ready'. Manufacturer might only meet IP65.",
      reviewer_action: "CONTACT_SUPPLIER",
      estimated_time: "5+ minutes"
    });
  }

  p.dashboard = dashboard;
  return p;
});

const output = `// Mock Data for DocForge
// Contains full payloads for 13 stages: extraction, normalization, enrichment, validation, grounding, reasoning, cataloging, scoring, dashboard
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
console.log('mockProducts.js updated with dashboard data!');
