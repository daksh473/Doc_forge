const { v4: uuidv4 } = require('uuid');
const { selectProduct } = require('../data/mockProducts');

exports.extractData = async (chunking) => {
    // Add 1.5-2 second simulated delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));
    
    // Select product based on the source file or extracted text from chunks
    let keywords = chunking.source_file || '';
    if (chunking.chunks && chunking.chunks.length > 0) {
        keywords += ' ' + chunking.chunks[0].content;
    }
    const product = selectProduct(keywords);
    const extraction = JSON.parse(JSON.stringify(product.extraction));
    
    // Dynamic metadata injection
    extraction.pipeline_id = chunking.pipeline_id || uuidv4();
    extraction.source_file = chunking.source_file;
    extraction.extraction_timestamp = new Date().toISOString();

    // The extraction mock data already contains the `attributes` and `extraction_summary` 
    // structures thanks to our node script. We simply return it.
    
    return extraction;
};
