const { selectProduct } = require('../data/mockProducts');

exports.catalogData = async (extractionResult, taxonomyResult) => {
    // Add 1.5-2.5 second simulated delay for copywriting
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Attempt to infer product
    let title = '';
    if (extractionResult.attributes && Array.isArray(extractionResult.attributes)) {
        const titleAttr = extractionResult.attributes.find(a => a.attribute_name === 'Product Name');
        if (titleAttr) title = titleAttr.raw_value;
    } else if (extractionResult.product_identification && extractionResult.product_identification.raw_title) {
        title = extractionResult.product_identification.raw_title;
    }

    const product = selectProduct(title);
    const cataloging = JSON.parse(JSON.stringify(product.cataloging));
    
    // Inject dynamic pipeline ID
    cataloging.pipeline_id = extractionResult.pipeline_id || cataloging.pipeline_id;
    
    return cataloging;
};
