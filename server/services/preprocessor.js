/**
 * Preprocessing Service
 * Processes real uploaded document metadata and raw text.
 */
exports.preprocessData = async (metadata, classification) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const fullContent = metadata.fullText || metadata.textSample || '';
    const fileName = metadata.fileName || 'uploaded_document';

    // Break fullContent into sections if multi-line or block-based
    const rawParagraphs = fullContent.split(/\n\s*\n/).filter(p => p.trim());
    const sections = rawParagraphs.map((p, idx) => {
        let label = '[DOCUMENT_CONTENT]';
        const lower = p.toLowerCase();
        if (lower.includes('spec') || lower.includes('rating') || lower.includes('psi') || lower.includes('voltage')) {
            label = '[SPECIFICATIONS]';
        } else if (lower.includes('feature') || lower.includes('overview') || lower.includes('note')) {
            label = '[FEATURES]';
        } else if (lower.includes('model') || lower.includes('part') || lower.includes('valve') || lower.includes('sensor')) {
            label = '[PRODUCT_IDENTITY]';
        }

        return {
            section_id: `sec_${String(idx + 1).padStart(3, '0')}`,
            section_label: label,
            raw_content: p.trim(),
            ocr_artifacts_detected: classification.document_type === 'image_scan' || classification.document_type === 'pdf_unstructured'
        };
    });

    if (sections.length === 0) {
        sections.push({
            section_id: 'sec_001',
            section_label: '[DOCUMENT_CONTENT]',
            raw_content: fullContent.trim() || '[No text extracted from document]',
            ocr_artifacts_detected: false
        });
    }

    return {
        source_file: fileName,
        document_type: classification.document_type,
        total_pages_processed: metadata.pageCount || 1,
        fullText: fullContent,
        sections: sections,
        extraction_summary: {
            ocr_noise_overall: (classification.document_type === 'image_scan' || classification.document_type === 'pdf_unstructured') ? 'moderate' : 'clean',
            extraction_quality: (classification.document_type === 'image_scan' || classification.document_type === 'pdf_unstructured') ? 'medium' : 'high',
            extraction_notes: 'Real document text processed.'
        }
    };
};
