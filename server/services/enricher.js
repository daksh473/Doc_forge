const { selectProduct } = require('../data/mockProducts');

exports.enrichData = async (extractionResult, classification) => {
    // Add 2-3 second simulated delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    let title = '';
    // Look for Product Name in the new schema
    if (extractionResult.attributes && Array.isArray(extractionResult.attributes)) {
        const titleAttr = extractionResult.attributes.find(a => a.attribute_name === 'Product Name');
        if (titleAttr) title = titleAttr.raw_value;
    } else if (extractionResult.product_identification && extractionResult.product_identification.raw_title) {
        // Fallback to old schema
        title = extractionResult.product_identification.raw_title;
    }

    const product = selectProduct(title);
    const enrichment = JSON.parse(JSON.stringify(product.enrichment));
    
    // Inject dynamic pipeline ID
    enrichment.pipeline_id = extractionResult.pipeline_id || enrichment.pipeline_id;
    
    return enrichment;
};
