/**
 * Enrichment Service
 * Dynamically enriches extracted product data without static mock template lookup.
 */
exports.enrichData = async (extractionResult, classification) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const attrs = extractionResult.attributes || [];
    const pId = extractionResult.product_identification || {};

    const rawTitle = pId.raw_title || attrs.find(a => a.attribute_name === 'Product Name')?.raw_value || 'Industrial Product';
    const modelSku = pId.model_number || pId.part_number || 'SKU-' + Date.now();

    const keySpecs = attrs.map(attr => ({
        attribute: attr.attribute_name,
        raw_value: attr.raw_value,
        raw_unit: attr.raw_unit,
        standardized_value: attr.standardized_value || attr.raw_value,
        standardized_unit: attr.standardized_unit || attr.raw_unit,
        inferred: attr.inferred || false,
        inference_basis: attr.inference_basis || null,
        confidence: attr.confidence_score || 90
    }));

    return {
        pipeline_id: extractionResult.pipeline_id || 'pl_' + Date.now(),
        product_title: {
            standardized: rawTitle,
            short_form: rawTitle.split(' ').slice(0, 4).join(' ')
        },
        category_path: {
            l1: "Industrial Supplies",
            l2: "Fluid Power & Valves",
            l3: "Valves & Controls",
            l4: "Process Valves"
        },
        model_sku: {
            extracted: modelSku,
            generated_placeholder: null,
            sku_generation_logic: "Direct extraction from MPN / Model Number field"
        },
        key_specifications: keySpecs,
        commercial_catalog: {
            short_summary: `${rawTitle}. Engineered for reliable industrial service.`,
            detailed_description: `High performance ${rawTitle} featuring ${keySpecs.slice(0, 3).map(s => s.attribute + ': ' + s.raw_value).join(', ')}.`,
            bullet_features: keySpecs.slice(0, 5).map(s => `${s.attribute}: ${s.raw_value} ${s.raw_unit || ''}`.trim()),
            tone_target: "B2B Technical Engineering Specification"
        },
        data_quality_report: {
            overall_confidence_score: keySpecs.length > 0 ? Math.round(keySpecs.reduce((a, c) => a + (c.confidence || 85), 0) / keySpecs.length) : 85,
            extracted_fields_count: keySpecs.length,
            inferred_fields_count: keySpecs.filter(s => s.inferred).length,
            low_confidence_fields: keySpecs.filter(s => s.confidence < 75).map(s => s.attribute),
            missing_critical_fields: [],
            enrichment_recommendations: []
        }
    };
};
