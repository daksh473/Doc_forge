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
const module0A_dedup = require('../services/module0A_dedup');
const mfgWebEnricher = require('../services/mfgWebEnricher');
const digitalAssetsManager = require('../services/digitalAssetsManager');
const evaluationEngine = require('../services/evaluationEngine');
const taxonomyClassifier = require('../services/taxonomyClassifier');

const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

const jobsHistory = [];
const MAX_JOBS = 50;

function addJobToHistory(job) {
    jobsHistory.unshift(job);
    if (jobsHistory.length > MAX_JOBS) {
        jobsHistory.pop();
    }
}

function extractRowSummary(jobId, extraction) {
    if (!extraction) return null;
    const pId = extraction.product_identification || {};
    const attrs = extraction.attributes || extraction.raw_specifications || [];

    const sizeAttr = attrs.find(a => {
        const name = (a.attribute_name || a.attribute || a.label || "").toLowerCase();
        return name.includes("size") || name.includes("dimension");
    });
    const materialAttr = attrs.find(a => {
        const name = (a.attribute_name || a.attribute || a.label || "").toLowerCase();
        return name.includes("material");
    });

    return {
        jobId: jobId,
        gtin: pId.gtin || extraction.gtin || null,
        mfg: pId.manufacturer || extraction.mfg || extraction.manufacturer || "",
        mpn: pId.part_number || pId.model_number || extraction.mpn || extraction.model_number || "",
        title: pId.raw_title || extraction.title || extraction.product_title?.standardized || "",
        material: materialAttr ? (materialAttr.raw_value || materialAttr.standardized_value) : "",
        size: sizeAttr ? (sizeAttr.raw_value || sizeAttr.standardized_value) : "",
        source_type: "pipeline_history"
    };
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

router.get('/demo/products', (req, res) => {
    const mockProducts = require('../data/mockProducts');
    res.json(mockProducts.getProducts());
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
        const result = await module0A_dedup.evaluateDeDuplication(candidatePairs);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/module0a', async (req, res, next) => {
    try {
        const { rawBatchRows } = req.body;
        const result = await module0A_dedup.runModule0A(rawBatchRows);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/python_pipeline', async (req, res, next) => {
    try {
        const { exec } = require('child_process');
        const path = require('path');
        const scriptPath = path.join(__dirname, '..', '..', 'python_pipeline', 'unilog_pipeline.py');
        exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: error.message, stderr });
            }
            res.json({ status: "success", output: stdout });
        });
    } catch (err) {
        next(err);
    }
});

router.post('/web-enrich', async (req, res, next) => {
    try {
        const { productData } = req.body;
        const result = await mfgWebEnricher.enrichFromManufacturerWeb(productData);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/digital-assets', async (req, res, next) => {
    try {
        const { productData } = req.body;
        const result = await digitalAssetsManager.processDigitalAssets(productData);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.all(['/evaluate', '/evaluation/benchmark'], async (req, res, next) => {
    try {
        const productData = req.body.productData || {};
        const result = evaluationEngine.evaluateRecord(productData);
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

        let originalRow = null;
        if (req.body.originalRow) {
            try {
                originalRow = typeof req.body.originalRow === 'string' ? JSON.parse(req.body.originalRow) : req.body.originalRow;
            } catch (e) {
                originalRow = null;
            }
        }

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

        // ── MODULE 0A: DE-DUPLICATION & MERGE (runs after extraction with real attributes) ──
        const mod0aStart = Date.now();
        let mod0aResult;

        const currentSummary = extractRowSummary(jobId, extraction);
        const historySummaries = jobsHistory.map(job => {
            const histExtraction = job.stages?.extract?.result;
            return extractRowSummary(job.jobId, histExtraction);
        }).filter(Boolean);

        if (historySummaries.length === 0) {
            // First product ever processed in session — nothing to compare against
            mod0aResult = {
                status: "NO_COMPARISON_DATA",
                no_comparison_data_available: true,
                message: "First product processed in session. No historical jobs available for de-duplication comparison.",
                pipeline_id: jobId,
                possible_duplicate_of: null,
                module0a_summary: {
                    total_batch_rows_input: 1,
                    candidate_pairs_prefiltered: 0,
                    confirmed_duplicates: 0,
                    auto_merged_count: 0,
                    review_queue_count: 0,
                    final_deduplicated_rows_count: 1,
                    row_reduction_count: 0,
                    reduction_percentage: "0%"
                }
            };
        } else {
            const comparisonBatch = [currentSummary, ...historySummaries];
            mod0aResult = await module0A_dedup.runModule0A(comparisonBatch);

            // Check if current upload (index 0) was grouped / matched with any historical row
            const dupEval = mod0aResult.stage2_evaluations?.find(e => 
                (e.row_index_a === 0 || e.row_index_b === 0) && e.is_duplicate
            );

            if (dupEval) {
                const matchIndex = dupEval.row_index_a === 0 ? dupEval.row_index_b : dupEval.row_index_a;
                const matchedJob = comparisonBatch[matchIndex];
                mod0aResult.possible_duplicate_of = matchedJob.jobId;
                mod0aResult.duplicate_match_details = {
                    matched_job_id: matchedJob.jobId,
                    matched_mpn: matchedJob.mpn,
                    matched_mfg: matchedJob.mfg,
                    matched_title: matchedJob.title,
                    match_score: dupEval.composite_score,
                    recommendation: "Flagged for human review — potential duplicate of previously cataloged job " + matchedJob.jobId
                };
            } else {
                mod0aResult.possible_duplicate_of = null;
            }
        }
        const mod0aEnd = Date.now();

        const normalizeStart = Date.now();
        const normalization = await normalizer.normalizeData(extraction, classification);
        const normalizeEnd = Date.now();

        const currentAttrSource = (normalization && Array.isArray(normalization.attributes) && normalization.attributes.length > 0)
            ? normalization 
            : extraction;

        const lovStart = Date.now();
        const lovMatching = await lovEngine.matchLOV(currentAttrSource, "valves.ball");
        const lovEnd = Date.now();

        const mfgStart = Date.now();
        const mfgNormal = await mfgNormalizer.normalizeMfgBrand({
            Mfg_Part_Num: originalRow?.Mfg_Part_Num || extraction?.product_identification?.part_number || "",
            E1_Brand: originalRow?.E1_Brand || "-- Unbranded --",
            Unilog_Brand: originalRow?.Unilog_Brand || "-- No Unilog Brand --",
            DIB_Brand: originalRow?.DIB_Brand || "-- No DIB Brand --",
            Part_Manuf: originalRow?.Part_Manuf || extraction?.product_identification?.manufacturer || "",
            Part_Desc: originalRow?.Part_Desc || extraction?.product_identification?.raw_title || ""
        });
        const mfgEnd = Date.now();

        const uomStart = Date.now();
        const uomValid = await uomValidator.validateUOM(currentAttrSource);
        const uomEnd = Date.now();

        const fractionStart = Date.now();
        const fractionConverted = await fractionConverter.convertFractions(currentAttrSource);
        const fractionEnd = Date.now();

        const taxonomyStart = Date.now();
        const taxonomyResult = await taxonomyClassifier.classifyTaxonomy(extraction, originalRow);
        const taxonomyEnd = Date.now();

        const enrichStart = Date.now();
        const enrichment = await enricher.enrichData(extraction, classification);
        const enrichEnd = Date.now();
        
        const validateStart = Date.now();
        const validation = await validator.validateData(normalization, taxonomyResult);
        const validateEnd = Date.now();
        
        const groundStart = Date.now();
        const grounding = await grounder.groundData(validation, chunking, extraction);
        const groundEnd = Date.now();
        
        const reasonStart = Date.now();
        const reasoning = await reasoner.reasonData(extraction, validation, grounding);
        const reasonEnd = Date.now();
        
        const catalogStart = Date.now();
        const cataloging = await cataloger.catalogData(extraction, taxonomyResult, originalRow);
        const catalogEnd = Date.now();
        
        const scoreStart = Date.now();
        const score = await scorer.scoreData(extraction, taxonomyResult, normalization, validation, cataloging);
        const scoreEnd = Date.now();

        const webEnrichStart = Date.now();
        extraction.mfg = mfgNormal?.canonical_manufacturer?.MANUFACTURER_NAME || extraction.mfg;
        extraction.brand = mfgNormal?.canonical_brand?.BRAND_NAME || extraction.brand;
        const webEnrichment = await mfgWebEnricher.enrichFromManufacturerWeb(extraction);
        const webEnrichEnd = Date.now();

        const assetsStart = Date.now();
        const digitalAssets = await digitalAssetsManager.processDigitalAssets(extraction);
        const assetsEnd = Date.now();

        const evalStart = Date.now();
        const evaluation = evaluationEngine.evaluateRecord(cataloging);
        const evalEnd = Date.now();
        
        const dashboardStart = Date.now();
        const dashboard = await dashboardPrep.prepareDashboard(chunking, cataloging, score, reasoning);
        const dashboardEnd = Date.now();
        
        const totalEnd = Date.now();

        const result = {
            jobId,
            filename,
            originalRow,
            taxonomyResult,
            stages: {
                upload: { result: metadata, duration_ms: uploadEnd - uploadStart },
                module0a: { result: mod0aResult, duration_ms: mod0aEnd - mod0aStart },
                classify: { result: classification, duration_ms: classifyEnd - classifyStart },
                preprocess: { result: preprocessing, duration_ms: preprocessEnd - preprocessStart },
                chunk: { result: chunking, duration_ms: chunkEnd - chunkStart },
                extract: { result: extraction, duration_ms: extractEnd - extractStart },
                taxonomy: { result: taxonomyResult, duration_ms: taxonomyEnd - taxonomyStart },
                normalize: { result: normalization, duration_ms: normalizeEnd - normalizeStart },
                lov: { result: lovMatching, duration_ms: lovEnd - lovStart },
                mfg: { result: mfgNormal, duration_ms: mfgEnd - mfgStart },
                uom: { result: uomValid, duration_ms: uomEnd - uomStart },
                fraction: { result: fractionConverted, duration_ms: fractionEnd - fractionStart },
                dedup: { result: mod0aResult, duration_ms: mod0aEnd - mod0aStart },
                enrich: { result: enrichment, duration_ms: enrichEnd - enrichStart },
                validate: { result: validation, duration_ms: validateEnd - validateStart },
                ground: { result: grounding, duration_ms: groundEnd - groundStart },
                reason: { result: reasoning, duration_ms: reasonEnd - reasonStart },
                catalog: { result: cataloging, duration_ms: catalogEnd - catalogStart },
                score: { result: score, duration_ms: scoreEnd - scoreStart },
                webEnrichment: { result: webEnrichment, duration_ms: webEnrichEnd - webEnrichStart },
                digitalAssets: { result: digitalAssets, duration_ms: assetsEnd - assetsStart },
                evaluation: { result: evaluation, duration_ms: evalEnd - evalStart },
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

router.all(['/export/batch', '/export/arranged'], async (req, res, next) => {
    try {
        let jobsToExport = [];
        if (req.body && Array.isArray(req.body.jobIds) && req.body.jobIds.length > 0) {
            jobsToExport = jobsHistory.filter(j => req.body.jobIds.includes(j.jobId));
        } else {
            jobsToExport = jobsHistory;
        }

        if (!jobsToExport || jobsToExport.length === 0) {
            return res.status(400).json({ error: "no processed jobs available to export" });
        }

        const csvString = exporter.generateBatchCSV(jobsToExport);
        const filename = `arranged_catalog_export_${Date.now()}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(csvString);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
