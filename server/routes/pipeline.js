const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fileParser = require('../services/fileParser');
const classifier = require('../services/classifier');
const preprocessor = require('../services/preprocessor');
const chunker = require('../services/chunker');
const extractor = require('../services/extractor');
const enricher = require('../services/enricher');
const cataloger = require('../services/cataloger');

const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 } });

const jobsHistory = [];
const MAX_JOBS = 50;

function addJobToHistory(job) {
    jobsHistory.unshift(job);
    if (jobsHistory.length > MAX_JOBS) {
        jobsHistory.pop();
    }
}

router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });
        const metadata = await fileParser.parseFile(req.file.path, req.file.mimetype);
        const fileId = uuidv4();
        res.json({ fileId, metadata });
    } catch (err) {
        next(err);
    }
});

router.post('/classify', async (req, res, next) => {
    try {
        const { fileId, metadata } = req.body;
        if (!metadata) return res.status(400).json({ error: 'Metadata required' });
        const classification = classifier.classifyDocument(metadata);
        res.json(classification);
    } catch (err) {
        next(err);
    }
});

router.post('/preprocess', async (req, res, next) => {
    try {
        const { metadata, classification } = req.body;
        if (!metadata || !classification) return res.status(400).json({ error: 'Metadata and classification required' });
        const preprocessing = await preprocessor.preprocessData(metadata, classification);
        res.json(preprocessing);
    } catch (err) {
        next(err);
    }
});

router.post('/chunk', async (req, res, next) => {
    try {
        const { preprocessing } = req.body;
        if (!preprocessing) return res.status(400).json({ error: 'Preprocessing required' });
        const chunking = await chunker.chunkData(preprocessing);
        res.json(chunking);
    } catch (err) {
        next(err);
    }
});

router.post('/extract', async (req, res, next) => {
    try {
        const { chunking } = req.body;
        if (!chunking) return res.status(400).json({ error: 'Chunking payload required' });
        const extraction = await extractor.extractData(chunking);
        res.json(extraction);
    } catch (err) {
        next(err);
    }
});

router.post('/enrich', async (req, res, next) => {
    try {
        const { fileId, extraction, classification } = req.body;
        if (!extraction || !classification) return res.status(400).json({ error: 'Extraction and classification required' });
        const enrichment = await enricher.enrichData(extraction, classification);
        res.json(enrichment);
    } catch (err) {
        next(err);
    }
});

router.post('/catalog', async (req, res, next) => {
    try {
        const { extraction, taxonomy } = req.body;
        if (!extraction || !taxonomy) return res.status(400).json({ error: 'Extraction and taxonomy required' });
        const cataloging = await cataloger.catalogData(extraction, taxonomy);
        res.json(cataloging);
    } catch (err) {
        next(err);
    }
});

router.post('/pipeline/full', upload.single('file'), async (req, res, next) => {
    try {
        const startTime = Date.now();
        const jobId = uuidv4();
        let metadata, filename;

        const uploadStart = Date.now();
        if (req.file) {
            metadata = await fileParser.parseFile(req.file.path, req.file.mimetype);
            filename = req.file.originalname;
        } else if (req.body.text) {
            metadata = await fileParser.parseText(req.body.text);
            filename = 'text_input.txt';
        } else {
            return res.status(400).json({ error: 'File or text required' });
        }
        const uploadEnd = Date.now();

        const classifyStart = Date.now();
        const classification = classifier.classifyDocument(metadata);
        const classifyEnd = Date.now();

        const preprocessStart = Date.now();
        const preprocessing = await preprocessor.preprocessData(metadata, classification);
        const preprocessEnd = Date.now();

        const chunkStart = Date.now();
        const chunking = await chunker.chunkData(preprocessing);
        const chunkEnd = Date.now();

        const extractStart = Date.now();
        const extraction = await extractor.extractData(chunking);
        const extractEnd = Date.now();

        const enrichStart = Date.now();
        const enrichment = await enricher.enrichData(extraction, classification);
        const enrichEnd = Date.now();
        
        const catalogStart = Date.now();
        const cataloging = await cataloger.catalogData(extraction, enrichment);
        const catalogEnd = Date.now();
        
        const totalEnd = Date.now();

        const result = {
            jobId,
            filename,
            stages: {
                upload: { result: metadata, duration_ms: uploadEnd - uploadStart },
                classify: { result: classification, duration_ms: classifyEnd - classifyStart },
                preprocess: { result: preprocessing, duration_ms: preprocessEnd - preprocessStart },
                chunk: { result: chunking, duration_ms: chunkEnd - chunkStart },
                extract: { result: extraction, duration_ms: extractEnd - extractStart },
                enrich: { result: enrichment, duration_ms: enrichEnd - enrichStart },
                catalog: { result: cataloging, duration_ms: catalogEnd - catalogStart }
            },
            total_duration_ms: totalEnd - startTime,
            timestamp: new Date().toISOString()
        };

        addJobToHistory(result);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.get('/history', (req, res) => {
    res.json(jobsHistory.slice(0, 10));
});

module.exports = router;
