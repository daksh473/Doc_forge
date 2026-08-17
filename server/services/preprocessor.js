const { selectProduct } = require('../data/mockProducts');

exports.preprocessData = async (metadata, classification) => {
    // Add simulated delay for preprocessing stage (1-1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    
    const keywords = (metadata.textSample || '') + ' ' + (metadata.fileName || '');
    const product = selectProduct(keywords);
    const preprocessing = JSON.parse(JSON.stringify(product.preprocessing));
    
    // Inject dynamic metadata
    preprocessing.source_file = metadata.fileName;
    preprocessing.document_type = classification.document_type;
    preprocessing.total_pages_processed = metadata.pageCount || 1;
    
    // Simulate OCR artifacts if it's an image or unstructured PDF
    if (classification.document_type === 'image_scan' || classification.document_type === 'pdf_unstructured') {
        preprocessing.extraction_summary.ocr_noise_overall = 'moderate';
        preprocessing.extraction_summary.extraction_quality = 'medium';
        preprocessing.extraction_summary.extraction_notes = 'OCR noise detected, some fields may require review.';
        
        // Add some noise to the first section
        if (preprocessing.sections && preprocessing.sections.length > 0) {
            preprocessing.sections[0].ocr_artifacts_detected = true;
            preprocessing.sections[0].ocr_artifact_details = ['Possible substitution: 0/O', 'Merged words detected'];
        }
    }
    
    return preprocessing;
};
