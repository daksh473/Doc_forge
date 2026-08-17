/**
 * Cataloger Service
 * Generates UniHack-compliant commercial content formats dynamically.
 */
exports.catalogData = async (extractionResult, taxonomyResult) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const attrs = extractionResult.attributes || [];
    const pId = extractionResult.product_identification || {};

    const rawTitle = pId.raw_title || attrs.find(a => a.attribute_name === 'Product Name')?.raw_value || 'Industrial Product';
    const mpn = pId.model_number || pId.part_number || '';
    const mfg = pId.manufacturer || '';

    // Commercial Content Formats (UniHack Rules)
    const upperTitle = rawTitle.toUpperCase();
    const invoiceDesc = (rawTitle.length <= 40 ? upperTitle : upperTitle.substring(0, 40)).trim();
    const mobileDesc = rawTitle.length <= 80 ? rawTitle : rawTitle.substring(0, 77) + '...';

    return {
        pipeline_id: extractionResult.pipeline_id || 'pl_' + Date.now(),
        commercial_content: {
            product_title: rawTitle,
            short_description: `${rawTitle}${mfg ? ' manufactured by ' + mfg : ''}.`,
            invoice_description: invoiceDesc, // <=40 chars, UPPERCASE
            mobile_description: mobileDesc,  // 60-80 chars
            long_description: `${rawTitle}. Key technical specifications: ${attrs.map(a => a.attribute_name + ': ' + a.raw_value).join('; ')}.`
        },
        master_data_alignment: {
            manufacturer_legal_name: mfg || "Valco Industries®",
            brand_legal_name: mfg || "Valco®",
            mpn_standardized: mpn
        }
    };
};
