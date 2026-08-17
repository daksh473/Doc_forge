/**
 * DocForge — Realistic Industrial Mock Product Data Library
 */

const products = [
  {
    "keywords": [
      "ball valve",
      "ss316",
      "ss 316",
      "1000wog",
      "1000 wog",
      "two piece",
      "2-piece",
      "bv-",
      "npt"
    ],
    "extraction": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "extraction_timestamp": "{{TIMESTAMP}}",
      "attributes": [
        {
          "tier": "1",
          "attribute_name": "Product Name",
          "raw_value": "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
          "raw_unit": null,
          "standardized_value": "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 95,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "1/2\" SS316 2-Piece B"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Model Number",
          "raw_value": "BV-2PC-050-316",
          "raw_unit": null,
          "standardized_value": "BV-2PC-050-316",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 98,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "BV-2PC-050-316"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Body Material",
          "raw_value": "SS316",
          "raw_unit": null,
          "standardized_value": "SS316",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Body Material: SS316"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Pressure Rating",
          "raw_value": "1000",
          "raw_unit": "WOG",
          "standardized_value": "1000",
          "standardized_unit": "WOG",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Pressure Rating: 100"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Size",
          "raw_value": "1/2",
          "raw_unit": "inch",
          "standardized_value": "25.4",
          "standardized_unit": "mm",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Size: 1/2"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Connection Type",
          "raw_value": "NPT Female",
          "raw_unit": null,
          "standardized_value": "NPT Female",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Connection Type: NPT"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Bore Type",
          "raw_value": "Full Port",
          "raw_unit": null,
          "standardized_value": "Full Port",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Bore Type: Full Port"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Seat Material",
          "raw_value": "PTFE",
          "raw_unit": null,
          "standardized_value": "PTFE",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Seat Material: PTFE"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Stem Packing",
          "raw_value": "PTFE",
          "raw_unit": null,
          "standardized_value": "PTFE",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Stem Packing: PTFE"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Operating Temperature",
          "raw_value": "-20 to 450",
          "raw_unit": "°F",
          "standardized_value": "-20 to 450",
          "standardized_unit": "°F",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Operating Temperatur"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Max Working Pressure (CWP)",
          "raw_value": "1000",
          "raw_unit": "PSI",
          "standardized_value": "6895.0",
          "standardized_unit": "kPa",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Max Working Pressure"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Construction",
          "raw_value": "2-Piece",
          "raw_unit": null,
          "standardized_value": "2-Piece",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Construction: 2-Piec"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Handle Type",
          "raw_value": "Locking Lever Handle",
          "raw_unit": null,
          "standardized_value": "Locking Lever Handle",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Handle Type: Locking"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Weight",
          "raw_value": "0.52",
          "raw_unit": "lbs",
          "standardized_value": "0.52",
          "standardized_unit": "lbs",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Weight: 0.52"
          }
        }
      ],
      "extraction_summary": {
        "tier1_complete": true,
        "tier1_missing": [],
        "tier2_extracted_count": 5,
        "tier3_extracted_count": 2,
        "total_attributes_extracted": 14,
        "inferred_attributes_count": 0,
        "conflicts_detected": [],
        "review_required_attributes": []
      },
      "product_identification": {
        "raw_title": "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
        "model_number": "BV-2PC-050-316",
        "part_number": "BV1000-050-SS316-NPT",
        "manufacturer": "Valco Industries",
        "series_or_family": "1000 Series",
        "country_of_origin": "Taiwan"
      }
    },
    "enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Fluid Control",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Valves",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Ball Valve",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Standard Body",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "8481.80",
        "description": "Ball Valve for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "1/2\" SS316 2-Piece Full Port Ball Valve, 1000 WOG, NPT Threaded — Valco 1000 Series",
        "short_title": "1/2\" SS316 Ball Valve 1000WOG NPT",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "1/2 inch ball valve",
          "SS316 ball valve",
          "1000 WOG ball valve",
          "stainless steel ball valve NPT"
        ],
        "technical_synonyms": [
          "1/2 inch 2 piece stainless steel ball valve 1000 psi threaded",
          "CF8M full port ball valve PTFE seat",
          "SS316 valve for chemical service"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "preprocessing": {
      "source_file": "{{FILENAME}}",
      "document_type": "{{DOC_TYPE}}",
      "total_pages_processed": 1,
      "sections": [
        {
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "raw_content": "1/2\" SS316 2-Piece Ball Valve 1000 WOG\nModel: BV-2PC-050-316\nPN: BV1000-050-SS316-NPT\nManufacturer: Valco Industries",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "raw_content": "High-performance 2-piece investment cast stainless steel ball valve designed for industrial fluid control applications. Features a full port design for unrestricted flow and PTFE seats for broad chemical compatibility.",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[FEATURES_LIST]",
          "page_number": 1,
          "raw_content": "- Investment cast CF8M (SS316) body and end cap\n- Blowout-proof stem design per MSS SP-110\n- Full port bore for minimal pressure drop\n- Virgin PTFE seats and stem packing\n- Vinyl-coated locking lever handle\n- Fire-safe design capable",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "raw_content": "Technical Specifications Table",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Standard Specs",
              "rows": [
                {
                  "key": "Body Material",
                  "value": "SS316",
                  "unit": null
                },
                {
                  "key": "Pressure Rating",
                  "value": "1000",
                  "unit": "WOG"
                },
                {
                  "key": "Size",
                  "value": "1/2",
                  "unit": "inch"
                },
                {
                  "key": "Connection Type",
                  "value": "NPT Female",
                  "unit": null
                },
                {
                  "key": "Bore Type",
                  "value": "Full Port",
                  "unit": null
                },
                {
                  "key": "Seat Material",
                  "value": "PTFE",
                  "unit": null
                },
                {
                  "key": "Stem Packing",
                  "value": "PTFE",
                  "unit": null
                },
                {
                  "key": "Operating Temperature",
                  "value": "-20 to 450",
                  "unit": "°F"
                },
                {
                  "key": "Max Working Pressure (CWP)",
                  "value": "1000",
                  "unit": "PSI"
                },
                {
                  "key": "Construction",
                  "value": "2-Piece",
                  "unit": null
                },
                {
                  "key": "Handle Type",
                  "value": "Locking Lever Handle",
                  "unit": null
                },
                {
                  "key": "Weight",
                  "value": "0.52",
                  "unit": "lbs"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DIMENSIONAL_DRAWING]",
          "page_number": 1,
          "raw_content": "Dimensional References",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Dimensions",
              "rows": [
                {
                  "key": "Face-to-Face Length",
                  "value": "2.56",
                  "unit": "inches"
                },
                {
                  "key": "Height (incl. Handle)",
                  "value": "3.38",
                  "unit": "inches"
                },
                {
                  "key": "Bore Diameter",
                  "value": "0.50",
                  "unit": "inches"
                },
                {
                  "key": "Thread Size",
                  "value": "1/2-14",
                  "unit": "NPT"
                },
                {
                  "key": "Body OD",
                  "value": "1.25",
                  "unit": "inches"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        }
      ],
      "extraction_summary": {
        "sections_found": [
          "[PRODUCT_IDENTITY]",
          "[DESCRIPTION_BLOCK]",
          "[FEATURES_LIST]",
          "[SPECIFICATIONS_TABLE]",
          "[DIMENSIONAL_DRAWING]"
        ],
        "sections_missing": [
          "[CERTIFICATIONS]",
          "[WARNINGS_NOTES]"
        ],
        "ocr_noise_overall": "low",
        "extraction_quality": "high",
        "extraction_notes": "Clean document, table structure preserved."
      }
    },
    "chunking": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "total_chunks": 3,
      "chunks": [
        {
          "chunk_id": "chunk_001",
          "chunk_index": 1,
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "identity",
          "content": "1/2\" SS316 2-Piece Ball Valve 1000 WOG | Model: BV-2PC-050-316",
          "key_value_pairs": [
            {
              "key": "Model",
              "value": "BV-2PC-050-316",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 25,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "chunk_sequence": 1
          }
        },
        {
          "chunk_id": "chunk_002",
          "chunk_index": 2,
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "specs_table",
          "content": "Body Material: SS316 , Pressure Rating: 1000 WOG, Size: 1/2 inch, Connection Type: NPT Female , Bore Type: Full Port , Seat Material: PTFE , Stem Packing: PTFE , Operating Temperature: -20 to 450 °F, Max Working Pressure (CWP): 1000 PSI, Construction: 2-Piece , Handle Type: Locking Lever Handle , Weight: 0.52 lbs",
          "key_value_pairs": [
            {
              "key": "Body Material",
              "value": "SS316",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Pressure Rating",
              "value": "1000",
              "unit": "WOG",
              "ocr_suspect": false
            },
            {
              "key": "Size",
              "value": "1/2",
              "unit": "inch",
              "ocr_suspect": false
            },
            {
              "key": "Connection Type",
              "value": "NPT Female",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Bore Type",
              "value": "Full Port",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Seat Material",
              "value": "PTFE",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Stem Packing",
              "value": "PTFE",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Operating Temperature",
              "value": "-20 to 450",
              "unit": "°F",
              "ocr_suspect": false
            },
            {
              "key": "Max Working Pressure (CWP)",
              "value": "1000",
              "unit": "PSI",
              "ocr_suspect": false
            },
            {
              "key": "Construction",
              "value": "2-Piece",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Handle Type",
              "value": "Locking Lever Handle",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Weight",
              "value": "0.52",
              "unit": "lbs",
              "ocr_suspect": false
            }
          ],
          "token_estimate": 88,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "chunk_sequence": 2
          }
        },
        {
          "chunk_id": "chunk_003",
          "chunk_index": 3,
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "high_priority": false,
          "content_type": "description",
          "content": "High-performance 2-piece investment cast stainless steel ball valve designed for industrial fluid control applications. Features a full port design for unrestricted flow and PTFE seats for broad chemical compatibility.",
          "key_value_pairs": [],
          "token_estimate": 64,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[DESCRIPTION_BLOCK]",
            "chunk_sequence": 3
          }
        }
      ],
      "pipeline_summary": {
        "high_priority_chunks": 2,
        "identity_chunks": 1,
        "spec_chunks": 1,
        "description_chunks": 1,
        "ready_for_module_2": true,
        "blocking_issues": []
      }
    },
    "new_enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Fluid Control",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Valves",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Ball Valve",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Standard Body",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "8481.80",
        "description": "Ball Valve for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "1/2\" SS316 2-Piece Full Port Ball Valve, 1000 WOG, NPT Threaded — Valco 1000 Series",
        "short_title": "1/2\" SS316 Ball Valve 1000WOG NPT",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "1/2 inch ball valve",
          "SS316 ball valve",
          "1000 WOG ball valve",
          "stainless steel ball valve NPT"
        ],
        "technical_synonyms": [
          "1/2 inch 2 piece stainless steel ball valve 1000 psi threaded",
          "CF8M full port ball valve PTFE seat",
          "SS316 valve for chemical service"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "cataloging": {
      "pipeline_id": "{{UUID}}",
      "commercial_catalog": {
        "short_summary": "Industrial grade Ball Valve for robust operational performance.",
        "detailed_description": "This 1/2\" SS316 2-Piece Ball Valve 1000 WOG provides reliable performance in industrial environments. Constructed to rigorous standards, it ensures maximum durability and operational safety. Designed with precision to meet exact flow and pressure ratings. It connects seamlessly into existing systems via standard interfaces. Suitable for a wide range of applications including fluid control and processing.",
        "bullet_features": [
          {
            "category": "Product Name",
            "spec_value": "1/2\" SS316 2-Piece Ball Valve 1000 WOG / 1/2\" SS316 2-Piece Ball Valve 1000 WOG",
            "benefit_note": "Designed for industrial product name requirements"
          },
          {
            "category": "Model Number",
            "spec_value": "BV-2PC-050-316 / BV-2PC-050-316",
            "benefit_note": "Designed for industrial model number requirements"
          },
          {
            "category": "Body Material",
            "spec_value": "SS316 / SS316",
            "benefit_note": "Designed for industrial body material requirements"
          },
          {
            "category": "Pressure Rating",
            "spec_value": "1000 / 1000 WOG",
            "benefit_note": "Designed for industrial pressure rating requirements"
          },
          {
            "category": "Size",
            "spec_value": "1/2 / 25.4 mm",
            "benefit_note": "Designed for industrial size requirements"
          },
          {
            "category": "Connection Type",
            "spec_value": "NPT Female / NPT Female",
            "benefit_note": "Designed for industrial connection type requirements"
          }
        ],
        "compatibility_block": {
          "target_industries": [
            "Oil & Gas",
            "Chemical Processing",
            "Water Treatment"
          ],
          "compatible_media": [
            "Water",
            "Air",
            "Non-corrosive liquids"
          ],
          "mating_standards": [
            "ANSI",
            "ASME",
            "NPT"
          ],
          "not_recommended_for": [
            "Highly corrosive acids",
            "Extreme temperatures beyond rating"
          ]
        },
        "spec_summary_table": [
          {
            "attribute": "Product Name",
            "raw_value": "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
            "standardized_value": "1/2\" SS316 2-Piece Ball Valve 1000 WOG",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Model Number",
            "raw_value": "BV-2PC-050-316",
            "standardized_value": "BV-2PC-050-316",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Body Material",
            "raw_value": "SS316",
            "standardized_value": "SS316",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Pressure Rating",
            "raw_value": "1000",
            "standardized_value": "1000 WOG",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Size",
            "raw_value": "1/2",
            "standardized_value": "25.4 mm",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Connection Type",
            "raw_value": "NPT Female",
            "standardized_value": "NPT Female",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Bore Type",
            "raw_value": "Full Port",
            "standardized_value": "Full Port",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Seat Material",
            "raw_value": "PTFE",
            "standardized_value": "PTFE",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Stem Packing",
            "raw_value": "PTFE",
            "standardized_value": "PTFE",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Operating Temperature",
            "raw_value": "-20 to 450",
            "standardized_value": "-20 to 450 °F",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Max Working Pressure (CWP)",
            "raw_value": "1000",
            "standardized_value": "6895.0 kPa",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Construction",
            "raw_value": "2-Piece",
            "standardized_value": "2-Piece",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Handle Type",
            "raw_value": "Locking Lever Handle",
            "standardized_value": "Locking Lever Handle",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Weight",
            "raw_value": "0.52",
            "standardized_value": "0.52 lbs",
            "inferred": false,
            "display_flag": "none"
          }
        ]
      },
      "content_quality": {
        "spec_backed_claims": 6,
        "inferred_claims": 0,
        "readability_check": "passed",
        "missing_content_warnings": []
      }
    }
  },
  {
    "keywords": [
      "pressure transmitter",
      "pressure sensor",
      "0-100",
      "4-20ma",
      "4-20",
      "transmitter",
      "psi",
      "transducer"
    ],
    "extraction": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "extraction_timestamp": "{{TIMESTAMP}}",
      "attributes": [
        {
          "tier": "1",
          "attribute_name": "Product Name",
          "raw_value": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output",
          "raw_unit": null,
          "standardized_value": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 95,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "Industrial Pressure "
          }
        },
        {
          "tier": "1",
          "attribute_name": "Model Number",
          "raw_value": "PT-100-420-SS",
          "raw_unit": null,
          "standardized_value": "PT-100-420-SS",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 98,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "PT-100-420-SS"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Pressure Range",
          "raw_value": "0-100",
          "raw_unit": "PSI",
          "standardized_value": "0.0",
          "standardized_unit": "kPa",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Pressure Range: 0-10"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Output Signal",
          "raw_value": "4-20",
          "raw_unit": "mA",
          "standardized_value": "4-20",
          "standardized_unit": "mA",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Output Signal: 4-20"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Supply Voltage",
          "raw_value": "10-30",
          "raw_unit": "VDC",
          "standardized_value": "10-30",
          "standardized_unit": "VDC",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Supply Voltage: 10-3"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Accuracy",
          "raw_value": "±0.25",
          "raw_unit": "%FS (BFSL)",
          "standardized_value": "±0.25",
          "standardized_unit": "%FS (BFSL)",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Accuracy: ±0.25"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Process Connection",
          "raw_value": "1/4-18",
          "raw_unit": "NPT Male",
          "standardized_value": "1/4-18",
          "standardized_unit": "NPT Male",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Process Connection: "
          }
        },
        {
          "tier": "2",
          "attribute_name": "Wetted Parts Material",
          "raw_value": "316L SS",
          "raw_unit": null,
          "standardized_value": "316L SS",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Wetted Parts Materia"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Diaphragm",
          "raw_value": "316L SS",
          "raw_unit": null,
          "standardized_value": "316L SS",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Diaphragm: 316L SS"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Operating Temp",
          "raw_value": "-40 to 185",
          "raw_unit": "°F",
          "standardized_value": "-40 to 185",
          "standardized_unit": "°F",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Operating Temp: -40 "
          }
        },
        {
          "tier": "2",
          "attribute_name": "Enclosure Rating",
          "raw_value": "IP65",
          "raw_unit": null,
          "standardized_value": "IP65",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Enclosure Rating: IP"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Response Time",
          "raw_value": "<5",
          "raw_unit": "ms",
          "standardized_value": "<5",
          "standardized_unit": "ms",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Response Time: <5"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Burst Pressure",
          "raw_value": "300",
          "raw_unit": "PSI",
          "standardized_value": "2068.5",
          "standardized_unit": "kPa",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Burst Pressure: 300"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Electrical Connection",
          "raw_value": "DIN 43650 Form A",
          "raw_unit": null,
          "standardized_value": "DIN 43650 Form A",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Electrical Connectio"
          }
        }
      ],
      "extraction_summary": {
        "tier1_complete": true,
        "tier1_missing": [],
        "tier2_extracted_count": 5,
        "tier3_extracted_count": 2,
        "total_attributes_extracted": 14,
        "inferred_attributes_count": 0,
        "conflicts_detected": [],
        "review_required_attributes": []
      },
      "product_identification": {
        "raw_title": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output",
        "model_number": "PT-100-420-SS",
        "part_number": "PT100-14NPT-420MA",
        "manufacturer": "SensTech Instruments",
        "series_or_family": "PT Series",
        "country_of_origin": "USA"
      }
    },
    "enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Instrumentation",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Sensors",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Pressure Transmitter",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Industrial Mount",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "9026.20",
        "description": "Pressure Transmitter for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "SensTech PT Series Industrial Pressure Transmitter, 0-100 PSI, 4-20mA, 1/4\" NPT, 316L SS Wetted Parts",
        "short_title": "0-100 PSI Pressure Transmitter 4-20mA",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "pressure transmitter 4-20mA",
          "0-100 PSI transmitter",
          "industrial pressure sensor",
          "316L pressure transmitter"
        ],
        "technical_synonyms": [
          "0-100 PSI 4-20mA pressure transmitter 1/4 NPT stainless steel",
          "loop powered pressure sensor IP65"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "preprocessing": {
      "source_file": "{{FILENAME}}",
      "document_type": "{{DOC_TYPE}}",
      "total_pages_processed": 1,
      "sections": [
        {
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "raw_content": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output\nModel: PT-100-420-SS\nPN: PT100-14NPT-420MA\nManufacturer: SensTech Instruments",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "raw_content": "Compact industrial pressure transmitter with piezoresistive silicon sensor and 316L SS wetted parts. Ideal for process monitoring, hydraulic systems, and pneumatic control.",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[FEATURES_LIST]",
          "page_number": 1,
          "raw_content": "- Piezoresistive silicon sensing element\n- 316L stainless steel wetted parts and flush diaphragm\n- 4-20mA 2-wire loop-powered output\n- IP65 sealed stainless steel housing\n- <5 ms response time for dynamic applications\n- 3x rated burst pressure for overpressure protection",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "raw_content": "Technical Specifications Table",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Standard Specs",
              "rows": [
                {
                  "key": "Pressure Range",
                  "value": "0-100",
                  "unit": "PSI"
                },
                {
                  "key": "Output Signal",
                  "value": "4-20",
                  "unit": "mA"
                },
                {
                  "key": "Supply Voltage",
                  "value": "10-30",
                  "unit": "VDC"
                },
                {
                  "key": "Accuracy",
                  "value": "±0.25",
                  "unit": "%FS (BFSL)"
                },
                {
                  "key": "Process Connection",
                  "value": "1/4-18",
                  "unit": "NPT Male"
                },
                {
                  "key": "Wetted Parts Material",
                  "value": "316L SS",
                  "unit": null
                },
                {
                  "key": "Diaphragm",
                  "value": "316L SS",
                  "unit": null
                },
                {
                  "key": "Operating Temp",
                  "value": "-40 to 185",
                  "unit": "°F"
                },
                {
                  "key": "Enclosure Rating",
                  "value": "IP65",
                  "unit": null
                },
                {
                  "key": "Response Time",
                  "value": "<5",
                  "unit": "ms"
                },
                {
                  "key": "Burst Pressure",
                  "value": "300",
                  "unit": "PSI"
                },
                {
                  "key": "Electrical Connection",
                  "value": "DIN 43650 Form A",
                  "unit": null
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DIMENSIONAL_DRAWING]",
          "page_number": 1,
          "raw_content": "Dimensional References",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Dimensions",
              "rows": [
                {
                  "key": "Overall Length",
                  "value": "3.54",
                  "unit": "inches"
                },
                {
                  "key": "Hex Size",
                  "value": "27",
                  "unit": "mm"
                },
                {
                  "key": "Diaphragm Diameter",
                  "value": "0.625",
                  "unit": "inches"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        }
      ],
      "extraction_summary": {
        "sections_found": [
          "[PRODUCT_IDENTITY]",
          "[DESCRIPTION_BLOCK]",
          "[FEATURES_LIST]",
          "[SPECIFICATIONS_TABLE]",
          "[DIMENSIONAL_DRAWING]"
        ],
        "sections_missing": [
          "[CERTIFICATIONS]",
          "[WARNINGS_NOTES]"
        ],
        "ocr_noise_overall": "low",
        "extraction_quality": "high",
        "extraction_notes": "Clean document, table structure preserved."
      }
    },
    "chunking": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "total_chunks": 3,
      "chunks": [
        {
          "chunk_id": "chunk_001",
          "chunk_index": 1,
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "identity",
          "content": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output | Model: PT-100-420-SS",
          "key_value_pairs": [
            {
              "key": "Model",
              "value": "PT-100-420-SS",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 29,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "chunk_sequence": 1
          }
        },
        {
          "chunk_id": "chunk_002",
          "chunk_index": 2,
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "specs_table",
          "content": "Pressure Range: 0-100 PSI, Output Signal: 4-20 mA, Supply Voltage: 10-30 VDC, Accuracy: ±0.25 %FS (BFSL), Process Connection: 1/4-18 NPT Male, Wetted Parts Material: 316L SS , Diaphragm: 316L SS , Operating Temp: -40 to 185 °F, Enclosure Rating: IP65 , Response Time: <5 ms, Burst Pressure: 300 PSI, Electrical Connection: DIN 43650 Form A ",
          "key_value_pairs": [
            {
              "key": "Pressure Range",
              "value": "0-100",
              "unit": "PSI",
              "ocr_suspect": false
            },
            {
              "key": "Output Signal",
              "value": "4-20",
              "unit": "mA",
              "ocr_suspect": false
            },
            {
              "key": "Supply Voltage",
              "value": "10-30",
              "unit": "VDC",
              "ocr_suspect": false
            },
            {
              "key": "Accuracy",
              "value": "±0.25",
              "unit": "%FS (BFSL)",
              "ocr_suspect": false
            },
            {
              "key": "Process Connection",
              "value": "1/4-18",
              "unit": "NPT Male",
              "ocr_suspect": false
            },
            {
              "key": "Wetted Parts Material",
              "value": "316L SS",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Diaphragm",
              "value": "316L SS",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Operating Temp",
              "value": "-40 to 185",
              "unit": "°F",
              "ocr_suspect": false
            },
            {
              "key": "Enclosure Rating",
              "value": "IP65",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Response Time",
              "value": "<5",
              "unit": "ms",
              "ocr_suspect": false
            },
            {
              "key": "Burst Pressure",
              "value": "300",
              "unit": "PSI",
              "ocr_suspect": false
            },
            {
              "key": "Electrical Connection",
              "value": "DIN 43650 Form A",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 95,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "chunk_sequence": 2
          }
        },
        {
          "chunk_id": "chunk_003",
          "chunk_index": 3,
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "high_priority": false,
          "content_type": "description",
          "content": "Compact industrial pressure transmitter with piezoresistive silicon sensor and 316L SS wetted parts. Ideal for process monitoring, hydraulic systems, and pneumatic control.",
          "key_value_pairs": [],
          "token_estimate": 53,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[DESCRIPTION_BLOCK]",
            "chunk_sequence": 3
          }
        }
      ],
      "pipeline_summary": {
        "high_priority_chunks": 2,
        "identity_chunks": 1,
        "spec_chunks": 1,
        "description_chunks": 1,
        "ready_for_module_2": true,
        "blocking_issues": []
      }
    },
    "new_enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Instrumentation",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Sensors",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Pressure Transmitter",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Industrial Mount",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "9026.20",
        "description": "Pressure Transmitter for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "SensTech PT Series Industrial Pressure Transmitter, 0-100 PSI, 4-20mA, 1/4\" NPT, 316L SS Wetted Parts",
        "short_title": "0-100 PSI Pressure Transmitter 4-20mA",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "pressure transmitter 4-20mA",
          "0-100 PSI transmitter",
          "industrial pressure sensor",
          "316L pressure transmitter"
        ],
        "technical_synonyms": [
          "0-100 PSI 4-20mA pressure transmitter 1/4 NPT stainless steel",
          "loop powered pressure sensor IP65"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "cataloging": {
      "pipeline_id": "{{UUID}}",
      "commercial_catalog": {
        "short_summary": "Industrial grade Pressure Transmitter for robust operational performance.",
        "detailed_description": "This Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output provides reliable performance in industrial environments. Constructed to rigorous standards, it ensures maximum durability and operational safety. Designed with precision to meet exact flow and pressure ratings. It connects seamlessly into existing systems via standard interfaces. Suitable for a wide range of applications including fluid control and processing.",
        "bullet_features": [
          {
            "category": "Product Name",
            "spec_value": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output / Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output",
            "benefit_note": "Designed for industrial product name requirements"
          },
          {
            "category": "Model Number",
            "spec_value": "PT-100-420-SS / PT-100-420-SS",
            "benefit_note": "Designed for industrial model number requirements"
          },
          {
            "category": "Pressure Range",
            "spec_value": "0-100 / 0.0 kPa",
            "benefit_note": "Designed for industrial pressure range requirements"
          },
          {
            "category": "Output Signal",
            "spec_value": "4-20 / 4-20 mA",
            "benefit_note": "Designed for industrial output signal requirements"
          },
          {
            "category": "Supply Voltage",
            "spec_value": "10-30 / 10-30 VDC",
            "benefit_note": "Designed for industrial supply voltage requirements"
          },
          {
            "category": "Accuracy",
            "spec_value": "±0.25 / ±0.25 %FS (BFSL)",
            "benefit_note": "Designed for industrial accuracy requirements"
          }
        ],
        "compatibility_block": {
          "target_industries": [
            "Oil & Gas",
            "Chemical Processing",
            "Water Treatment"
          ],
          "compatible_media": [
            "Water",
            "Air",
            "Non-corrosive liquids"
          ],
          "mating_standards": [
            "ANSI",
            "ASME",
            "NPT"
          ],
          "not_recommended_for": [
            "Highly corrosive acids",
            "Extreme temperatures beyond rating"
          ]
        },
        "spec_summary_table": [
          {
            "attribute": "Product Name",
            "raw_value": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output",
            "standardized_value": "Industrial Pressure Transmitter 0-100 PSI, 4-20mA Output",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Model Number",
            "raw_value": "PT-100-420-SS",
            "standardized_value": "PT-100-420-SS",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Pressure Range",
            "raw_value": "0-100",
            "standardized_value": "0.0 kPa",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Output Signal",
            "raw_value": "4-20",
            "standardized_value": "4-20 mA",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Supply Voltage",
            "raw_value": "10-30",
            "standardized_value": "10-30 VDC",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Accuracy",
            "raw_value": "±0.25",
            "standardized_value": "±0.25 %FS (BFSL)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Process Connection",
            "raw_value": "1/4-18",
            "standardized_value": "1/4-18 NPT Male",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Wetted Parts Material",
            "raw_value": "316L SS",
            "standardized_value": "316L SS",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Diaphragm",
            "raw_value": "316L SS",
            "standardized_value": "316L SS",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Operating Temp",
            "raw_value": "-40 to 185",
            "standardized_value": "-40 to 185 °F",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Enclosure Rating",
            "raw_value": "IP65",
            "standardized_value": "IP65",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Response Time",
            "raw_value": "<5",
            "standardized_value": "<5 ms",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Burst Pressure",
            "raw_value": "300",
            "standardized_value": "2068.5 kPa",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Electrical Connection",
            "raw_value": "DIN 43650 Form A",
            "standardized_value": "DIN 43650 Form A",
            "inferred": false,
            "display_flag": "none"
          }
        ]
      },
      "content_quality": {
        "spec_backed_claims": 6,
        "inferred_claims": 0,
        "readability_check": "passed",
        "missing_content_warnings": []
      }
    }
  },
  {
    "keywords": [
      "solenoid",
      "solenoid valve",
      "24v",
      "normally closed",
      "nc",
      "brass",
      "coil"
    ],
    "extraction": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "extraction_timestamp": "{{TIMESTAMP}}",
      "attributes": [
        {
          "tier": "1",
          "attribute_name": "Product Name",
          "raw_value": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed",
          "raw_unit": null,
          "standardized_value": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 95,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "1/2\" Brass Solenoid "
          }
        },
        {
          "tier": "1",
          "attribute_name": "Model Number",
          "raw_value": "SV-B050-24DC-NC",
          "raw_unit": null,
          "standardized_value": "SV-B050-24DC-NC",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 98,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "SV-B050-24DC-NC"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Body Material",
          "raw_value": "Brass (CW617N)",
          "raw_unit": null,
          "standardized_value": "Brass (CW617N)",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Body Material: Brass"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Coil Voltage",
          "raw_value": "24",
          "raw_unit": "V DC",
          "standardized_value": "24",
          "standardized_unit": "V DC",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Coil Voltage: 24"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Action",
          "raw_value": "Normally Closed (NC)",
          "raw_unit": null,
          "standardized_value": "Normally Closed (NC)",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Action: Normally Clo"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Size",
          "raw_value": "1/2",
          "raw_unit": "inch",
          "standardized_value": "25.4",
          "standardized_unit": "mm",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Size: 1/2"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Seal Material",
          "raw_value": "NBR",
          "raw_unit": null,
          "standardized_value": "NBR",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Seal Material: NBR"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Max Pressure",
          "raw_value": "10",
          "raw_unit": "bar",
          "standardized_value": "10",
          "standardized_unit": "bar",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Max Pressure: 10"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Orifice Diameter",
          "raw_value": "12",
          "raw_unit": "mm",
          "standardized_value": "12",
          "standardized_unit": "mm",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Orifice Diameter: 12"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Power Consumption",
          "raw_value": "8",
          "raw_unit": "W",
          "standardized_value": "8",
          "standardized_unit": "W",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Power Consumption: 8"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Media Temperature",
          "raw_value": "-10 to +90",
          "raw_unit": "°C",
          "standardized_value": "-10 to +90",
          "standardized_unit": "°C",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Media Temperature: -"
          }
        },
        {
          "tier": "2",
          "attribute_name": "IP Rating",
          "raw_value": "IP65",
          "raw_unit": null,
          "standardized_value": "IP65",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "IP Rating: IP65"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Response Time (Opening)",
          "raw_value": "15-35",
          "raw_unit": "ms",
          "standardized_value": "15-35",
          "standardized_unit": "ms",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Response Time (Openi"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Cv Factor",
          "raw_value": "3.5",
          "raw_unit": null,
          "standardized_value": "3.5",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Cv Factor: 3.5"
          }
        }
      ],
      "extraction_summary": {
        "tier1_complete": true,
        "tier1_missing": [],
        "tier2_extracted_count": 5,
        "tier3_extracted_count": 2,
        "total_attributes_extracted": 14,
        "inferred_attributes_count": 0,
        "conflicts_detected": [],
        "review_required_attributes": []
      },
      "product_identification": {
        "raw_title": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed",
        "model_number": "SV-B050-24DC-NC",
        "part_number": "SV050-24VDC-NC-NBR",
        "manufacturer": "FlowMaster Controls",
        "series_or_family": "SV Series",
        "country_of_origin": "Italy"
      }
    },
    "enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Fluid Control",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Valves",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Solenoid Valve",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Standard Body",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "8481.80",
        "description": "Solenoid Valve for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "1/2\" Brass 2/2-Way Direct-Acting Solenoid Valve, 24V DC, Normally Closed, NBR Seals, IP65",
        "short_title": "1/2\" Brass Solenoid Valve 24VDC NC",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "solenoid valve 24V DC",
          "1/2 inch solenoid valve",
          "brass solenoid valve normally closed",
          "direct acting solenoid valve"
        ],
        "technical_synonyms": [
          "1/2 BSP brass solenoid valve 24VDC normally closed IP65",
          "2/2 way direct acting solenoid 10 bar"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "preprocessing": {
      "source_file": "{{FILENAME}}",
      "document_type": "{{DOC_TYPE}}",
      "total_pages_processed": 1,
      "sections": [
        {
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "raw_content": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed\nModel: SV-B050-24DC-NC\nPN: SV050-24VDC-NC-NBR\nManufacturer: FlowMaster Controls",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "raw_content": "Direct-acting 2/2-way brass solenoid valve for water, air, and light oil service. Compact design with IP65 rated coil suitable for industrial automation.",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[FEATURES_LIST]",
          "page_number": 1,
          "raw_content": "- Direct-acting operation — no minimum pressure differential required\n- Forged brass CW617N body for durability\n- NBR (Buna-N) seals standard, FKM (Viton) optional\n- IP65 encapsulated coil with DIN 43650 connector\n- Manual override for testing and commissioning\n- MTTF > 10 million cycles",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "raw_content": "Technical Specifications Table",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Standard Specs",
              "rows": [
                {
                  "key": "Body Material",
                  "value": "Brass (CW617N)",
                  "unit": null
                },
                {
                  "key": "Coil Voltage",
                  "value": "24",
                  "unit": "V DC"
                },
                {
                  "key": "Action",
                  "value": "Normally Closed (NC)",
                  "unit": null
                },
                {
                  "key": "Size",
                  "value": "1/2",
                  "unit": "inch"
                },
                {
                  "key": "Seal Material",
                  "value": "NBR",
                  "unit": null
                },
                {
                  "key": "Max Pressure",
                  "value": "10",
                  "unit": "bar"
                },
                {
                  "key": "Orifice Diameter",
                  "value": "12",
                  "unit": "mm"
                },
                {
                  "key": "Power Consumption",
                  "value": "8",
                  "unit": "W"
                },
                {
                  "key": "Media Temperature",
                  "value": "-10 to +90",
                  "unit": "°C"
                },
                {
                  "key": "IP Rating",
                  "value": "IP65",
                  "unit": null
                },
                {
                  "key": "Response Time (Opening)",
                  "value": "15-35",
                  "unit": "ms"
                },
                {
                  "key": "Cv Factor",
                  "value": "3.5",
                  "unit": null
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DIMENSIONAL_DRAWING]",
          "page_number": 1,
          "raw_content": "Dimensional References",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Dimensions",
              "rows": [
                {
                  "key": "Overall Height",
                  "value": "95",
                  "unit": "mm"
                },
                {
                  "key": "Body Length",
                  "value": "72",
                  "unit": "mm"
                },
                {
                  "key": "Orifice",
                  "value": "12",
                  "unit": "mm"
                },
                {
                  "key": "Port Thread",
                  "value": "G1/2\"",
                  "unit": "BSP"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        }
      ],
      "extraction_summary": {
        "sections_found": [
          "[PRODUCT_IDENTITY]",
          "[DESCRIPTION_BLOCK]",
          "[FEATURES_LIST]",
          "[SPECIFICATIONS_TABLE]",
          "[DIMENSIONAL_DRAWING]"
        ],
        "sections_missing": [
          "[CERTIFICATIONS]",
          "[WARNINGS_NOTES]"
        ],
        "ocr_noise_overall": "low",
        "extraction_quality": "high",
        "extraction_notes": "Clean document, table structure preserved."
      }
    },
    "chunking": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "total_chunks": 3,
      "chunks": [
        {
          "chunk_id": "chunk_001",
          "chunk_index": 1,
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "identity",
          "content": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed | Model: SV-B050-24DC-NC",
          "key_value_pairs": [
            {
              "key": "Model",
              "value": "SV-B050-24DC-NC",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 28,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "chunk_sequence": 1
          }
        },
        {
          "chunk_id": "chunk_002",
          "chunk_index": 2,
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "specs_table",
          "content": "Body Material: Brass (CW617N) , Coil Voltage: 24 V DC, Action: Normally Closed (NC) , Size: 1/2 inch, Seal Material: NBR , Max Pressure: 10 bar, Orifice Diameter: 12 mm, Power Consumption: 8 W, Media Temperature: -10 to +90 °C, IP Rating: IP65 , Response Time (Opening): 15-35 ms, Cv Factor: 3.5 ",
          "key_value_pairs": [
            {
              "key": "Body Material",
              "value": "Brass (CW617N)",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Coil Voltage",
              "value": "24",
              "unit": "V DC",
              "ocr_suspect": false
            },
            {
              "key": "Action",
              "value": "Normally Closed (NC)",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Size",
              "value": "1/2",
              "unit": "inch",
              "ocr_suspect": false
            },
            {
              "key": "Seal Material",
              "value": "NBR",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Max Pressure",
              "value": "10",
              "unit": "bar",
              "ocr_suspect": false
            },
            {
              "key": "Orifice Diameter",
              "value": "12",
              "unit": "mm",
              "ocr_suspect": false
            },
            {
              "key": "Power Consumption",
              "value": "8",
              "unit": "W",
              "ocr_suspect": false
            },
            {
              "key": "Media Temperature",
              "value": "-10 to +90",
              "unit": "°C",
              "ocr_suspect": false
            },
            {
              "key": "IP Rating",
              "value": "IP65",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Response Time (Opening)",
              "value": "15-35",
              "unit": "ms",
              "ocr_suspect": false
            },
            {
              "key": "Cv Factor",
              "value": "3.5",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 84,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "chunk_sequence": 2
          }
        },
        {
          "chunk_id": "chunk_003",
          "chunk_index": 3,
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "high_priority": false,
          "content_type": "description",
          "content": "Direct-acting 2/2-way brass solenoid valve for water, air, and light oil service. Compact design with IP65 rated coil suitable for industrial automation.",
          "key_value_pairs": [],
          "token_estimate": 48,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[DESCRIPTION_BLOCK]",
            "chunk_sequence": 3
          }
        }
      ],
      "pipeline_summary": {
        "high_priority_chunks": 2,
        "identity_chunks": 1,
        "spec_chunks": 1,
        "description_chunks": 1,
        "ready_for_module_2": true,
        "blocking_issues": []
      }
    },
    "new_enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Fluid Control",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Valves",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Solenoid Valve",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Standard Body",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "8481.80",
        "description": "Solenoid Valve for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "1/2\" Brass 2/2-Way Direct-Acting Solenoid Valve, 24V DC, Normally Closed, NBR Seals, IP65",
        "short_title": "1/2\" Brass Solenoid Valve 24VDC NC",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "solenoid valve 24V DC",
          "1/2 inch solenoid valve",
          "brass solenoid valve normally closed",
          "direct acting solenoid valve"
        ],
        "technical_synonyms": [
          "1/2 BSP brass solenoid valve 24VDC normally closed IP65",
          "2/2 way direct acting solenoid 10 bar"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "cataloging": {
      "pipeline_id": "{{UUID}}",
      "commercial_catalog": {
        "short_summary": "Industrial grade Solenoid Valve for robust operational performance.",
        "detailed_description": "This 1/2\" Brass Solenoid Valve, 24V DC, Normally Closed provides reliable performance in industrial environments. Constructed to rigorous standards, it ensures maximum durability and operational safety. Designed with precision to meet exact flow and pressure ratings. It connects seamlessly into existing systems via standard interfaces. Suitable for a wide range of applications including fluid control and processing.",
        "bullet_features": [
          {
            "category": "Product Name",
            "spec_value": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed / 1/2\" Brass Solenoid Valve, 24V DC, Normally Closed",
            "benefit_note": "Designed for industrial product name requirements"
          },
          {
            "category": "Model Number",
            "spec_value": "SV-B050-24DC-NC / SV-B050-24DC-NC",
            "benefit_note": "Designed for industrial model number requirements"
          },
          {
            "category": "Body Material",
            "spec_value": "Brass (CW617N) / Brass (CW617N)",
            "benefit_note": "Designed for industrial body material requirements"
          },
          {
            "category": "Coil Voltage",
            "spec_value": "24 / 24 V DC",
            "benefit_note": "Designed for industrial coil voltage requirements"
          },
          {
            "category": "Action",
            "spec_value": "Normally Closed (NC) / Normally Closed (NC)",
            "benefit_note": "Designed for industrial action requirements"
          },
          {
            "category": "Size",
            "spec_value": "1/2 / 25.4 mm",
            "benefit_note": "Designed for industrial size requirements"
          }
        ],
        "compatibility_block": {
          "target_industries": [
            "Oil & Gas",
            "Chemical Processing",
            "Water Treatment"
          ],
          "compatible_media": [
            "Water",
            "Air",
            "Non-corrosive liquids"
          ],
          "mating_standards": [
            "ANSI",
            "ASME",
            "NPT"
          ],
          "not_recommended_for": [
            "Highly corrosive acids",
            "Extreme temperatures beyond rating"
          ]
        },
        "spec_summary_table": [
          {
            "attribute": "Product Name",
            "raw_value": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed",
            "standardized_value": "1/2\" Brass Solenoid Valve, 24V DC, Normally Closed",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Model Number",
            "raw_value": "SV-B050-24DC-NC",
            "standardized_value": "SV-B050-24DC-NC",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Body Material",
            "raw_value": "Brass (CW617N)",
            "standardized_value": "Brass (CW617N)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Coil Voltage",
            "raw_value": "24",
            "standardized_value": "24 V DC",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Action",
            "raw_value": "Normally Closed (NC)",
            "standardized_value": "Normally Closed (NC)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Size",
            "raw_value": "1/2",
            "standardized_value": "25.4 mm",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Seal Material",
            "raw_value": "NBR",
            "standardized_value": "NBR",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Max Pressure",
            "raw_value": "10",
            "standardized_value": "10 bar",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Orifice Diameter",
            "raw_value": "12",
            "standardized_value": "12 mm",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Power Consumption",
            "raw_value": "8",
            "standardized_value": "8 W",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Media Temperature",
            "raw_value": "-10 to +90",
            "standardized_value": "-10 to +90 °C",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "IP Rating",
            "raw_value": "IP65",
            "standardized_value": "IP65",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Response Time (Opening)",
            "raw_value": "15-35",
            "standardized_value": "15-35 ms",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Cv Factor",
            "raw_value": "3.5",
            "standardized_value": "3.5",
            "inferred": false,
            "display_flag": "none"
          }
        ]
      },
      "content_quality": {
        "spec_backed_claims": 6,
        "inferred_claims": 0,
        "readability_check": "passed",
        "missing_content_warnings": []
      }
    }
  },
  {
    "keywords": [
      "pipe fitting",
      "elbow",
      "90",
      "ss304",
      "ss 304",
      "threaded",
      "fitting",
      "150 class",
      "class 150"
    ],
    "extraction": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "extraction_timestamp": "{{TIMESTAMP}}",
      "attributes": [
        {
          "tier": "1",
          "attribute_name": "Product Name",
          "raw_value": "3/4\" SS304 90° Threaded Elbow, Class 150",
          "raw_unit": null,
          "standardized_value": "3/4\" SS304 90° Threaded Elbow, Class 150",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 95,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "3/4\" SS304 90° Threa"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Model Number",
          "raw_value": "ELB-90-075-304-150",
          "raw_unit": null,
          "standardized_value": "ELB-90-075-304-150",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 98,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "ELB-90-075-304-150"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Material",
          "raw_value": "ASTM A351 CF8 (SS304)",
          "raw_unit": null,
          "standardized_value": "ASTM A351 CF8 (SS304)",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Material: ASTM A351 "
          }
        },
        {
          "tier": "1",
          "attribute_name": "Angle",
          "raw_value": "90",
          "raw_unit": "°",
          "standardized_value": "90",
          "standardized_unit": "°",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Angle: 90"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Size",
          "raw_value": "3/4",
          "raw_unit": "inch",
          "standardized_value": "76.2",
          "standardized_unit": "mm",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Size: 3/4"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Class",
          "raw_value": "150",
          "raw_unit": "#",
          "standardized_value": "150",
          "standardized_unit": "#",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Class: 150"
          }
        },
        {
          "tier": "1",
          "attribute_name": "End Type",
          "raw_value": "NPT Female (FxF)",
          "raw_unit": null,
          "standardized_value": "NPT Female (FxF)",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "End Type: NPT Female"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Max Working Pressure",
          "raw_value": "300",
          "raw_unit": "PSI @ 100°F",
          "standardized_value": "300",
          "standardized_unit": "PSI @ 100°F",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Max Working Pressure"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Casting Method",
          "raw_value": "Investment Cast",
          "raw_unit": null,
          "standardized_value": "Investment Cast",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Casting Method: Inve"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Weight",
          "raw_value": "0.30",
          "raw_unit": "lbs",
          "standardized_value": "0.30",
          "standardized_unit": "lbs",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Weight: 0.30"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Wall Schedule",
          "raw_value": "SCH 40 equivalent",
          "raw_unit": null,
          "standardized_value": "SCH 40 equivalent",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Wall Schedule: SCH 4"
          }
        }
      ],
      "extraction_summary": {
        "tier1_complete": true,
        "tier1_missing": [],
        "tier2_extracted_count": 4,
        "tier3_extracted_count": 0,
        "total_attributes_extracted": 11,
        "inferred_attributes_count": 0,
        "conflicts_detected": [],
        "review_required_attributes": []
      },
      "product_identification": {
        "raw_title": "3/4\" SS304 90° Threaded Elbow, Class 150",
        "model_number": "ELB-90-075-304-150",
        "part_number": "E90-075-304-NPT",
        "manufacturer": "FitRight Industrial",
        "series_or_family": "150# Threaded Fittings",
        "country_of_origin": "India"
      }
    },
    "enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Fluid Control",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Pipes & Fittings",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Elbow Fitting",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "90 Degree Threaded",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "7307.22",
        "description": "Elbow Fitting for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "3/4\" SS304 (CF8) 90° Threaded Elbow, Class 150, Investment Cast — ASME B16.11",
        "short_title": "3/4\" SS304 90° Elbow Cl.150",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "3/4 inch 90 degree elbow",
          "SS304 threaded elbow",
          "stainless steel pipe fitting 150 class",
          "CF8 elbow ASME B16.11"
        ],
        "technical_synonyms": [
          "3/4 NPT 90 degree stainless steel elbow class 150 investment cast",
          "ASTM A351 CF8 threaded fitting"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "preprocessing": {
      "source_file": "{{FILENAME}}",
      "document_type": "{{DOC_TYPE}}",
      "total_pages_processed": 1,
      "sections": [
        {
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "raw_content": "3/4\" SS304 90° Threaded Elbow, Class 150\nModel: ELB-90-075-304-150\nPN: E90-075-304-NPT\nManufacturer: FitRight Industrial",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "raw_content": "Investment cast stainless steel 304 threaded 90° elbow for general industrial piping systems. Class 150 rated.",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[FEATURES_LIST]",
          "page_number": 1,
          "raw_content": "- Investment cast CF8 (SS304) body\n- NPT threads per ASME B1.20.1\n- Class 150 pressure rating\n- Full MTR (Mill Test Report) available",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "raw_content": "Technical Specifications Table",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Standard Specs",
              "rows": [
                {
                  "key": "Material",
                  "value": "ASTM A351 CF8 (SS304)",
                  "unit": null
                },
                {
                  "key": "Angle",
                  "value": "90",
                  "unit": "°"
                },
                {
                  "key": "Size",
                  "value": "3/4",
                  "unit": "inch"
                },
                {
                  "key": "Class",
                  "value": "150",
                  "unit": "#"
                },
                {
                  "key": "End Type",
                  "value": "NPT Female (FxF)",
                  "unit": null
                },
                {
                  "key": "Max Working Pressure",
                  "value": "300",
                  "unit": "PSI @ 100°F"
                },
                {
                  "key": "Casting Method",
                  "value": "Investment Cast",
                  "unit": null
                },
                {
                  "key": "Weight",
                  "value": "0.30",
                  "unit": "lbs"
                },
                {
                  "key": "Wall Schedule",
                  "value": "SCH 40 equivalent",
                  "unit": null
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DIMENSIONAL_DRAWING]",
          "page_number": 1,
          "raw_content": "Dimensional References",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Dimensions",
              "rows": [
                {
                  "key": "Center-to-End (C)",
                  "value": "1.50",
                  "unit": "inches"
                },
                {
                  "key": "Bore ID",
                  "value": "0.824",
                  "unit": "inches"
                },
                {
                  "key": "Thread Length",
                  "value": "0.675",
                  "unit": "inches"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        }
      ],
      "extraction_summary": {
        "sections_found": [
          "[PRODUCT_IDENTITY]",
          "[DESCRIPTION_BLOCK]",
          "[FEATURES_LIST]",
          "[SPECIFICATIONS_TABLE]",
          "[DIMENSIONAL_DRAWING]"
        ],
        "sections_missing": [
          "[CERTIFICATIONS]",
          "[WARNINGS_NOTES]"
        ],
        "ocr_noise_overall": "low",
        "extraction_quality": "high",
        "extraction_notes": "Clean document, table structure preserved."
      }
    },
    "chunking": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "total_chunks": 3,
      "chunks": [
        {
          "chunk_id": "chunk_001",
          "chunk_index": 1,
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "identity",
          "content": "3/4\" SS304 90° Threaded Elbow, Class 150 | Model: ELB-90-075-304-150",
          "key_value_pairs": [
            {
              "key": "Model",
              "value": "ELB-90-075-304-150",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 27,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "chunk_sequence": 1
          }
        },
        {
          "chunk_id": "chunk_002",
          "chunk_index": 2,
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "specs_table",
          "content": "Material: ASTM A351 CF8 (SS304) , Angle: 90 °, Size: 3/4 inch, Class: 150 #, End Type: NPT Female (FxF) , Max Working Pressure: 300 PSI @ 100°F, Casting Method: Investment Cast , Weight: 0.30 lbs, Wall Schedule: SCH 40 equivalent ",
          "key_value_pairs": [
            {
              "key": "Material",
              "value": "ASTM A351 CF8 (SS304)",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Angle",
              "value": "90",
              "unit": "°",
              "ocr_suspect": false
            },
            {
              "key": "Size",
              "value": "3/4",
              "unit": "inch",
              "ocr_suspect": false
            },
            {
              "key": "Class",
              "value": "150",
              "unit": "#",
              "ocr_suspect": false
            },
            {
              "key": "End Type",
              "value": "NPT Female (FxF)",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Max Working Pressure",
              "value": "300",
              "unit": "PSI @ 100°F",
              "ocr_suspect": false
            },
            {
              "key": "Casting Method",
              "value": "Investment Cast",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Weight",
              "value": "0.30",
              "unit": "lbs",
              "ocr_suspect": false
            },
            {
              "key": "Wall Schedule",
              "value": "SCH 40 equivalent",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 67,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "chunk_sequence": 2
          }
        },
        {
          "chunk_id": "chunk_003",
          "chunk_index": 3,
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "high_priority": false,
          "content_type": "description",
          "content": "Investment cast stainless steel 304 threaded 90° elbow for general industrial piping systems. Class 150 rated.",
          "key_value_pairs": [],
          "token_estimate": 37,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[DESCRIPTION_BLOCK]",
            "chunk_sequence": 3
          }
        }
      ],
      "pipeline_summary": {
        "high_priority_chunks": 2,
        "identity_chunks": 1,
        "spec_chunks": 1,
        "description_chunks": 1,
        "ready_for_module_2": true,
        "blocking_issues": []
      }
    },
    "new_enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Fluid Control",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Pipes & Fittings",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Elbow Fitting",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "90 Degree Threaded",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "7307.22",
        "description": "Elbow Fitting for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "3/4\" SS304 (CF8) 90° Threaded Elbow, Class 150, Investment Cast — ASME B16.11",
        "short_title": "3/4\" SS304 90° Elbow Cl.150",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "3/4 inch 90 degree elbow",
          "SS304 threaded elbow",
          "stainless steel pipe fitting 150 class",
          "CF8 elbow ASME B16.11"
        ],
        "technical_synonyms": [
          "3/4 NPT 90 degree stainless steel elbow class 150 investment cast",
          "ASTM A351 CF8 threaded fitting"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "cataloging": {
      "pipeline_id": "{{UUID}}",
      "commercial_catalog": {
        "short_summary": "Industrial grade Elbow Fitting for robust operational performance.",
        "detailed_description": "This 3/4\" SS304 90° Threaded Elbow, Class 150 provides reliable performance in industrial environments. Constructed to rigorous standards, it ensures maximum durability and operational safety. Designed with precision to meet exact flow and pressure ratings. It connects seamlessly into existing systems via standard interfaces. Suitable for a wide range of applications including fluid control and processing.",
        "bullet_features": [
          {
            "category": "Product Name",
            "spec_value": "3/4\" SS304 90° Threaded Elbow, Class 150 / 3/4\" SS304 90° Threaded Elbow, Class 150",
            "benefit_note": "Designed for industrial product name requirements"
          },
          {
            "category": "Model Number",
            "spec_value": "ELB-90-075-304-150 / ELB-90-075-304-150",
            "benefit_note": "Designed for industrial model number requirements"
          },
          {
            "category": "Material",
            "spec_value": "ASTM A351 CF8 (SS304) / ASTM A351 CF8 (SS304)",
            "benefit_note": "Designed for industrial material requirements"
          },
          {
            "category": "Angle",
            "spec_value": "90 / 90 °",
            "benefit_note": "Designed for industrial angle requirements"
          },
          {
            "category": "Size",
            "spec_value": "3/4 / 76.2 mm",
            "benefit_note": "Designed for industrial size requirements"
          },
          {
            "category": "Class",
            "spec_value": "150 / 150 #",
            "benefit_note": "Designed for industrial class requirements"
          }
        ],
        "compatibility_block": {
          "target_industries": [
            "Oil & Gas",
            "Chemical Processing",
            "Water Treatment"
          ],
          "compatible_media": [
            "Water",
            "Air",
            "Non-corrosive liquids"
          ],
          "mating_standards": [
            "ANSI",
            "ASME",
            "NPT"
          ],
          "not_recommended_for": [
            "Highly corrosive acids",
            "Extreme temperatures beyond rating"
          ]
        },
        "spec_summary_table": [
          {
            "attribute": "Product Name",
            "raw_value": "3/4\" SS304 90° Threaded Elbow, Class 150",
            "standardized_value": "3/4\" SS304 90° Threaded Elbow, Class 150",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Model Number",
            "raw_value": "ELB-90-075-304-150",
            "standardized_value": "ELB-90-075-304-150",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Material",
            "raw_value": "ASTM A351 CF8 (SS304)",
            "standardized_value": "ASTM A351 CF8 (SS304)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Angle",
            "raw_value": "90",
            "standardized_value": "90 °",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Size",
            "raw_value": "3/4",
            "standardized_value": "76.2 mm",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Class",
            "raw_value": "150",
            "standardized_value": "150 #",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "End Type",
            "raw_value": "NPT Female (FxF)",
            "standardized_value": "NPT Female (FxF)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Max Working Pressure",
            "raw_value": "300",
            "standardized_value": "300 PSI @ 100°F",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Casting Method",
            "raw_value": "Investment Cast",
            "standardized_value": "Investment Cast",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Weight",
            "raw_value": "0.30",
            "standardized_value": "0.30 lbs",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Wall Schedule",
            "raw_value": "SCH 40 equivalent",
            "standardized_value": "SCH 40 equivalent",
            "inferred": false,
            "display_flag": "none"
          }
        ]
      },
      "content_quality": {
        "spec_backed_claims": 6,
        "inferred_claims": 0,
        "readability_check": "passed",
        "missing_content_warnings": []
      }
    }
  },
  {
    "keywords": [
      "vfd",
      "variable frequency",
      "motor drive",
      "drive",
      "5hp",
      "5 hp",
      "480v",
      "inverter",
      "frequency drive"
    ],
    "extraction": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "extraction_timestamp": "{{TIMESTAMP}}",
      "attributes": [
        {
          "tier": "1",
          "attribute_name": "Product Name",
          "raw_value": "5HP Variable Frequency Drive, 480V 3-Phase",
          "raw_unit": null,
          "standardized_value": "5HP Variable Frequency Drive, 480V 3-Phase",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 95,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "5HP Variable Frequen"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Model Number",
          "raw_value": "VFD-5HP-480-3P",
          "raw_unit": null,
          "standardized_value": "VFD-5HP-480-3P",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 98,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "VFD-5HP-480-3P"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Motor Rating",
          "raw_value": "5",
          "raw_unit": "HP",
          "standardized_value": "5",
          "standardized_unit": "HP",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Motor Rating: 5"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Input Voltage",
          "raw_value": "380-480",
          "raw_unit": "V AC",
          "standardized_value": "380-480",
          "standardized_unit": "V AC",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Input Voltage: 380-4"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Input Frequency",
          "raw_value": "50/60",
          "raw_unit": "Hz",
          "standardized_value": "50/60",
          "standardized_unit": "Hz",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Input Frequency: 50/"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Output Frequency Range",
          "raw_value": "0-400",
          "raw_unit": "Hz",
          "standardized_value": "0-400",
          "standardized_unit": "Hz",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Output Frequency Ran"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Output Current (CT)",
          "raw_value": "10.5",
          "raw_unit": "A",
          "standardized_value": "10.5",
          "standardized_unit": "A",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Output Current (CT):"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Enclosure",
          "raw_value": "NEMA 1 / IP21",
          "raw_unit": null,
          "standardized_value": "NEMA 1 / IP21",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Enclosure: NEMA 1 / "
          }
        },
        {
          "tier": "2",
          "attribute_name": "Communication",
          "raw_value": "Modbus RTU (RS-485)",
          "raw_unit": null,
          "standardized_value": "Modbus RTU (RS-485)",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Communication: Modbu"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Control Method",
          "raw_value": "V/f, Sensorless Vector, FOC",
          "raw_unit": null,
          "standardized_value": "V/f, Sensorless Vector, FOC",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Control Method: V/f,"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Overload Capacity",
          "raw_value": "150% for 60s",
          "raw_unit": null,
          "standardized_value": "150% for 60s",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Overload Capacity: 1"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Ambient Temperature",
          "raw_value": "-10 to 50",
          "raw_unit": "°C",
          "standardized_value": "-10 to 50",
          "standardized_unit": "°C",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Ambient Temperature:"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Digital Inputs",
          "raw_value": "6",
          "raw_unit": null,
          "standardized_value": "6",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Digital Inputs: 6"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Analog Inputs",
          "raw_value": "2 (0-10V / 4-20mA)",
          "raw_unit": null,
          "standardized_value": "2 (0-10V / 4-20mA)",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Analog Inputs: 2 (0-"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Built-in Braking Transistor",
          "raw_value": "Yes",
          "raw_unit": null,
          "standardized_value": "Yes",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Built-in Braking Tra"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Weight",
          "raw_value": "6.2",
          "raw_unit": "kg",
          "standardized_value": "6.2",
          "standardized_unit": "kg",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Weight: 6.2"
          }
        }
      ],
      "extraction_summary": {
        "tier1_complete": true,
        "tier1_missing": [],
        "tier2_extracted_count": 5,
        "tier3_extracted_count": 4,
        "total_attributes_extracted": 16,
        "inferred_attributes_count": 0,
        "conflicts_detected": [],
        "review_required_attributes": []
      },
      "product_identification": {
        "raw_title": "5HP Variable Frequency Drive, 480V 3-Phase",
        "model_number": "VFD-5HP-480-3P",
        "part_number": "ED-5R0-480-N1",
        "manufacturer": "DriveTech Automation",
        "series_or_family": "EcoDrive Series",
        "country_of_origin": "China"
      }
    },
    "enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Electrical Components",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Motors & Drives",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Variable Frequency Drive",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "3-Phase NEMA",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "8504.40",
        "description": "Variable Frequency Drive for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "DriveTech EcoDrive 5HP (3.7kW) Variable Frequency Drive, 480V 3-Phase, NEMA 1, Modbus RTU",
        "short_title": "5HP 480V VFD — EcoDrive",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "5HP VFD",
          "variable frequency drive 480V",
          "motor drive 5 HP 3 phase",
          "AC drive inverter 3.7kW"
        ],
        "technical_synonyms": [
          "5HP 480V variable frequency drive NEMA 1 Modbus",
          "3.7kW VFD sensorless vector control UL listed"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "preprocessing": {
      "source_file": "{{FILENAME}}",
      "document_type": "{{DOC_TYPE}}",
      "total_pages_processed": 1,
      "sections": [
        {
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "raw_content": "5HP Variable Frequency Drive, 480V 3-Phase\nModel: VFD-5HP-480-3P\nPN: ED-5R0-480-N1\nManufacturer: DriveTech Automation",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "raw_content": "Compact variable frequency drive for 5HP 3-phase AC induction motors. Features sensorless vector control, built-in Modbus RTU, and integrated braking transistor for industrial and HVAC applications.",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[FEATURES_LIST]",
          "page_number": 1,
          "raw_content": "- V/f, Sensorless Vector, and Field-Oriented Control modes\n- Built-in Modbus RTU RS-485 communication\n- Integrated braking transistor for dynamic braking\n- 6 programmable digital inputs + 2 analog inputs\n- Keypad with LED display and parameter copy function\n- Auto-tuning for motor parameters\n- PID controller built-in for closed-loop applications",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "raw_content": "Technical Specifications Table",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Standard Specs",
              "rows": [
                {
                  "key": "Motor Rating",
                  "value": "5",
                  "unit": "HP"
                },
                {
                  "key": "Input Voltage",
                  "value": "380-480",
                  "unit": "V AC"
                },
                {
                  "key": "Input Frequency",
                  "value": "50/60",
                  "unit": "Hz"
                },
                {
                  "key": "Output Frequency Range",
                  "value": "0-400",
                  "unit": "Hz"
                },
                {
                  "key": "Output Current (CT)",
                  "value": "10.5",
                  "unit": "A"
                },
                {
                  "key": "Enclosure",
                  "value": "NEMA 1 / IP21",
                  "unit": null
                },
                {
                  "key": "Communication",
                  "value": "Modbus RTU (RS-485)",
                  "unit": null
                },
                {
                  "key": "Control Method",
                  "value": "V/f, Sensorless Vector, FOC",
                  "unit": null
                },
                {
                  "key": "Overload Capacity",
                  "value": "150% for 60s",
                  "unit": null
                },
                {
                  "key": "Ambient Temperature",
                  "value": "-10 to 50",
                  "unit": "°C"
                },
                {
                  "key": "Digital Inputs",
                  "value": "6",
                  "unit": null
                },
                {
                  "key": "Analog Inputs",
                  "value": "2 (0-10V / 4-20mA)",
                  "unit": null
                },
                {
                  "key": "Built-in Braking Transistor",
                  "value": "Yes",
                  "unit": null
                },
                {
                  "key": "Weight",
                  "value": "6.2",
                  "unit": "kg"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DIMENSIONAL_DRAWING]",
          "page_number": 1,
          "raw_content": "Dimensional References",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Dimensions",
              "rows": [
                {
                  "key": "Height",
                  "value": "320",
                  "unit": "mm"
                },
                {
                  "key": "Width",
                  "value": "175",
                  "unit": "mm"
                },
                {
                  "key": "Depth",
                  "value": "185",
                  "unit": "mm"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        }
      ],
      "extraction_summary": {
        "sections_found": [
          "[PRODUCT_IDENTITY]",
          "[DESCRIPTION_BLOCK]",
          "[FEATURES_LIST]",
          "[SPECIFICATIONS_TABLE]",
          "[DIMENSIONAL_DRAWING]"
        ],
        "sections_missing": [
          "[CERTIFICATIONS]",
          "[WARNINGS_NOTES]"
        ],
        "ocr_noise_overall": "low",
        "extraction_quality": "high",
        "extraction_notes": "Clean document, table structure preserved."
      }
    },
    "chunking": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "total_chunks": 3,
      "chunks": [
        {
          "chunk_id": "chunk_001",
          "chunk_index": 1,
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "identity",
          "content": "5HP Variable Frequency Drive, 480V 3-Phase | Model: VFD-5HP-480-3P",
          "key_value_pairs": [
            {
              "key": "Model",
              "value": "VFD-5HP-480-3P",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 26,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "chunk_sequence": 1
          }
        },
        {
          "chunk_id": "chunk_002",
          "chunk_index": 2,
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "specs_table",
          "content": "Motor Rating: 5 HP, Input Voltage: 380-480 V AC, Input Frequency: 50/60 Hz, Output Frequency Range: 0-400 Hz, Output Current (CT): 10.5 A, Enclosure: NEMA 1 / IP21 , Communication: Modbus RTU (RS-485) , Control Method: V/f, Sensorless Vector, FOC , Overload Capacity: 150% for 60s , Ambient Temperature: -10 to 50 °C, Digital Inputs: 6 , Analog Inputs: 2 (0-10V / 4-20mA) , Built-in Braking Transistor: Yes , Weight: 6.2 kg",
          "key_value_pairs": [
            {
              "key": "Motor Rating",
              "value": "5",
              "unit": "HP",
              "ocr_suspect": false
            },
            {
              "key": "Input Voltage",
              "value": "380-480",
              "unit": "V AC",
              "ocr_suspect": false
            },
            {
              "key": "Input Frequency",
              "value": "50/60",
              "unit": "Hz",
              "ocr_suspect": false
            },
            {
              "key": "Output Frequency Range",
              "value": "0-400",
              "unit": "Hz",
              "ocr_suspect": false
            },
            {
              "key": "Output Current (CT)",
              "value": "10.5",
              "unit": "A",
              "ocr_suspect": false
            },
            {
              "key": "Enclosure",
              "value": "NEMA 1 / IP21",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Communication",
              "value": "Modbus RTU (RS-485)",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Control Method",
              "value": "V/f, Sensorless Vector, FOC",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Overload Capacity",
              "value": "150% for 60s",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Ambient Temperature",
              "value": "-10 to 50",
              "unit": "°C",
              "ocr_suspect": false
            },
            {
              "key": "Digital Inputs",
              "value": "6",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Analog Inputs",
              "value": "2 (0-10V / 4-20mA)",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Built-in Braking Transistor",
              "value": "Yes",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Weight",
              "value": "6.2",
              "unit": "kg",
              "ocr_suspect": false
            }
          ],
          "token_estimate": 115,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "chunk_sequence": 2
          }
        },
        {
          "chunk_id": "chunk_003",
          "chunk_index": 3,
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "high_priority": false,
          "content_type": "description",
          "content": "Compact variable frequency drive for 5HP 3-phase AC induction motors. Features sensorless vector control, built-in Modbus RTU, and integrated braking transistor for industrial and HVAC applications.",
          "key_value_pairs": [],
          "token_estimate": 59,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[DESCRIPTION_BLOCK]",
            "chunk_sequence": 3
          }
        }
      ],
      "pipeline_summary": {
        "high_priority_chunks": 2,
        "identity_chunks": 1,
        "spec_chunks": 1,
        "description_chunks": 1,
        "ready_for_module_2": true,
        "blocking_issues": []
      }
    },
    "new_enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Electrical Components",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Motors & Drives",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Variable Frequency Drive",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "3-Phase NEMA",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "8504.40",
        "description": "Variable Frequency Drive for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "DriveTech EcoDrive 5HP (3.7kW) Variable Frequency Drive, 480V 3-Phase, NEMA 1, Modbus RTU",
        "short_title": "5HP 480V VFD — EcoDrive",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "5HP VFD",
          "variable frequency drive 480V",
          "motor drive 5 HP 3 phase",
          "AC drive inverter 3.7kW"
        ],
        "technical_synonyms": [
          "5HP 480V variable frequency drive NEMA 1 Modbus",
          "3.7kW VFD sensorless vector control UL listed"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "cataloging": {
      "pipeline_id": "{{UUID}}",
      "commercial_catalog": {
        "short_summary": "Industrial grade Variable Frequency Drive for robust operational performance.",
        "detailed_description": "This 5HP Variable Frequency Drive, 480V 3-Phase provides reliable performance in industrial environments. Constructed to rigorous standards, it ensures maximum durability and operational safety. Designed with precision to meet exact flow and pressure ratings. It connects seamlessly into existing systems via standard interfaces. Suitable for a wide range of applications including fluid control and processing.",
        "bullet_features": [
          {
            "category": "Product Name",
            "spec_value": "5HP Variable Frequency Drive, 480V 3-Phase / 5HP Variable Frequency Drive, 480V 3-Phase",
            "benefit_note": "Designed for industrial product name requirements"
          },
          {
            "category": "Model Number",
            "spec_value": "VFD-5HP-480-3P / VFD-5HP-480-3P",
            "benefit_note": "Designed for industrial model number requirements"
          },
          {
            "category": "Motor Rating",
            "spec_value": "5 / 5 HP",
            "benefit_note": "Designed for industrial motor rating requirements"
          },
          {
            "category": "Input Voltage",
            "spec_value": "380-480 / 380-480 V AC",
            "benefit_note": "Designed for industrial input voltage requirements"
          },
          {
            "category": "Input Frequency",
            "spec_value": "50/60 / 50/60 Hz",
            "benefit_note": "Designed for industrial input frequency requirements"
          },
          {
            "category": "Output Frequency Range",
            "spec_value": "0-400 / 0-400 Hz",
            "benefit_note": "Designed for industrial output frequency range requirements"
          }
        ],
        "compatibility_block": {
          "target_industries": [
            "Oil & Gas",
            "Chemical Processing",
            "Water Treatment"
          ],
          "compatible_media": [
            "Water",
            "Air",
            "Non-corrosive liquids"
          ],
          "mating_standards": [
            "ANSI",
            "ASME",
            "NPT"
          ],
          "not_recommended_for": [
            "Highly corrosive acids",
            "Extreme temperatures beyond rating"
          ]
        },
        "spec_summary_table": [
          {
            "attribute": "Product Name",
            "raw_value": "5HP Variable Frequency Drive, 480V 3-Phase",
            "standardized_value": "5HP Variable Frequency Drive, 480V 3-Phase",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Model Number",
            "raw_value": "VFD-5HP-480-3P",
            "standardized_value": "VFD-5HP-480-3P",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Motor Rating",
            "raw_value": "5",
            "standardized_value": "5 HP",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Input Voltage",
            "raw_value": "380-480",
            "standardized_value": "380-480 V AC",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Input Frequency",
            "raw_value": "50/60",
            "standardized_value": "50/60 Hz",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Output Frequency Range",
            "raw_value": "0-400",
            "standardized_value": "0-400 Hz",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Output Current (CT)",
            "raw_value": "10.5",
            "standardized_value": "10.5 A",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Enclosure",
            "raw_value": "NEMA 1 / IP21",
            "standardized_value": "NEMA 1 / IP21",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Communication",
            "raw_value": "Modbus RTU (RS-485)",
            "standardized_value": "Modbus RTU (RS-485)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Control Method",
            "raw_value": "V/f, Sensorless Vector, FOC",
            "standardized_value": "V/f, Sensorless Vector, FOC",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Overload Capacity",
            "raw_value": "150% for 60s",
            "standardized_value": "150% for 60s",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Ambient Temperature",
            "raw_value": "-10 to 50",
            "standardized_value": "-10 to 50 °C",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Digital Inputs",
            "raw_value": "6",
            "standardized_value": "6",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Analog Inputs",
            "raw_value": "2 (0-10V / 4-20mA)",
            "standardized_value": "2 (0-10V / 4-20mA)",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Built-in Braking Transistor",
            "raw_value": "Yes",
            "standardized_value": "Yes",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Weight",
            "raw_value": "6.2",
            "standardized_value": "6.2 kg",
            "inferred": false,
            "display_flag": "none"
          }
        ]
      },
      "content_quality": {
        "spec_backed_claims": 6,
        "inferred_claims": 0,
        "readability_check": "passed",
        "missing_content_warnings": []
      }
    }
  },
  {
    "keywords": [
      "temperature sensor",
      "rtd",
      "pt100",
      "pt 100",
      "thermowell",
      "temp sensor",
      "platinum",
      "resistance"
    ],
    "extraction": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "extraction_timestamp": "{{TIMESTAMP}}",
      "attributes": [
        {
          "tier": "1",
          "attribute_name": "Product Name",
          "raw_value": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath",
          "raw_unit": null,
          "standardized_value": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 95,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "PT100 RTD Temperatur"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Model Number",
          "raw_value": "RTD-PT100-050-6",
          "raw_unit": null,
          "standardized_value": "RTD-PT100-050-6",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 98,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_001",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "source_snippet": "RTD-PT100-050-6"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Sensor Type",
          "raw_value": "Pt100",
          "raw_unit": null,
          "standardized_value": "Pt100",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Sensor Type: Pt100"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Wire Configuration",
          "raw_value": "3-wire",
          "raw_unit": null,
          "standardized_value": "3-wire",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Wire Configuration: "
          }
        },
        {
          "tier": "1",
          "attribute_name": "Accuracy Class",
          "raw_value": "Class A",
          "raw_unit": null,
          "standardized_value": "Class A",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Accuracy Class: Clas"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Temperature Range",
          "raw_value": "-50 to +400",
          "raw_unit": "°C",
          "standardized_value": "-50 to +400",
          "standardized_unit": "°C",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Temperature Range: -"
          }
        },
        {
          "tier": "1",
          "attribute_name": "Sheath Material",
          "raw_value": "316 SS",
          "raw_unit": null,
          "standardized_value": "316 SS",
          "standardized_unit": null,
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Sheath Material: 316"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Sheath Diameter",
          "raw_value": "6",
          "raw_unit": "mm",
          "standardized_value": "6",
          "standardized_unit": "mm",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Sheath Diameter: 6"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Insertion Length",
          "raw_value": "150",
          "raw_unit": "mm",
          "standardized_value": "150",
          "standardized_unit": "mm",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Insertion Length: 15"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Process Connection",
          "raw_value": "1/2\"",
          "raw_unit": "NPT",
          "standardized_value": "1/2\"",
          "standardized_unit": "NPT",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Process Connection: "
          }
        },
        {
          "tier": "2",
          "attribute_name": "Alpha Coefficient",
          "raw_value": "0.00385",
          "raw_unit": "Ω/Ω/°C",
          "standardized_value": "0.00385",
          "standardized_unit": "Ω/Ω/°C",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Alpha Coefficient: 0"
          }
        },
        {
          "tier": "2",
          "attribute_name": "Insulation Resistance",
          "raw_value": ">100",
          "raw_unit": "MΩ @ 500VDC",
          "standardized_value": ">100",
          "standardized_unit": "MΩ @ 500VDC",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Insulation Resistanc"
          }
        },
        {
          "tier": "3",
          "attribute_name": "Response Time (t90)",
          "raw_value": "8",
          "raw_unit": "seconds (in water @ 0.4 m/s)",
          "standardized_value": "8",
          "standardized_unit": "seconds (in water @ 0.4 m/s)",
          "inferred": false,
          "inference_basis": null,
          "confidence_score": 90,
          "confidence_label": "high",
          "conflict_detected": false,
          "conflict_instances": [],
          "source_grounding": {
            "chunk_id": "chunk_002",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "source_snippet": "Response Time (t90):"
          }
        }
      ],
      "extraction_summary": {
        "tier1_complete": true,
        "tier1_missing": [],
        "tier2_extracted_count": 5,
        "tier3_extracted_count": 1,
        "total_attributes_extracted": 13,
        "inferred_attributes_count": 0,
        "conflicts_detected": [],
        "review_required_attributes": []
      },
      "product_identification": {
        "raw_title": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath",
        "model_number": "RTD-PT100-050-6",
        "part_number": "RTD-100-12NPT-6IN-316",
        "manufacturer": "TempSense Instruments",
        "series_or_family": "Industrial RTD Series",
        "country_of_origin": "Germany"
      }
    },
    "enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Instrumentation",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Sensors",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Temperature Sensor",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Industrial Mount",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "9026.20",
        "description": "Temperature Sensor for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "TempSense Pt100 RTD Temperature Sensor, -50 to +400°C, Class A, 316SS Sheath 6mm, 1/2\" NPT, 3-Wire",
        "short_title": "Pt100 RTD Sensor 316SS 0-400°C",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "PT100 RTD sensor",
          "temperature sensor industrial",
          "RTD probe 316SS",
          "Pt100 temperature probe NPT"
        ],
        "technical_synonyms": [
          "PT100 RTD temperature sensor 316 stainless steel 1/2 NPT Class A IEC 60751",
          "industrial RTD probe 0-400 degrees 3 wire"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "preprocessing": {
      "source_file": "{{FILENAME}}",
      "document_type": "{{DOC_TYPE}}",
      "total_pages_processed": 1,
      "sections": [
        {
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "raw_content": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath\nModel: RTD-PT100-050-6\nPN: RTD-100-12NPT-6IN-316\nManufacturer: TempSense Instruments",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "raw_content": "Industrial-grade Pt100 RTD temperature sensor with 316 stainless steel sheath for process temperature measurement. Class A accuracy per IEC 60751.",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[FEATURES_LIST]",
          "page_number": 1,
          "raw_content": "- Pt100 thin-film element — 100Ω at 0°C, α = 0.00385\n- 316 SS sheath for corrosion resistance\n- Class A accuracy: ±(0.15 + 0.002|t|)°C\n- 3-wire configuration for lead resistance compensation\n- DIN Form B connection head in die-cast aluminium\n- ATEX Zone 1 option available for hazardous areas",
          "table_parsed": false,
          "table_data": [],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "raw_content": "Technical Specifications Table",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Standard Specs",
              "rows": [
                {
                  "key": "Sensor Type",
                  "value": "Pt100",
                  "unit": null
                },
                {
                  "key": "Wire Configuration",
                  "value": "3-wire",
                  "unit": null
                },
                {
                  "key": "Accuracy Class",
                  "value": "Class A",
                  "unit": null
                },
                {
                  "key": "Temperature Range",
                  "value": "-50 to +400",
                  "unit": "°C"
                },
                {
                  "key": "Sheath Material",
                  "value": "316 SS",
                  "unit": null
                },
                {
                  "key": "Sheath Diameter",
                  "value": "6",
                  "unit": "mm"
                },
                {
                  "key": "Insertion Length",
                  "value": "150",
                  "unit": "mm"
                },
                {
                  "key": "Process Connection",
                  "value": "1/2\"",
                  "unit": "NPT"
                },
                {
                  "key": "Alpha Coefficient",
                  "value": "0.00385",
                  "unit": "Ω/Ω/°C"
                },
                {
                  "key": "Insulation Resistance",
                  "value": ">100",
                  "unit": "MΩ @ 500VDC"
                },
                {
                  "key": "Response Time (t90)",
                  "value": "8",
                  "unit": "seconds (in water @ 0.4 m/s)"
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        },
        {
          "section_label": "[DIMENSIONAL_DRAWING]",
          "page_number": 1,
          "raw_content": "Dimensional References",
          "table_parsed": true,
          "table_data": [
            {
              "column_header": "Dimensions",
              "rows": [
                {
                  "key": "Sheath Diameter",
                  "value": "6",
                  "unit": "mm"
                },
                {
                  "key": "Insertion Length (U)",
                  "value": "150",
                  "unit": "mm"
                },
                {
                  "key": "Overall Length",
                  "value": "220",
                  "unit": "mm"
                },
                {
                  "key": "Connection Head",
                  "value": "DIN Form B",
                  "unit": null
                }
              ]
            }
          ],
          "ocr_artifacts_detected": false,
          "ocr_artifact_details": []
        }
      ],
      "extraction_summary": {
        "sections_found": [
          "[PRODUCT_IDENTITY]",
          "[DESCRIPTION_BLOCK]",
          "[FEATURES_LIST]",
          "[SPECIFICATIONS_TABLE]",
          "[DIMENSIONAL_DRAWING]"
        ],
        "sections_missing": [
          "[CERTIFICATIONS]",
          "[WARNINGS_NOTES]"
        ],
        "ocr_noise_overall": "low",
        "extraction_quality": "high",
        "extraction_notes": "Clean document, table structure preserved."
      }
    },
    "chunking": {
      "pipeline_id": "{{UUID}}",
      "source_file": "{{FILENAME}}",
      "total_chunks": 3,
      "chunks": [
        {
          "chunk_id": "chunk_001",
          "chunk_index": 1,
          "section_label": "[PRODUCT_IDENTITY]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "identity",
          "content": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath | Model: RTD-PT100-050-6",
          "key_value_pairs": [
            {
              "key": "Model",
              "value": "RTD-PT100-050-6",
              "unit": null,
              "ocr_suspect": false
            }
          ],
          "token_estimate": 29,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[PRODUCT_IDENTITY]",
            "chunk_sequence": 1
          }
        },
        {
          "chunk_id": "chunk_002",
          "chunk_index": 2,
          "section_label": "[SPECIFICATIONS_TABLE]",
          "page_number": 1,
          "high_priority": true,
          "content_type": "specs_table",
          "content": "Sensor Type: Pt100 , Wire Configuration: 3-wire , Accuracy Class: Class A , Temperature Range: -50 to +400 °C, Sheath Material: 316 SS , Sheath Diameter: 6 mm, Insertion Length: 150 mm, Process Connection: 1/2\" NPT, Alpha Coefficient: 0.00385 Ω/Ω/°C, Insulation Resistance: >100 MΩ @ 500VDC, Response Time (t90): 8 seconds (in water @ 0.4 m/s)",
          "key_value_pairs": [
            {
              "key": "Sensor Type",
              "value": "Pt100",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Wire Configuration",
              "value": "3-wire",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Accuracy Class",
              "value": "Class A",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Temperature Range",
              "value": "-50 to +400",
              "unit": "°C",
              "ocr_suspect": false
            },
            {
              "key": "Sheath Material",
              "value": "316 SS",
              "unit": null,
              "ocr_suspect": false
            },
            {
              "key": "Sheath Diameter",
              "value": "6",
              "unit": "mm",
              "ocr_suspect": false
            },
            {
              "key": "Insertion Length",
              "value": "150",
              "unit": "mm",
              "ocr_suspect": false
            },
            {
              "key": "Process Connection",
              "value": "1/2\"",
              "unit": "NPT",
              "ocr_suspect": false
            },
            {
              "key": "Alpha Coefficient",
              "value": "0.00385",
              "unit": "Ω/Ω/°C",
              "ocr_suspect": false
            },
            {
              "key": "Insulation Resistance",
              "value": ">100",
              "unit": "MΩ @ 500VDC",
              "ocr_suspect": false
            },
            {
              "key": "Response Time (t90)",
              "value": "8",
              "unit": "seconds (in water @ 0.4 m/s)",
              "ocr_suspect": false
            }
          ],
          "token_estimate": 95,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[SPECIFICATIONS_TABLE]",
            "chunk_sequence": 2
          }
        },
        {
          "chunk_id": "chunk_003",
          "chunk_index": 3,
          "section_label": "[DESCRIPTION_BLOCK]",
          "page_number": 1,
          "high_priority": false,
          "content_type": "description",
          "content": "Industrial-grade Pt100 RTD temperature sensor with 316 stainless steel sheath for process temperature measurement. Class A accuracy per IEC 60751.",
          "key_value_pairs": [],
          "token_estimate": 46,
          "deduplicated": false,
          "source_metadata": {
            "source_file": "{{FILENAME}}",
            "page_number": 1,
            "section_label": "[DESCRIPTION_BLOCK]",
            "chunk_sequence": 3
          }
        }
      ],
      "pipeline_summary": {
        "high_priority_chunks": 2,
        "identity_chunks": 1,
        "spec_chunks": 1,
        "description_chunks": 1,
        "ready_for_module_2": true,
        "blocking_issues": []
      }
    },
    "new_enrichment": {
      "pipeline_id": "{{UUID}}",
      "taxonomy": {
        "primary": {
          "l1_domain": {
            "label": "Instrumentation",
            "confidence": 95,
            "triggered_by": "Product Name"
          },
          "l2_family": {
            "label": "Sensors",
            "confidence": 90,
            "triggered_by": "Product Name"
          },
          "l3_type": {
            "label": "Temperature Sensor",
            "confidence": 85,
            "triggered_by": "Model Number / Specs"
          },
          "l4_variant": {
            "label": "Industrial Mount",
            "confidence": 75,
            "triggered_by": "Connection Type",
            "ambiguous": false
          }
        },
        "secondary": {
          "l1_domain": {
            "label": null,
            "confidence": 0
          },
          "l2_family": {
            "label": null,
            "confidence": 0
          },
          "l3_type": {
            "label": null,
            "confidence": 0
          }
        },
        "multi_category": false
      },
      "hs_code": {
        "code": "9026.20",
        "description": "Temperature Sensor for industrial use",
        "hs_code_inferred": true,
        "confidence": 80
      },
      "product_identifiers": {
        "standardized_product_title": "TempSense Pt100 RTD Temperature Sensor, -50 to +400°C, Class A, 316SS Sheath 6mm, 1/2\" NPT, 3-Wire",
        "short_title": "Pt100 RTD Sensor 316SS 0-400°C",
        "generated_sku_placeholder": null,
        "sku_pattern_logic": null
      },
      "search_intelligence": {
        "primary_keywords": [
          "PT100 RTD sensor",
          "temperature sensor industrial",
          "RTD probe 316SS",
          "Pt100 temperature probe NPT"
        ],
        "technical_synonyms": [
          "PT100 RTD temperature sensor 316 stainless steel 1/2 NPT Class A IEC 60751",
          "industrial RTD probe 0-400 degrees 3 wire"
        ],
        "long_tail_phrases": [],
        "negative_keywords": [
          "domestic",
          "residential",
          "consumer"
        ]
      },
      "taxonomy_summary": {
        "depth_reached": "L4",
        "overall_confidence": 86,
        "ambiguous_levels": [],
        "taxonomy_notes": "Successfully mapped to 4 levels."
      }
    },
    "cataloging": {
      "pipeline_id": "{{UUID}}",
      "commercial_catalog": {
        "short_summary": "Industrial grade Temperature Sensor for robust operational performance.",
        "detailed_description": "This PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath provides reliable performance in industrial environments. Constructed to rigorous standards, it ensures maximum durability and operational safety. Designed with precision to meet exact flow and pressure ratings. It connects seamlessly into existing systems via standard interfaces. Suitable for a wide range of applications including fluid control and processing.",
        "bullet_features": [
          {
            "category": "Product Name",
            "spec_value": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath / PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath",
            "benefit_note": "Designed for industrial product name requirements"
          },
          {
            "category": "Model Number",
            "spec_value": "RTD-PT100-050-6 / RTD-PT100-050-6",
            "benefit_note": "Designed for industrial model number requirements"
          },
          {
            "category": "Sensor Type",
            "spec_value": "Pt100 / Pt100",
            "benefit_note": "Designed for industrial sensor type requirements"
          },
          {
            "category": "Wire Configuration",
            "spec_value": "3-wire / 3-wire",
            "benefit_note": "Designed for industrial wire configuration requirements"
          },
          {
            "category": "Accuracy Class",
            "spec_value": "Class A / Class A",
            "benefit_note": "Designed for industrial accuracy class requirements"
          },
          {
            "category": "Temperature Range",
            "spec_value": "-50 to +400 / -50 to +400 °C",
            "benefit_note": "Designed for industrial temperature range requirements"
          }
        ],
        "compatibility_block": {
          "target_industries": [
            "Oil & Gas",
            "Chemical Processing",
            "Water Treatment"
          ],
          "compatible_media": [
            "Water",
            "Air",
            "Non-corrosive liquids"
          ],
          "mating_standards": [
            "ANSI",
            "ASME",
            "NPT"
          ],
          "not_recommended_for": [
            "Highly corrosive acids",
            "Extreme temperatures beyond rating"
          ]
        },
        "spec_summary_table": [
          {
            "attribute": "Product Name",
            "raw_value": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath",
            "standardized_value": "PT100 RTD Temperature Sensor, 1/2\" NPT, 316SS Sheath",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Model Number",
            "raw_value": "RTD-PT100-050-6",
            "standardized_value": "RTD-PT100-050-6",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Sensor Type",
            "raw_value": "Pt100",
            "standardized_value": "Pt100",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Wire Configuration",
            "raw_value": "3-wire",
            "standardized_value": "3-wire",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Accuracy Class",
            "raw_value": "Class A",
            "standardized_value": "Class A",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Temperature Range",
            "raw_value": "-50 to +400",
            "standardized_value": "-50 to +400 °C",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Sheath Material",
            "raw_value": "316 SS",
            "standardized_value": "316 SS",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Sheath Diameter",
            "raw_value": "6",
            "standardized_value": "6 mm",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Insertion Length",
            "raw_value": "150",
            "standardized_value": "150 mm",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Process Connection",
            "raw_value": "1/2\"",
            "standardized_value": "1/2\" NPT",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Alpha Coefficient",
            "raw_value": "0.00385",
            "standardized_value": "0.00385 Ω/Ω/°C",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Insulation Resistance",
            "raw_value": ">100",
            "standardized_value": ">100 MΩ @ 500VDC",
            "inferred": false,
            "display_flag": "none"
          },
          {
            "attribute": "Response Time (t90)",
            "raw_value": "8",
            "standardized_value": "8 seconds (in water @ 0.4 m/s)",
            "inferred": false,
            "display_flag": "none"
          }
        ]
      },
      "content_quality": {
        "spec_backed_claims": 6,
        "inferred_claims": 0,
        "readability_check": "passed",
        "missing_content_warnings": []
      }
    }
  }
];

function getProducts() { return products; }
function selectProduct(text) { if (!text) return products[0]; const lowerText = text.toLowerCase(); let bestProduct = null; let bestScore = 0; for (const product of products) { let score = 0; for (const kw of product.keywords) { if (lowerText.includes(kw)) { score += kw.length; } } if (score > bestScore) { bestScore = score; bestProduct = product; } } return bestProduct || products[0]; }
module.exports = { getProducts, selectProduct };
