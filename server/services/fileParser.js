const path = require('path');
const fs = require('fs');

/**
 * Parse a PDF file and extract metadata.
 * Uses pdf-parse when available, falls back to mock metadata.
 */
async function parsePDF(filePath) {
  try {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return {
      fileType: 'pdf',
      fileName: path.basename(filePath),
      pageCount: pdfData.numpages || 1,
      hasTextLayer: pdfData.text && pdfData.text.trim().length > 0,
      charCount: pdfData.text ? pdfData.text.length : 0,
      textSample: pdfData.text ? pdfData.text.substring(0, 500) : '',
      fullText: pdfData.text || '',
      wordCount: pdfData.text ? pdfData.text.split(/\s+/).length : 0
    };
  } catch (err) {
    // Fallback if pdf-parse fails
    const stats = fs.statSync(filePath);
    return {
      fileType: 'pdf',
      fileName: path.basename(filePath),
      pageCount: Math.max(1, Math.ceil(stats.size / 50000)),
      hasTextLayer: stats.size > 5000,
      charCount: Math.floor(stats.size * 0.6),
      textSample: '[PDF text extraction unavailable]',
      wordCount: 0
    };
  }
}

/**
 * Parse a CSV file and detect structure.
 */
async function parseCSV(filePath) {
  try {
    const rawText = fs.readFileSync(filePath, 'utf-8');
    const lines = rawText.split('\n').filter(l => l.trim());
    const firstLine = lines[0] || '';
    const delimiter = firstLine.includes('\t') ? '\t' : ',';
    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));

    // Detect clean vs messy
    const hasCleanHeaders = headers.length > 1
      && headers.every(h => h.length > 0 && h.length < 60 && /^[a-zA-Z0-9_\s\-\/().]+$/.test(h));
    const sampleRows = lines.slice(1, 4).map(l => l.split(delimiter).map(c => c.trim()));
    const columnCountConsistent = sampleRows.every(r => r.length === headers.length);

    return {
      fileType: 'csv',
      fileName: path.basename(filePath),
      hasCleanHeaders: hasCleanHeaders && columnCountConsistent,
      headers: headers.slice(0, 10),
      rowCount: lines.length - 1,
      charCount: rawText.length,
      textSample: rawText.substring(0, 500),
      fullText: rawText,
      delimiter,
      columnCount: headers.length
    };
  } catch (err) {
    return {
      fileType: 'csv',
      fileName: path.basename(filePath),
      hasCleanHeaders: false,
      rowCount: 0,
      charCount: 0,
      textSample: '',
      fullText: '',
      error: err.message
    };
  }
}

/**
 * Parse an image file and extract metadata.
 */
async function parseImage(filePath) {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(filePath).metadata();
    return {
      fileType: 'image',
      fileName: path.basename(filePath),
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      colorSpace: metadata.space || 'srgb',
      charCount: 0,
      hasTextLayer: false,
      fullText: `[Image Scan ${path.basename(filePath)} - Width: ${metadata.width}px, Height: ${metadata.height}px, Format: ${metadata.format}]`,
      fileSizeBytes: metadata.size || fs.statSync(filePath).size
    };
  } catch (err) {
    const ext = path.extname(filePath).replace('.', '').toLowerCase();
    return {
      fileType: 'image',
      fileName: path.basename(filePath),
      width: 0,
      height: 0,
      format: ext || 'unknown',
      channels: 3,
      colorSpace: 'srgb',
      charCount: 0,
      hasTextLayer: false,
      fullText: `[Image Scan ${path.basename(filePath)}]`,
      fileSizeBytes: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
    };
  }
}

/**
 * Parse plain text input.
 */
async function parseText(text) {
  const trimmed = (text || '').trim();
  return {
    fileType: 'text',
    fileName: 'text_input.txt',
    charCount: trimmed.length,
    lineCount: trimmed.split('\n').length,
    wordCount: trimmed.split(/\s+/).filter(w => w).length,
    textSample: trimmed.substring(0, 500),
    fullText: trimmed,
    hasTextLayer: true
  };
}

/**
 * Route a file to the appropriate parser based on extension/mimetype.
 */
async function parseFile(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf' || (mimetype && mimetype.includes('pdf'))) {
    return parsePDF(filePath);
  } else if (ext === '.csv' || (mimetype && mimetype.includes('csv'))) {
    return parseCSV(filePath);
  } else if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'].includes(ext) || (mimetype && mimetype.startsWith('image/'))) {
    return parseImage(filePath);
  } else if (ext === '.txt' || (mimetype && mimetype.includes('text'))) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseText(content);
  } else {
    return {
      fileType: 'unknown',
      fileName: path.basename(filePath),
      charCount: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      hasTextLayer: false,
      textSample: ''
    };
  }
}

module.exports = { parsePDF, parseCSV, parseImage, parseText, parseFile };
