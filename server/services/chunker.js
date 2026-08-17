const { v4: uuidv4 } = require('uuid');

/**
 * Chunker Service
 * Genuinely chunks real parsed document text into logical sections.
 */
exports.chunkData = async (preprocessing) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const pipelineId = uuidv4();
    const sourceFile = preprocessing.source_file || 'uploaded_document';
    const sections = preprocessing.sections || [];

    const chunks = [];
    let chunkIndex = 1;

    sections.forEach(sec => {
        const text = sec.raw_content || '';
        if (!text.trim()) return;

        // If a section is large (> 600 chars), split by paragraphs into sub-chunks
        if (text.length > 600) {
            const paragraphs = text.split('\n').filter(p => p.trim());
            let currentSub = '';

            paragraphs.forEach(p => {
                if ((currentSub + '\n' + p).length > 500 && currentSub.trim()) {
                    chunks.push({
                        chunk_id: `chunk_${String(chunkIndex++).padStart(3, '0')}`,
                        content: currentSub.trim(),
                        section_label: sec.section_label || '[DOCUMENT_SECTION]',
                        page_number: 1,
                        source_metadata: {
                            source_file: sourceFile,
                            char_count: currentSub.trim().length
                        }
                    });
                    currentSub = p;
                } else {
                    currentSub += (currentSub ? '\n' : '') + p;
                }
            });

            if (currentSub.trim()) {
                chunks.push({
                    chunk_id: `chunk_${String(chunkIndex++).padStart(3, '0')}`,
                    content: currentSub.trim(),
                    section_label: sec.section_label || '[DOCUMENT_SECTION]',
                    page_number: 1,
                    source_metadata: {
                        source_file: sourceFile,
                        char_count: currentSub.trim().length
                    }
                });
            }
        } else {
            chunks.push({
                chunk_id: `chunk_${String(chunkIndex++).padStart(3, '0')}`,
                content: text.trim(),
                section_label: sec.section_label || '[DOCUMENT_SECTION]',
                page_number: 1,
                source_metadata: {
                    source_file: sourceFile,
                    char_count: text.trim().length
                }
            });
        }
    });

    if (chunks.length === 0) {
        const text = preprocessing.fullText || preprocessing.textSample || '[No document text available]';
        chunks.push({
            chunk_id: 'chunk_001',
            content: text,
            section_label: '[DOCUMENT_CONTENT]',
            page_number: 1,
            source_metadata: {
                source_file: sourceFile,
                char_count: text.length
            }
        });
    }

    return {
        pipeline_id: pipelineId,
        source_file: sourceFile,
        chunking_strategy: 'section_and_paragraph_split',
        total_chunks: chunks.length,
        chunks: chunks
    };
};
