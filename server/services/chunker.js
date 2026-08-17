const { v4: uuidv4 } = require('uuid');
const { selectProduct } = require('../data/mockProducts');

exports.chunkData = async (preprocessing) => {
    // Add simulated delay for chunking stage (0.5 - 1 seconds)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    // Attempt to figure out which product we are working with
    // We can infer this from the preprocessing product identity
    let keywords = preprocessing.source_file || '';
    if (preprocessing.sections && preprocessing.sections.length > 0) {
        keywords += ' ' + preprocessing.sections[0].raw_content;
    }

    const product = selectProduct(keywords);
    const chunking = JSON.parse(JSON.stringify(product.chunking));
    
    // Inject dynamic metadata
    chunking.pipeline_id = uuidv4();
    chunking.source_file = preprocessing.source_file;
    
    // Update chunk metadata
    if (chunking.chunks) {
        chunking.chunks.forEach(chunk => {
            chunk.source_metadata.source_file = preprocessing.source_file;
        });
    }
    
    return chunking;
};
