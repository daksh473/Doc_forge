exports.classifyDocument = (metadata) => {
    const { fileType, hasTextLayer, charCount, hasCleanHeaders } = metadata;
    
    if (fileType === 'pdf') {
        if (hasTextLayer && charCount > 200) {
            return {
                document_type: 'pdf_datasheet',
                confidence: 'high',
                reason: 'PDF contains a substantial text layer indicating a native document.',
                recommended_parser: 'pymupdf',
                fallback_parser: null
            };
        } else {
            return {
                document_type: 'pdf_unstructured',
                confidence: 'medium',
                reason: 'PDF lacks sufficient text layer; likely a scanned document.',
                recommended_parser: 'ocr_vision',
                fallback_parser: null
            };
        }
    }
    
    if (fileType === 'image') {
        return {
            document_type: 'image_scan',
            confidence: 'high',
            reason: 'Image file format detected.',
            recommended_parser: 'ocr_vision',
            fallback_parser: null
        };
    }
    
    if (fileType === 'csv') {
        if (hasCleanHeaders) {
            return {
                document_type: 'csv_structured',
                confidence: 'high',
                reason: 'CSV with clean, detectable headers.',
                recommended_parser: 'csv_pandas',
                fallback_parser: null
            };
        } else {
            return {
                document_type: 'csv_messy',
                confidence: 'medium',
                reason: 'CSV format with irregular or missing headers.',
                recommended_parser: 'csv_pandas',
                fallback_parser: 'text_direct'
            };
        }
    }
    
    return {
        document_type: 'plain_text',
        confidence: 'high',
        reason: 'Fallback to plain text processing.',
        recommended_parser: 'text_direct',
        fallback_parser: null
    };
};
