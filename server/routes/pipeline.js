const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fileParser = require('../services/fileParser');
const classifier = require('../services/classifier');
const preprocessor = require('../services/preprocessor');
const chunker = require('../services/chunker');
const extractor = require('../services/extractor');
const enricher = require('../services/enricher');
const validator = require('../services/validator');
const grounder = require('../services/grounder');
const reasoner = require('../services/reasoner');
const cataloger = require('../services/cataloger');
const scorer = require('../services/scorer');
const dashboardPrep = require('../services/dashboard');
const normalizer = require('../services/normalizer');
const reviewer = require('../services/reviewer');
const exporter = require('../services/exporter');
const lovEngine = require('../services/lovEngine');
const mfgNormalizer = require('../services/mfgNormalizer');
const uomValidator = require('../services/uomValidator');
const fractionConverter = require('../services/fractionConverter');
const dedupEngine = require('../services/dedupEngine');

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

router.post('/normalize', async (req, res, next) => {
    try {
        const { extraction, classification } = req.body;
        if (!extraction || !classification) return res.status(400).json({ error: 'Extraction and classification required' });
        const normalization = await normalizer.normalizeData(extraction, classification);
        res.json(normalization);
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

router.post('/validate', async (req, res, next) => {
    try {
        const { normalization, taxonomy } = req.body;
        if (!normalization || !taxonomy) return res.status(400).json({ error: 'Normalization and taxonomy required' });
        const validation = await validator.validateData(normalization, taxonomy);
        res.json(validation);
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

router.post('/score', async (req, res, next) => {
    try {
        const { extraction, taxonomy, normalization, validation, cataloging } = req.body;
        if (!extraction || !taxonomy) return res.status(400).json({ error: 'Data required for scoring' });
        const score = await scorer.scoreData(extraction, taxonomy, normalization, validation, cataloging);
        res.json(score);
    } catch (err) {
        next(err);
    }
});

router.post('/ground', async (req, res, next) => {
    try {
        const { validation, chunking } = req.body;
        if (!validation) return res.status(400).json({ error: 'Validation data required for grounding' });
        const grounding = await grounder.groundData(validation, chunking);
        res.json(grounding);
    } catch (err) {
        next(err);
    }
});

router.post('/reason', async (req, res, next) => {
    try {
        const { extraction, validation, grounding } = req.body;
        if (!grounding) return res.status(400).json({ error: 'Grounding data required for reasoning' });
        const reasoning = await reasoner.reasonData(extraction, validation, grounding);
        res.json(reasoning);
    } catch (err) {
        next(err);
    }
});

router.post('/dashboard', async (req, res, next) => {
    try {
        const { chunking, cataloging, scoring, reasoning } = req.body;
        if (!cataloging) return res.status(400).json({ error: 'Catalog data required for dashboard' });
        const dashboard = await dashboardPrep.prepareDashboard(chunking, cataloging, scoring, reasoning);
        res.json(dashboard);
    } catch (err) {
        next(err);
    }
});

router.post('/review', async (req, res, next) => {
    try {
        const { dashboard, humanEdits } = req.body;
        if (!dashboard || !humanEdits) return res.status(400).json({ error: 'Dashboard and humanEdits required' });
        const reviewResult = await reviewer.processReview(dashboard, humanEdits);
        const exportResult = await exporter.generateExports(reviewResult, "all");
        reviewResult.exports = exportResult.exports;
        reviewResult.export_summary = exportResult.export_summary;
        res.json(reviewResult);
    } catch (err) {
        next(err);
    }
});

router.post('/export', async (req, res, next) => {
    try {
        const { approvedData, targetFormats } = req.body;
        if (!approvedData) return res.status(400).json({ error: 'approvedData required for export' });
        const result = await exporter.generateExports(approvedData, targetFormats || "all");
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/lov', async (req, res, next) => {
    try {
        const { extraction, classpath } = req.body;
        const result = await lovEngine.matchLOV(extraction, classpath || "valves.ball");
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/mfg', async (req, res, next) => {
    try {
        const { inputSignals } = req.body;
        const result = await mfgNormalizer.normalizeMfgBrand(inputSignals);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/uom', async (req, res, next) => {
    try {
        const { normalizedData } = req.body;
        const result = await uomValidator.validateUOM(normalizedData);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/fraction', async (req, res, next) => {
    try {
        const { normalizedData } = req.body;
        const result = await fractionConverter.convertFractions(normalizedData);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/dedup', async (req, res, next) => {
    try {
        const { candidatePairs } = req.body;
        const result = await dedupEngine.evaluateDeDuplication(candidatePairs);
        res.json(result);
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

        const normalizeStart = Date.now();
        const normalization = await normalizer.normalizeData(extraction, classification);
        const normalizeEnd = Date.now();

        const lovStart = Date.now();
        const lovMatching = await lovEngine.matchLOV(extraction, "valves.ball");
        const lovEnd = Date.now();

        const mfgStart = Date.now();
        const mfgNormal = await mfgNormalizer.normalizeMfgBrand({
            Mfg_Part_Num: extraction?.product_identification?.part_number || "PDSH4816AF",
            E1_Brand: "-- No E1 Brand --",
            Unilog_Brand: "-- Unbranded --",
            Part_Manuf: extraction?.product_identification?.manufacturer || "Emerson"
        });
        const mfgEnd = Date.now();

        const uomStart = Date.now();
        const uomValid = await uomValidator.validateUOM(normalization || extraction);
        const uomEnd = Date.now();

        const fractionStart = Date.now();
        const fractionConverted = await fractionConverter.convertFractions(normalization || extraction);
        const fractionEnd = Date.now();

        const dedupStart = Date.now();
        const dedupEvaluated = await dedupEngine.evaluateDeDuplication({ pipeline_id: jobId });
        const dedupEnd = Date.now();

        const enrichStart = Date.now();
        const enrichment = await enricher.enrichData(extraction, classification);
        const enrichEnd = Date.now();
        
        const validateStart = Date.now();
        const validation = await validator.validateData(normalization, enrichment);
        const validateEnd = Date.now();
        
        const groundStart = Date.now();
        const grounding = await grounder.groundData(validation, chunking);
        const groundEnd = Date.now();
        
        const reasonStart = Date.now();
        const reasoning = await reasoner.reasonData(extraction, validation, grounding);
        const reasonEnd = Date.now();
        
        const catalogStart = Date.now();
        const cataloging = await cataloger.catalogData(extraction, enrichment);
        const catalogEnd = Date.now();
        
        const scoreStart = Date.now();
        const scoring = await scorer.scoreData(extraction, enrichment, normalization, validation, cataloging);
        const scoreEnd = Date.now();
        
        const dashboardStart = Date.now();
        const dashboard = await dashboardPrep.prepareDashboard(chunking, cataloging, scoring, reasoning);
        const dashboardEnd = Date.now();
        
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
                normalize: { result: normalization, duration_ms: normalizeEnd - normalizeStart },
                lov: { result: lovMatching, duration_ms: lovEnd - lovStart },
                mfg: { result: mfgNormal, duration_ms: mfgEnd - mfgStart },
                uom: { result: uomValid, duration_ms: uomEnd - uomStart },
                fraction: { result: fractionConverted, duration_ms: fractionEnd - fractionStart },
                dedup: { result: dedupEvaluated, duration_ms: dedupEnd - dedupStart },
                enrich: { result: enrichment, duration_ms: enrichEnd - enrichStart },
                validate: { result: validation, duration_ms: validateEnd - validateStart },
                ground: { result: grounding, duration_ms: groundEnd - groundStart },
                reason: { result: reasoning, duration_ms: reasonEnd - reasonStart },
                catalog: { result: cataloging, duration_ms: catalogEnd - catalogStart },
                score: { result: scoring, duration_ms: scoreEnd - scoreStart },
                dashboard: { result: dashboard, duration_ms: dashboardEnd - dashboardStart }
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
