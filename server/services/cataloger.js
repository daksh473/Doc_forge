/**
 * Cataloger Service
 * Generates UniHack-compliant commercial content formats dynamically.
 * Produces SHORT_DESC, LONG_DESC1, RETAIL_DESC, MARKETING_DESCRIPTION,
 * INVOICE_DESC, MOBILE_DESC, and up to 20 ITEM_FEATURES.
 * 
 * BUG 1 FIX: Uses raw Part_Desc text directly — no hashing or mangling.
 * BUG 4 FIX: Generates proper attribute triplets from extraction data.
 */
exports.catalogData = async (extractionResult, taxonomyResult, originalRow) => {
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));

    const attrs = (extractionResult && Array.isArray(extractionResult.attributes)) ? extractionResult.attributes : [];
    const pId = (extractionResult && extractionResult.product_identification) || {};

    // Use originalRow Part_Desc directly (BUG 1 FIX — no hashing)
    const partDesc = originalRow?.Part_Desc || '';
    const mfgPartNum = originalRow?.Mfg_Part_Num || '';
    const rawTitle = partDesc || pId.raw_title || attrs.find(a => a.attribute_name === 'Product Name')?.raw_value || 'Industrial Product';
    const mpn = mfgPartNum || pId.model_number || pId.part_number || '';
    const mfg = pId.manufacturer || '';
    const series = pId.series_or_family || '';

    // Taxonomy data
    const catPath = taxonomyResult?.category_path || taxonomyResult?.taxonomy?.category_path || [];
    const productType = catPath[2] || catPath[1] || 'Product';

    // Extract key spec values for descriptions
    const specMap = {};
    attrs.forEach(a => {
        if (a.attribute_name && (a.standardized_value || a.raw_value)) {
            specMap[a.attribute_name.toLowerCase()] = {
                name: a.attribute_name,
                value: a.standardized_value || a.raw_value,
                unit: a.standardized_unit || a.raw_unit || ''
            };
        }
    });

    const material = specMap['material']?.value || specMap['body material']?.value || '';
    const voltage = specMap['voltage']?.value || specMap['voltage rating']?.value || '';
    const size = specMap['size']?.value || '';
    const pressureRating = specMap['pressure rating']?.value || '';

    // Abbreviation map for INVOICE_DESC
    const ABBREVS = {
        'stainless steel': 'SST', 'carbon steel': 'CS', 'brass': 'BRS',
        'copper': 'CU', 'aluminum': 'ALM', 'plastic': 'PLS',
        'inches': 'IN', 'inch': 'IN', 'feet': 'FT', 'foot': 'FT',
        'pound': 'LB', 'pounds': 'LBS'
    };

    function abbreviate(str) {
        let s = str.toUpperCase();
        Object.entries(ABBREVS).forEach(([full, abbr]) => {
            s = s.replace(new RegExp(full, 'gi'), abbr);
        });
        return s;
    }

    // ── INVOICE_DESC (max 40 chars, ALL CAPS, key specs abbreviated) ──
    let invoiceParts = [productType.toUpperCase()];
    if (size) invoiceParts.push(size.toUpperCase());
    if (material) invoiceParts.push(abbreviate(material));
    if (voltage) invoiceParts.push(voltage + 'V');
    if (pressureRating) invoiceParts.push(pressureRating.toUpperCase());

    let invoiceDesc = invoiceParts.join(' ');
    // If too short, try adding raw specs from Part_Desc
    if (invoiceDesc.length < 15 && partDesc) {
        invoiceDesc = abbreviate(partDesc);
    }
    invoiceDesc = invoiceDesc.substring(0, 40).trim();

    // ── MOBILE_DESC (60-80 chars, sentence case) ──
    // Format: Manufacturer Brand, ProductType, Series, MPN
    let mobileParts = [];
    if (mfg) mobileParts.push(mfg);
    mobileParts.push(productType);
    if (series) mobileParts.push(series);
    if (mpn) mobileParts.push(mpn);
    let mobileDesc = mobileParts.join(', ');
    if (mobileDesc.length < 60 && partDesc && mobileDesc.length < partDesc.length) {
        mobileDesc = partDesc;
    }
    if (mobileDesc.length > 80) {
        mobileDesc = mobileDesc.substring(0, 77) + '...';
    }

    // ── SHORT_DESC (Brand® Series MPN ProductType, key attributes, Material) ──
    let shortParts = [];
    if (mfg) shortParts.push(mfg);
    if (series) shortParts.push(series);
    if (mpn) shortParts.push(mpn);
    shortParts.push(productType);
    const keyAttrPhrases = attrs.slice(0, 3).map(a => 
        `${a.attribute_name}: ${a.standardized_value || a.raw_value}${a.standardized_unit ? ' ' + a.standardized_unit : ''}`
    );
    if (keyAttrPhrases.length > 0) shortParts.push(keyAttrPhrases.join(', '));
    if (material) shortParts.push(material);
    const shortDesc = shortParts.join(', ').trim();

    // ── LONG_DESC1 (full technical description with all specs) ──
    const specPhrases = attrs
        .filter(a => a.attribute_name && (a.standardized_value || a.raw_value))
        .map(a => `${a.attribute_name}: ${a.standardized_value || a.raw_value}${a.standardized_unit ? ' ' + a.standardized_unit : ''}`);
    
    const longDesc = `${mfg ? mfg + ' ' : ''}${rawTitle}${mpn ? ' Model ' + mpn : ''}. ${productType}. Key specifications: ${specPhrases.length > 0 ? specPhrases.join(', ') : 'Standard specification'}. ${material ? 'Material: ' + material + '.' : ''}`;

    // ── RETAIL_DESC (Series ProductType, key feature, Material — no brand) ──
    let retailParts = [];
    if (series) retailParts.push(series);
    retailParts.push(productType);
    if (attrs[0]) retailParts.push(`${attrs[0].attribute_name}: ${attrs[0].standardized_value || attrs[0].raw_value}`);
    if (material) retailParts.push(material);
    const retailDesc = retailParts.join(', ').trim();

    // ── MARKETING_DESCRIPTION ──
    const marketingDesc = `${mfg ? mfg + ' ' : ''}${productType}${series ? ' - ' + series : ''}. ${specPhrases.slice(0, 5).join('. ')}. Engineered for reliable performance.`;

    // ── ITEM_FEATURES (up to 20 bullet features from attributes) ──
    const bulletFeatures = [];
    attrs.forEach(a => {
        if (a.attribute_name && (a.standardized_value || a.raw_value)) {
            bulletFeatures.push(`${a.attribute_name}: ${a.standardized_value || a.raw_value}${a.standardized_unit ? ' ' + a.standardized_unit : ''}`);
        }
    });

    return {
        pipeline_id: extractionResult?.pipeline_id || 'pl_' + Date.now(),
        commercial_catalog: {
            product_title: rawTitle,
            short_description: shortDesc,
            invoice_description: invoiceDesc,
            mobile_description: mobileDesc,
            long_description: longDesc,
            retail_description: retailDesc,
            marketing_description: marketingDesc,
            bullet_features: bulletFeatures.slice(0, 20)
        },
        commercial_content: {
            product_title: rawTitle,
            short_description: shortDesc,
            invoice_description: invoiceDesc,
            mobile_description: mobileDesc,
            long_description: longDesc,
            retail_description: retailDesc,
            marketing_description: marketingDesc,
            bullet_features: bulletFeatures.slice(0, 20)
        },
        master_data_alignment: {
            manufacturer_legal_name: mfg ? `${mfg}®` : "",
            brand_legal_name: mfg ? `${mfg}®` : "",
            mpn_standardized: mpn
        }
    };
};
