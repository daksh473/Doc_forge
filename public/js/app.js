/**
 * DocForge — Main Application Logic
 * Orchestrates file upload, pipeline execution via backend API,
 * and result rendering across all tabs.
 */

window.DocForge = {
  state: {
    currentFile: null,
    currentText: null,
    pipelineResult: null,
    history: [],
    activeTab: 'classification'
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.loadHistory();
    DocForgeAnimations.initPipelineConnectors();
  },

  cacheDOM() {
    this.els = {
      uploadSection: document.getElementById('upload-section'),
      pipelineSection: document.getElementById('pipeline-section'),
      resultsSection: document.getElementById('results-section'),

      dropZone: document.getElementById('drop-zone'),
      uploadPrompt: document.getElementById('upload-prompt'),
      uploadPreview: document.getElementById('upload-preview'),
      fileInput: document.getElementById('file-input'),
      previewName: document.getElementById('preview-name'),
      previewSize: document.getElementById('preview-size'),
      clearFileBtn: document.getElementById('clear-file'),
      textInput: document.getElementById('text-input'),
      startBtn: document.getElementById('start-pipeline-btn'),

      slides: document.querySelectorAll('.carousel-slide'),
      carouselTrack: document.getElementById('carousel-track'),
      carouselPrev: document.getElementById('carousel-prev'),
      carouselNext: document.getElementById('carousel-next'),
      carouselTitle: document.getElementById('carousel-title'),
      carouselIndicators: document.getElementById('carousel-indicators'),

      historyBtn: document.getElementById('history-btn'),
      closeHistoryBtn: document.getElementById('close-history'),
      historySidebar: document.getElementById('history-sidebar'),
      sidebarOverlay: document.getElementById('sidebar-overlay'),
      historyList: document.getElementById('history-list'),

      toastContainer: document.getElementById('toast-container')
    };
  },

  bindEvents() {
    // ── Drag & Drop ──
    this.els.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.els.dropZone.classList.add('dragover');
    });
    this.els.dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this.els.dropZone.classList.remove('dragover');
    });
    this.els.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.els.dropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    // ── File Input ──
    this.els.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelect(e.target.files[0]);
      }
    });

    // ── Clear File ──
    this.els.clearFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearFile();
    });

    // ── Text Input ──
    this.els.textInput.addEventListener('input', (e) => {
      this.state.currentText = e.target.value.trim() || null;
      this.updateStartBtnState();
    });

    // ── Start Pipeline ──
    this.els.startBtn.addEventListener('click', () => this.runPipeline());

    // Carousel initialized at bottom of bindEvents

    // ── History Sidebar ──
    this.els.historyBtn.addEventListener('click', () => this.toggleHistory(true));
    this.els.closeHistoryBtn.addEventListener('click', () => this.toggleHistory(false));
    this.els.sidebarOverlay.addEventListener('click', () => this.toggleHistory(false));
    this.initCarousel();

    // ── JSON Viewer Controls ──
    // ── JSON Viewer Controls ──
    document.getElementById('expand-preprocess')?.addEventListener('click', () => this.viewers?.preprocess?.expandAll());
    document.getElementById('collapse-preprocess')?.addEventListener('click', () => this.viewers?.preprocess?.collapseAll());
    document.getElementById('search-preprocess')?.addEventListener('input', (e) => this.viewers?.preprocess?.search(e.target.value));

    document.getElementById('expand-chunk')?.addEventListener('click', () => this.viewers?.chunk?.expandAll());
    document.getElementById('collapse-chunk')?.addEventListener('click', () => this.viewers?.chunk?.collapseAll());
    document.getElementById('search-chunk')?.addEventListener('input', (e) => this.viewers?.chunk?.search(e.target.value));

    document.getElementById('expand-extract')?.addEventListener('click', () => this.viewers?.extract?.expandAll());
    document.getElementById('collapse-extract')?.addEventListener('click', () => this.viewers?.extract?.collapseAll());
    document.getElementById('search-extract')?.addEventListener('input', (e) => this.viewers?.extract?.search(e.target.value));

    document.getElementById('expand-enrich')?.addEventListener('click', () => this.viewers?.enrich?.expandAll());
    document.getElementById('collapse-enrich')?.addEventListener('click', () => this.viewers?.enrich?.collapseAll());
    document.getElementById('search-enrich')?.addEventListener('input', (e) => this.viewers?.enrich?.search(e.target.value));

    document.getElementById('expand-normalize')?.addEventListener('click', () => this.viewers?.normalize?.expandAll());
    document.getElementById('collapse-normalize')?.addEventListener('click', () => this.viewers?.normalize?.collapseAll());
    document.getElementById('search-normalize')?.addEventListener('input', (e) => this.viewers?.normalize?.search(e.target.value));

    document.getElementById('expand-lov')?.addEventListener('click', () => this.viewers?.lov?.expandAll());
    document.getElementById('collapse-lov')?.addEventListener('click', () => this.viewers?.lov?.collapseAll());
    document.getElementById('search-lov')?.addEventListener('input', (e) => this.viewers?.lov?.search(e.target.value));

    document.getElementById('expand-validate')?.addEventListener('click', () => this.viewers?.validate?.expandAll());
    document.getElementById('collapse-validate')?.addEventListener('click', () => this.viewers?.validate?.collapseAll());
    document.getElementById('search-validate')?.addEventListener('input', (e) => this.viewers?.validate?.search(e.target.value));

    document.getElementById('expand-catalog')?.addEventListener('click', () => this.viewers?.catalog?.expandAll());
    document.getElementById('collapse-catalog')?.addEventListener('click', () => this.viewers?.catalog?.collapseAll());
    document.getElementById('search-catalog')?.addEventListener('input', (e) => this.viewers?.catalog?.search(e.target.value));

    document.getElementById('expand-score')?.addEventListener('click', () => this.viewers?.scoring?.expandAll());
    document.getElementById('collapse-score')?.addEventListener('click', () => this.viewers?.scoring?.collapseAll());

    document.getElementById('expand-ground')?.addEventListener('click', () => this.viewers?.grounding?.expandAll());
    document.getElementById('collapse-ground')?.addEventListener('click', () => this.viewers?.grounding?.collapseAll());

    document.getElementById('expand-reason')?.addEventListener('click', () => this.viewers?.reasoning?.expandAll());
    document.getElementById('collapse-reason')?.addEventListener('click', () => this.viewers?.reasoning?.collapseAll());

    document.getElementById('expand-dashboard')?.addEventListener('click', () => this.viewers?.dashboard?.expandAll());
    document.getElementById('collapse-dashboard')?.addEventListener('click', () => this.viewers?.dashboard?.collapseAll());

    document.getElementById('expand-approval')?.addEventListener('click', () => this.viewers?.approval?.expandAll());
    document.getElementById('collapse-approval')?.addEventListener('click', () => this.viewers?.approval?.collapseAll());

    document.getElementById('btn-simulate-review')?.addEventListener('click', () => this.submitHumanReview());

    // ── Export Controls ──
    document.getElementById('select-export-format')?.addEventListener('change', () => this.updateExportView());
    document.getElementById('btn-download-json')?.addEventListener('click', () => this.downloadExport());
    document.getElementById('btn-copy-json')?.addEventListener('click', () => {
      const text = document.getElementById('export-textarea').value;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Payload copied to clipboard', 'success');
      });
    });

    // ── Initial tab indicator ──
    setTimeout(() => this.updateTabIndicator(this.els.tabs[0]), 100);
  },

  // ─────────────────────────────────────────────────────
  // FILE HANDLING
  // ─────────────────────────────────────────────────────

  handleFileSelect(file) {
    const validTypes = ['.pdf', '.csv', '.jpg', '.jpeg', '.png', '.txt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(ext) && !file.type.includes('text') && !file.type.includes('image')) {
      this.showToast('Unsupported file type — use PDF, CSV, Image, or TXT', 'error');
      DocForgeAnimations.shakeElement(this.els.dropZone);
      return;
    }

    this.state.currentFile = file;
    this.els.previewName.textContent = file.name;
    this.els.previewSize.textContent = this.formatFileSize(file.size);

    // Set icon based on file type
    const iconEl = document.querySelector('.preview-icon');
    if (iconEl) {
      if (ext === '.pdf') iconEl.textContent = '📕';
      else if (ext === '.csv') iconEl.textContent = '📊';
      else if (['.jpg', '.jpeg', '.png'].includes(ext)) iconEl.textContent = '🖼️';
      else iconEl.textContent = '📄';
    }

    this.els.uploadPrompt.classList.add('hidden');
    this.els.uploadPreview.classList.remove('hidden');

    // Clear text input when file is selected
    this.els.textInput.value = '';
    this.state.currentText = null;

    this.updateStartBtnState();
  },

  clearFile() {
    this.state.currentFile = null;
    this.els.fileInput.value = '';
    this.els.uploadPrompt.classList.remove('hidden');
    this.els.uploadPreview.classList.add('hidden');
    this.updateStartBtnState();
  },

  updateStartBtnState() {
    const canStart = this.state.currentFile || this.state.currentText;
    this.els.startBtn.disabled = !canStart;
  },

  // ─────────────────────────────────────────────────────
  // PIPELINE EXECUTION
  // ─────────────────────────────────────────────────────

  async runPipeline() {
    if (!this.state.currentFile && !this.state.currentText) return;

    // Lock UI
    this.els.startBtn.disabled = true;
    this.els.startBtn.textContent = 'Processing...';

    // Show pipeline, hide old results
    this.els.pipelineSection.classList.remove('hidden');
    this.els.resultsSection.classList.add('hidden');

    // Reset carousel
    const approvalSlide = document.getElementById('tab-approval');
    if (approvalSlide) approvalSlide.style.display = 'none';
    this.renderCarouselIndicators();
    this.goToSlide(0);

    // Reset all stages to idle
    DocForgeAnimations.initPipelineConnectors();
    for (let i = 0; i < 13; i++) {
      DocForgeAnimations.setStageState(i, 'idle');
      document.getElementById(`duration-${i}`).textContent = '--';
    }

    // Start stage 0 (upload) immediately
    DocForgeAnimations.setStageState(0, 'processing');

    try {
      // Build request
      let fetchOptions;
      let filename;

      if (this.state.currentFile) {
        const formData = new FormData();
        formData.append('file', this.state.currentFile);
        fetchOptions = { method: 'POST', body: formData };
        filename = this.state.currentFile.name;
      } else {
        fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: this.state.currentText })
        };
        filename = 'Pasted Text';
      }

      // Call the backend pipeline API
      const response = await fetch('/api/pipeline/full', fetchOptions);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      // ── Animate stages sequentially using actual durations ──
      const stages = result.stages;
      const stageKeys = ['upload', 'classify', 'preprocess', 'chunk', 'extract', 'enrich'];

      // Stage 0: Upload — already processing, mark complete
      DocForgeAnimations.setStageState(0, 'complete');
      document.getElementById('duration-0').textContent = this.formatDuration(stages.upload.duration_ms);
      DocForgeAnimations.animateConnector(0, true);

      // Stage 1: Classify
      await this.sleep(400);
      DocForgeAnimations.setStageState(1, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(1, 'complete');
      document.getElementById('duration-1').textContent = this.formatDuration(stages.classify.duration_ms);
      DocForgeAnimations.animateConnector(1, true);

      // Stage 2: Preprocess
      await this.sleep(400);
      DocForgeAnimations.setStageState(2, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(2, 'complete');
      document.getElementById('duration-2').textContent = this.formatDuration(stages.preprocess.duration_ms);
      DocForgeAnimations.animateConnector(2, true);

      // Stage 3: Chunk
      await this.sleep(400);
      DocForgeAnimations.setStageState(3, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(3, 'complete');
      document.getElementById('duration-3').textContent = this.formatDuration(stages.chunk.duration_ms);
      DocForgeAnimations.animateConnector(3, true);

      // Stage 4: Extract
      await this.sleep(400);
      DocForgeAnimations.setStageState(4, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(4, 'complete');
      document.getElementById('duration-4').textContent = this.formatDuration(stages.extract.duration_ms);
      DocForgeAnimations.animateConnector(4, true);

      // Stage 5: Normalize
      await this.sleep(400);
      DocForgeAnimations.setStageState(5, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(5, 'complete');
      document.getElementById('duration-5').textContent = this.formatDuration(stages.normalize.duration_ms);
      DocForgeAnimations.animateConnector(5, true);

      // Stage 6: Enrich
      await this.sleep(400);
      DocForgeAnimations.setStageState(6, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(6, 'complete');
      document.getElementById('duration-6').textContent = this.formatDuration(stages.enrich.duration_ms);
      DocForgeAnimations.animateConnector(6, true);

      // Stage 7: Validate
      await this.sleep(400);
      DocForgeAnimations.setStageState(7, 'processing');
      await this.sleep(400);
      let valStatus = 'complete';
      if (stages.validate.result?.overall_validation_status === 'CRITICAL_BLOCK') valStatus = 'error';
      else if (stages.validate.result?.overall_validation_status === 'WARNING') valStatus = 'warning';
      DocForgeAnimations.setStageState(7, valStatus);
      document.getElementById('duration-7').textContent = this.formatDuration(stages.validate.duration_ms);
      DocForgeAnimations.animateConnector(7, true);

      // Stage 8: Ground
      await this.sleep(400);
      DocForgeAnimations.setStageState(8, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(8, 'complete');
      document.getElementById('duration-8').textContent = this.formatDuration(stages.ground.duration_ms);
      DocForgeAnimations.animateConnector(8, true);

      // Stage 9: Reason
      await this.sleep(400);
      DocForgeAnimations.setStageState(9, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(9, 'complete');
      document.getElementById('duration-9').textContent = this.formatDuration(stages.reason.duration_ms);
      DocForgeAnimations.animateConnector(9, true);

      // Stage 10: Catalog
      await this.sleep(400);
      DocForgeAnimations.setStageState(10, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(10, 'complete');
      document.getElementById('duration-10').textContent = this.formatDuration(stages.catalog.duration_ms);
      DocForgeAnimations.animateConnector(10, true);

      // Stage 11: Score
      await this.sleep(400);
      DocForgeAnimations.setStageState(11, 'processing');
      await this.sleep(400);
      let scoreStatus = 'complete';
      if (stages.score.result?.final_score?.confidence_color === 'red') scoreStatus = 'error';
      else if (stages.score.result?.final_score?.confidence_color === 'amber') scoreStatus = 'warning';
      DocForgeAnimations.setStageState(11, scoreStatus);
      document.getElementById('duration-11').textContent = this.formatDuration(stages.score.duration_ms);
      DocForgeAnimations.animateConnector(11, true);

      // Stage 12: Dashboard
      await this.sleep(400);
      DocForgeAnimations.setStageState(12, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(12, 'complete');
      document.getElementById('duration-12').textContent = this.formatDuration(stages.dashboard.duration_ms);

      // Build a normalized view model from the API response
      const viewModel = this.buildViewModel(result);
      this.state.pipelineResult = viewModel;

      // Render all result tabs
      this.renderResults(viewModel);

      // Show results and scroll into view
      this.els.resultsSection.classList.remove('hidden');
      await this.sleep(200);
      this.els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Celebrate
      DocForgeAnimations.triggerCompletionEffect();
      this.showToast(`Pipeline complete — ${this.formatDuration(result.total_duration_ms)} total`, 'success');

      // Save to history
      this.addToHistory(viewModel, filename);

    } catch (err) {
      console.error('Pipeline error:', err);
      this.showToast(`Pipeline failed: ${err.message}`, 'error');

      // Mark the furthest incomplete stage as error
      for (let i = 0; i < 13; i++) {
        const card = document.getElementById(`stage-${i}`);
        if (card && card.classList.contains('processing')) {
          DocForgeAnimations.setStageState(i, 'error');
          break;
        }
      }
    } finally {
      this.els.startBtn.disabled = false;
      this.els.startBtn.textContent = 'Start Processing Pipeline';
    }
  },

  /**
   * Transform the raw API response into a view-model
   * that the rendering functions consume.
   */
  buildViewModel(apiResult) {
    const stages = apiResult.stages;
    const classification = stages.classify.result;
    const preprocessing = stages.preprocess.result;
    const chunking = stages.chunk.result;
    const extraction = stages.extract.result;
    const normalization = stages.normalize ? stages.normalize.result : null;
    const lov = stages.lov ? stages.lov.result : null;
    const enrichment = stages.enrich ? stages.enrich.result : null;
    const validation = stages.validate ? stages.validate.result : null;
    const grounding = stages.ground ? stages.ground.result : null;
    const reasoning = stages.reason ? stages.reason.result : null;
    const cataloging = stages.catalog ? stages.catalog.result : null;
    const scoring = stages.score ? stages.score.result : null;
    const dashboard = stages.dashboard ? stages.dashboard.result : null;
    
    const extSummary = extraction.extraction_summary || {};
    const taxSummary = enrichment.taxonomy_summary || {};
    
    const baseScore = extSummary.tier1_complete ? 100 : 75;
    const score = taxSummary.overall_confidence || baseScore;
    const missingFields = extSummary.tier1_missing || [];

    return {
      jobId: apiResult.jobId,
      filename: apiResult.filename,
      timestamp: apiResult.timestamp,
      total_duration_ms: apiResult.total_duration_ms,

      classification: {
        type: classification.document_type || 'unknown',
        confidence: classification.confidence === 'high' ? 95 : classification.confidence === 'medium' ? 70 : 40,
        confidenceLabel: classification.confidence || 'low',
        parser: classification.recommended_parser || '--',
        fallbackParser: classification.fallback_parser || null,
        reasoning: classification.reason || 'No reasoning provided'
      },

      preprocessing: preprocessing,
      chunking: chunking,
      extraction: extraction,
      normalization: normalization,
      lov: lov,
      enrichment: enrichment,
      validation: validation,
      grounding: grounding,
      reasoning: reasoning,
      cataloging: cataloging,
      scoring: scoring,
      dashboard: dashboard,

      exportJson: JSON.stringify(apiResult, null, 2),

      quality: {
        score: score,
        fields: extSummary.total_attributes_extracted || 0,
        inferred: extSummary.inferred_attributes_count || 0,
        missing: missingFields.length,
        low_confidence: extSummary.review_required_attributes || [],
        missing_fields: missingFields,
        recommendations: taxSummary.taxonomy_notes ? [taxSummary.taxonomy_notes] : [],
        warnings: [
          ...missingFields.map(f => ({
            field: f, message: 'Critical TIER 1 attribute missing', level: 'error'
          })),
          ...(extSummary.conflicts_detected || []).map(f => ({
            field: f, message: 'Data conflict detected across chunks', level: 'warning'
          })),
          ...(extSummary.review_required_attributes || []).map(f => ({
            field: f, message: 'Low confidence — manual review required', level: 'warning'
          }))
        ]
      },

      // Full raw API response for export
      _raw: apiResult
    };
  },

  // ─────────────────────────────────────────────────────
  // RESULT RENDERING
  // ─────────────────────────────────────────────────────

  renderResults(data) {
    this.renderClassification(data.classification);
    this.renderPreprocess(data.preprocessing);
    this.renderChunking(data.chunking);
    if (data.extraction) this.renderExtraction(data.extraction);
    if (data.normalization) this.renderNormalization(data.normalization);
    if (data.lov) this.renderLOV(data.lov);
    if (data.enrichment) this.renderEnrichment(data.enrichment);
    if (data.validation) this.renderValidation(data.validation);
    if (data.grounding) this.renderGrounding(data.grounding);
    if (data.reasoning) this.renderReasoning(data.reasoning);
    if (data.cataloging) this.renderCataloging(data.cataloging);
    if (data.scoring) this.renderScoring(data.scoring);
    if (data.dashboard) this.renderDashboard(data.dashboard);
    this.currentPipelineResult = data;
    this.renderExport(data.exportJson);
  },

  renderClassification(data) {
    // Document type badge with color
    const typeEl = document.getElementById('result-doc-type');
    typeEl.textContent = data.type.replace(/_/g, ' ').toUpperCase();
    typeEl.className = 'badge-large';

    // Color the badge based on type
    const typeColors = {
      'pdf_datasheet': 'var(--accent-cyan)',
      'pdf_unstructured': 'var(--accent-amber)',
      'image_scan': 'var(--accent-blue)',
      'csv_structured': 'var(--accent-emerald)',
      'csv_messy': 'var(--accent-amber)',
      'plain_text': 'var(--text-secondary)'
    };
    typeEl.style.color = typeColors[data.type] || 'var(--accent-cyan)';

    // Confidence bar
    const confBar = document.getElementById('result-class-confidence-bar');
    const confVal = document.getElementById('result-class-confidence-val');
    setTimeout(() => {
      confBar.style.width = `${data.confidence}%`;
    }, 200);
    confVal.textContent = `${data.confidence}% (${data.confidenceLabel})`;

    // Parser
    const parserEl = document.getElementById('result-parser');
    parserEl.textContent = data.parser;
    if (data.fallbackParser) {
      parserEl.textContent += ` (fallback: ${data.fallbackParser})`;
    }

    // Reasoning
    document.getElementById('result-reasoning').textContent = data.reasoning;
  },

  renderPreprocess(data) {
    const container = document.getElementById('json-viewer-preprocess');
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.preprocess = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.preprocess.render();
  },

  renderChunking(data) {
    const container = document.getElementById('json-viewer-chunk');
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.chunk = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.chunk.render();
  },

  renderExtraction(data) {
    const container = document.getElementById('json-viewer-extract');
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.extract = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.extract.render();
  },

  renderNormalization(data) {
    const container = document.getElementById('json-viewer-normalize');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.normalize = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: true,
      showLineNumbers: true
    });
    this.viewers.normalize.render();
  },

  renderLOV(data) {
    const container = document.getElementById('json-viewer-lov');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.lov = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.lov.render();
  },

  renderEnrichment(data) {
    const container = document.getElementById('json-viewer-enrich');
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.enrich = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: true,
      showLineNumbers: true
    });
    this.viewers.enrich.render();
  },

  renderValidation(data) {
    const statusBadge = document.getElementById('val-status-badge');
    const compScore = document.getElementById('val-completeness-score');
    const compGauge = document.getElementById('val-completeness-gauge');
    const critCount = document.getElementById('val-crit-count');
    const warnCount = document.getElementById('val-warn-count');

    // Update status badge
    if (statusBadge) {
      statusBadge.textContent = data.overall_validation_status;
      statusBadge.className = 'badge-large';
      if (data.overall_validation_status === 'CRITICAL_BLOCK') statusBadge.classList.add('bg-danger');
      else if (data.overall_validation_status === 'WARNING') statusBadge.classList.add('bg-warning');
      else statusBadge.classList.add('bg-success');
    }

    // Update completeness
    if (compScore && compGauge && data.completeness_report) {
      const score = data.completeness_report.completeness_score || 0;
      compScore.textContent = `${score}%`;
      const offset = 125 - (125 * score / 100);
      compGauge.style.strokeDashoffset = offset;
      if (score < 50) compGauge.style.stroke = 'var(--accent-rose)';
      else if (score < 80) compGauge.style.stroke = 'var(--accent-amber)';
      else compGauge.style.stroke = 'var(--accent-emerald)';
    }

    // Update issue counts
    if (critCount) critCount.textContent = data.validation_summary?.critical_count || 0;
    if (warnCount) warnCount.textContent = data.validation_summary?.warning_count || 0;

    // JSON Viewer
    const container = document.getElementById('json-viewer-validate');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.validate = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.validate.render();
  },

  renderGrounding(data) {
    if (!data) return;

    // Set stats
    const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || 0; };
    if (data.citation_coverage_report) {
      setT('ground-exact', data.citation_coverage_report.exact_match_count);
      setT('ground-partial', data.citation_coverage_report.partial_match_count);
      setT('ground-context', data.citation_coverage_report.contextual_match_count);
      setT('ground-none', data.citation_coverage_report.inferred_only_count);
      
      const lbl = document.getElementById('grounding-label');
      if (lbl) {
        lbl.textContent = (data.citation_coverage_report.grounding_label || 'Unknown').replace(/_/g, ' ').toUpperCase() + 
                         ' (' + data.citation_coverage_report.overall_grounding_score + ' pts)';
      }
    }

    // Render list
    const listEl = document.getElementById('grounding-list');
    if (listEl && data.citations) {
      listEl.innerHTML = data.citations.map(c => {
        let borderColor = c.citation_level === 'exact_match' ? 'border-emerald-500' :
                          c.citation_level === 'partial_match' ? 'border-amber-500' :
                          c.citation_level === 'contextual_match' ? 'border-blue-500' : 'border-rose-500';
                          
        let windowHtml = '';
        if (c.primary_citation && c.primary_citation.context_window) {
          // Highlight the value
          let cw = c.primary_citation.context_window.replace(/→(.*?)←/g, '<span class="bg-yellow-200 text-yellow-900 font-bold px-1 rounded">$1</span>');
          windowHtml = `<div class="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200 font-mono">...${cw}...</div>`;
        }
        
        let metaHtml = '';
        if (c.primary_citation) {
          metaHtml = `<div class="text-xs text-gray-500 mt-2 flex gap-3">
            <span>📄 ${c.primary_citation.human_readable_reference || 'N/A'}</span>
            <span>🎯 ${c.confidence}%</span>
          </div>`;
        }

        let conflictHtml = '';
        if (c.multi_source_conflict) {
          conflictHtml = `<div class="mt-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded">
            <strong>⚠️ Conflict Detected:</strong> ${c.verification_reason}
          </div>`;
        }

        return `
          <div class="border-l-4 ${borderColor} bg-white p-4 rounded shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-gray-800">${c.attribute_name} <span class="text-gray-400 font-normal">→ ${c.attributed_value}</span></h4>
                <div class="text-xs uppercase text-gray-500 mt-1">${c.citation_level.replace('_', ' ')}</div>
              </div>
            </div>
            ${windowHtml}
            ${conflictHtml}
            ${metaHtml}
          </div>
        `;
      }).join('');
    }

    const container = document.getElementById('json-viewer-grounding');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.grounding = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.grounding.render();
  },

  renderReasoning(data) {
    if (!data) return;

    // Set count
    const countEl = document.getElementById('reason-log-count');
    if (countEl) countEl.textContent = data.total_logs_generated || 0;

    // Render list
    const listEl = document.getElementById('reasoning-list');
    if (listEl && data.reasoning_logs) {
      listEl.innerHTML = data.reasoning_logs.map(log => {
        let riskColor = log.reasoning_chain?.inference_risk === 'BLOCK' ? 'bg-rose-600' :
                        log.reasoning_chain?.inference_risk === 'HIGH' ? 'bg-rose-500' :
                        log.reasoning_chain?.inference_risk === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500';
        
        let actionColor = log.reviewer_action?.action_tag === 'CHECK_DOCUMENT' ? 'text-amber-700 bg-amber-100 border-amber-300' :
                          log.reviewer_action?.action_tag === 'CONTACT_SUPPLIER' ? 'text-rose-700 bg-rose-100 border-rose-300' :
                          log.reviewer_action?.action_tag === 'APPROVE_IF_CORRECT' ? 'text-emerald-700 bg-emerald-100 border-emerald-300' :
                          'text-gray-700 bg-gray-100 border-gray-300';

        let stepsHtml = '';
        if (log.reasoning_chain && log.reasoning_chain.steps) {
          stepsHtml = log.reasoning_chain.steps.map(step => `
            <div class="flex items-start gap-3 mt-2">
              <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold shrink-0">${step.step_number}</div>
              <div class="text-sm text-gray-700">
                ${step.logic}
                ${step.basis_reference ? `<span class="text-xs text-indigo-500 block">📚 Ref: ${step.basis_reference}</span>` : ''}
              </div>
            </div>
          `).join('');
        }

        let conflictHtml = '';
        if (log.conflict_detail && log.conflict_detail.present) {
          conflictHtml = `
            <div class="mt-4 p-3 bg-rose-50 border border-rose-200 rounded text-sm">
              <div class="font-bold text-rose-800 mb-2">⚔️ Conflict Resolution</div>
              <div class="grid grid-cols-2 gap-4">
                <div><strong>Source A:</strong> ${log.conflict_detail.source_a?.value} <span class="text-xs text-gray-500">(${log.conflict_detail.source_a?.location})</span></div>
                <div><strong>Source B:</strong> ${log.conflict_detail.source_b?.value} <span class="text-xs text-gray-500">(${log.conflict_detail.source_b?.location})</span></div>
              </div>
              <div class="mt-2 text-rose-700"><strong>Basis:</strong> ${log.conflict_detail.resolution_basis}</div>
            </div>
          `;
        }

        return `
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h4 class="font-bold text-lg text-gray-800">${log.attribute_name} <span class="font-normal text-gray-500">→ ${log.current_value}</span></h4>
                <div class="text-xs font-bold uppercase text-gray-500 mt-1">${log.log_trigger.replace('_', ' ')}</div>
              </div>
              <div class="${riskColor} text-white text-xs font-bold px-3 py-1 rounded-full">
                RISK: ${log.reasoning_chain?.inference_risk || 'UNKNOWN'}
              </div>
            </div>
            
            <div class="p-4">
              <div class="mb-4 text-sm">
                <strong>Observation:</strong> ${log.reasoning_chain?.observation || 'N/A'}<br>
                <strong>Gap:</strong> <span class="text-rose-600">${log.reasoning_chain?.gap || 'N/A'}</span>
              </div>
              
              <div class="mb-4">
                <strong class="text-sm text-gray-700 uppercase tracking-wider">Logic Chain</strong>
                ${stepsHtml}
              </div>

              ${conflictHtml}

              <div class="mt-4 p-3 rounded border ${actionColor} flex items-start gap-3">
                <div class="text-xl">👩‍🔧</div>
                <div>
                  <div class="font-bold uppercase text-sm">${log.reviewer_action?.action_tag}</div>
                  <div class="text-sm">${log.reviewer_action?.action_instruction}</div>
                  <div class="text-xs opacity-75 mt-1">Est. Time: ${log.reviewer_action?.estimated_review_time}</div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    const container = document.getElementById('json-viewer-reasoning');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.reasoning = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.reasoning.render();
  },

  renderCataloging(data) {
    const container = document.getElementById('json-viewer-catalog');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.catalog = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.catalog.render();
  },

  renderScoring(data) {
    if (!data || !data.final_score) return;

    // Update Verdict
    const verdictLabel = document.getElementById('score-verdict');
    const oneLine = document.getElementById('score-one-line');
    const color = data.final_score.confidence_color || 'green'; // red | amber | green
    
    if (verdictLabel) {
      verdictLabel.textContent = data.final_score.label.replace(/_/g, ' ').toUpperCase();
      verdictLabel.className = color === 'red' ? 'text-rose-600' : color === 'amber' ? 'text-amber-600' : 'text-emerald-600';
    }
    if (oneLine && data.reviewer_summary) oneLine.textContent = data.reviewer_summary.one_line_verdict;

    // Update Circle
    const circle = document.getElementById('score-circle-color');
    const val = document.getElementById('score-final-value');
    if (circle && val) {
      val.textContent = Math.round(data.final_score.score);
      circle.className = 'score-circle ' + (color === 'red' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500');
    }

    // Update Dimensions
    const setDim = (id, obj) => {
      const el = document.getElementById(id);
      if (el && obj) el.textContent = Math.round(obj.weighted_score) + ' / ' + Math.round(obj.weight * 100);
    };
    if (data.dimension_scores) {
      setDim('score-dim-ext', data.dimension_scores.extraction_completeness);
      setDim('score-dim-src', data.dimension_scores.source_data_quality);
      setDim('score-dim-val', data.dimension_scores.validation_outcome);
      setDim('score-dim-norm', data.dimension_scores.normalization_coverage);
      setDim('score-dim-cat', data.dimension_scores.catalog_content_quality);
    }

    // Priority Actions
    const pac = document.getElementById('priority-actions-container');
    const pal = document.getElementById('priority-actions-list');
    if (pac && pal) {
      if (data.priority_actions && data.priority_actions.length > 0) {
        pac.classList.remove('hidden');
        pal.innerHTML = data.priority_actions.map(a => `<li><strong>${a.action_type.toUpperCase()}:</strong> ${a.description} <em>(+${a.estimated_score_gain} pts)</em></li>`).join('');
      } else {
        pac.classList.add('hidden');
      }
    }

    // JSON Viewer
    const container = document.getElementById('json-viewer-scoring');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.scoring = new JsonViewer(container, data, {
      collapsedDepth: 2,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.scoring.render();
  },

  renderDashboard(data) {
    const container = document.getElementById('json-viewer-dashboard');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.dashboard = new JsonViewer(container, data, {
      collapsedDepth: 3,
      highlightInferred: true,
      showLineNumbers: true
    });
    this.viewers.dashboard.render();
  },

  async submitHumanReview() {
    if (!this.currentPipelineResult || !this.currentPipelineResult.dashboard) return;
    
    const btn = document.getElementById('btn-simulate-review');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Submitting...';
    btn.disabled = true;

    try {
      const mockEdits = [
        {
          field_id: "f_002",
          attribute_name: "Pressure Rating",
          original_value: "1000 WOG",
          corrected_value: "1000 WOG", // They approved the AI's choice over the conflict
          reviewer_note: "Confirmed 1000 WOG is the correct nominal rating. 800 WOG is a derated edge case.",
          action: "approved"
        },
        {
          field_id: "f_003",
          attribute_name: "Enclosure Rating",
          original_value: "IP65 (Downgraded for safety)",
          corrected_value: "NEMA 4X",
          reviewer_note: "Contacted supplier. Confirmed NEMA 4X washdown certification.",
          action: "corrected"
        }
      ];

      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboard: this.currentPipelineResult.dashboard,
          humanEdits: mockEdits
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reviewResult = await res.json();

      if (reviewResult.exports) {
        this.currentApprovalExports = reviewResult.exports;
      }

      this.renderApproval(reviewResult);

      // Show and switch to the approval slide in the carousel
      const approvalSlide = document.getElementById('tab-approval');
      if (approvalSlide) {
        approvalSlide.style.display = 'block';
        this.renderCarouselIndicators();
        const visibleSlides = this.getVisibleSlides();
        const approvalIdx = visibleSlides.indexOf(approvalSlide);
        if (approvalIdx !== -1) {
          this.goToSlide(approvalIdx);
        }
      }

      this.showToast('Human review processed successfully', 'success');

    } catch (err) {
      console.error(err);
      this.showToast(`Review failed: ${err.message}`, 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  },

  renderApproval(data) {
    const container = document.getElementById('json-viewer-approval');
    if (!container) return;
    container.innerHTML = '';
    this.viewers = this.viewers || {};
    this.viewers.approval = new JsonViewer(container, data, {
      collapsedDepth: 3,
      highlightInferred: false,
      showLineNumbers: true
    });
    this.viewers.approval.render();
  },

  renderDataQuality(data) {
    // Confidence gauge
    DocForgeAnimations.animateConfidenceGauge(data.score);

    // Stat counters
    DocForgeAnimations.animateCounter(document.getElementById('stat-fields'), data.fields, 800);
    DocForgeAnimations.animateCounter(document.getElementById('stat-inferred'), data.inferred, 800);
    DocForgeAnimations.animateCounter(document.getElementById('stat-missing'), data.missing, 800);

    // Warnings / recommendations
    const warningsContainer = document.getElementById('quality-warnings');
    warningsContainer.innerHTML = '';

    if (data.warnings && data.warnings.length > 0) {
      data.warnings.forEach(warn => {
        const div = document.createElement('div');
        const levelClass = warn.level === 'error' ? '' : warn.level === 'warning' ? 'amber' : 'amber';
        div.className = `warning-card ${levelClass}`;

        const icon = warn.level === 'error' ? '🔴' : warn.level === 'warning' ? '🟡' : '💡';
        div.innerHTML = `<span>${icon}</span> <strong>${this.escapeHtml(warn.field)}</strong>: ${this.escapeHtml(warn.message)}`;
        warningsContainer.appendChild(div);
      });
    } else {
      warningsContainer.innerHTML = '<div class="text-muted" style="padding:1rem;">✅ No data quality issues detected. All critical fields extracted successfully.</div>';
    }
  },

  renderExport(data) {
    this.updateExportView();
  },

  updateExportView() {
    const select = document.getElementById('select-export-format');
    const textarea = document.getElementById('export-textarea');
    const warningsEl = document.getElementById('export-warnings');
    if (!select || !textarea) return;

    const target = select.value;
    let content = "";
    let warnings = [];

    const activeExports = this.currentApprovalExports || this.getMockExports();
    
    if (target === 'full_pipeline') {
      content = this.currentPipelineResult?.exportJson || '{}';
    } else if (activeExports && activeExports[target]) {
      const exp = activeExports[target];
      if (exp.csv_string) {
        content = exp.csv_string;
      } else if (exp.payload) {
        content = JSON.stringify(exp.payload, null, 2);
      } else {
        content = JSON.stringify(exp, null, 2);
      }
      if (exp.field_mapping_warnings && exp.field_mapping_warnings.length > 0) {
        warnings = exp.field_mapping_warnings;
      }
    } else {
      content = "// Selected format payload not generated yet. Submit Human Review to generate all exports.";
    }

    textarea.value = content;

    if (warnings.length > 0 && warningsEl) {
      warningsEl.style.display = 'block';
      warningsEl.innerHTML = `⚠️ <strong>Export Warnings:</strong><br>${warnings.join('<br>')}`;
    } else if (warningsEl) {
      warningsEl.style.display = 'none';
    }
  },

  getMockExports() {
    return {
      json_standard: {
        payload: {
          title: "Ball Valve 1/2\" SS316, 1000 WOG",
          sku: "BV-SS316-050-1000",
          category: "Valves & Actuators > Ball Valves",
          attributes: [
            { name: "Body Material", value: "SS316", confidence: 100 },
            { name: "Pressure Rating", value: "1000 PSI", confidence: 100 }
          ]
        }
      },
      csv_flat: {
        csv_string: "PIPELINE_ID,SKU,TITLE,BODY_MATERIAL,PRESSURE_RATING_PSI,DATA_CONFIDENCE_SCORE\nPL_1001,BV-SS316-050-1000,\"Ball Valve 1/2\" SS316, 1000 WOG\",SS316,1000,100"
      },
      pim_akeneo: {
        payload: {
          identifier: "BV-SS316-050-1000",
          family: "2_piece_ball_valves",
          values: {
            title: [{ data: "Ball Valve 1/2\" SS316, 1000 WOG", locale: null, scope: null }]
          }
        }
      },
      erp_sap: {
        field_mapping_warnings: ["MATNR exceeded 18 chars limit — truncated to BV-SS316-050-1000"],
        payload: {
          MATNR: "BV-SS316-050-1000",
          MAKTX: "1/2\" SS316 1000WOG Ball Valve",
          MATKL: "VALVE_BALL",
          MEINS: "PCE",
          NTGEW: 0.65,
          GEWEI: "KG"
        }
      },
      woocommerce: {
        csv_string: "ID,Type,SKU,Name,Published,Meta: Body Material,Meta: Pressure Rating\n1001,simple,BV-SS316-050-1000,\"Ball Valve 1/2\" SS316, 1000 WOG\",1,SS316,1000 PSI"
      }
    };
  },

  // ─────────────────────────────────────────────────────
  // EXPORT
  // ─────────────────────────────────────────────────────

  downloadExport() {
    const select = document.getElementById('select-export-format');
    const textarea = document.getElementById('export-textarea');
    if (!textarea || !textarea.value) return;

    const target = select ? select.value : 'export';
    const isCsv = target.includes('csv') || target === 'woocommerce';
    const ext = isCsv ? 'csv' : 'json';
    const mime = isCsv ? 'text/csv' : 'application/json';

    const blob = new Blob([textarea.value], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', `docforge_export_${target}_${Date.now()}.${ext}`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    this.showToast(`Export downloaded (${target}.${ext})`, 'success');
  },

  // ─────────────────────────────────────────────────────
  // CAROUSEL SLIDER
  // ─────────────────────────────────────────────────────

  initCarousel() {
    this.state.currentSlide = 0;
    this.slideTitles = [
      'Classification', 'Pre-Processing', 'Chunking', 'Raw Extraction',
      'Normalization', 'LOV Verification', 'Taxonomy (Enrich)', 'Validation Report', 'Source Grounding',
      'AI Reasoning', 'Commercial Content', 'Quality Score', 'Review Dashboard',
      'Final Approval', 'Export'
    ];

    // Hide approval slide initially
    const approvalSlide = document.getElementById('tab-approval');
    if (approvalSlide) approvalSlide.style.display = 'none';

    this.els.carouselPrev?.addEventListener('click', () => this.prevSlide());
    this.els.carouselNext?.addEventListener('click', () => this.nextSlide());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    this.renderCarouselIndicators();
    setTimeout(() => this.goToSlide(0), 100);
  },

  getVisibleSlides() {
    return Array.from(this.els.slides).filter(slide => slide.style.display !== 'none');
  },

  renderCarouselIndicators() {
    if (!this.els.carouselIndicators) return;
    this.els.carouselIndicators.innerHTML = '';
    const visibleSlides = this.getVisibleSlides();

    visibleSlides.forEach((slide, idx) => {
      const btn = document.createElement('button');
      btn.title = this.slideTitles[idx] || slide.id;
      if (idx === this.state.currentSlide) btn.classList.add('active');
      btn.addEventListener('click', () => this.goToSlide(idx));
      this.els.carouselIndicators.appendChild(btn);
    });
  },

  goToSlide(index) {
    const visibleSlides = this.getVisibleSlides();
    if (index < 0 || index >= visibleSlides.length) return;

    this.state.currentSlide = index;

    // Slide track
    if (this.els.carouselTrack) {
      this.els.carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    }

    // Update active classes
    this.els.slides.forEach(slide => {
      slide.classList.remove('active-slide');
      slide.classList.remove('active'); // fallback
    });
    const activeSlide = visibleSlides[index];
    if (activeSlide) {
      activeSlide.classList.add('active-slide');
      activeSlide.classList.add('active');
      
      // Update title
      if (this.els.carouselTitle) {
        const slideIdx = Array.from(this.els.slides).indexOf(activeSlide);
        this.els.carouselTitle.textContent = this.slideTitles[slideIdx] || 'Output';
      }
    }

    // Enable/disable buttons
    if (this.els.carouselPrev) this.els.carouselPrev.disabled = index === 0;
    if (this.els.carouselNext) this.els.carouselNext.disabled = index === visibleSlides.length - 1;

    // Update dots
    if (this.els.carouselIndicators) {
      const dots = this.els.carouselIndicators.querySelectorAll('button');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }
  },

  prevSlide() {
    this.goToSlide(this.state.currentSlide - 1);
  },

  nextSlide() {
    this.goToSlide(this.state.currentSlide + 1);
  },

  // ─────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────

  toggleHistory(show) {
    if (show) {
      this.els.historySidebar.classList.add('open');
      this.els.sidebarOverlay.classList.add('active');
      this.renderHistoryList();
    } else {
      this.els.historySidebar.classList.remove('open');
      this.els.sidebarOverlay.classList.remove('active');
    }
  },

  addToHistory(viewModel, filename) {
    const item = {
      id: Date.now(),
      filename: filename || viewModel.filename || 'Unknown',
      type: viewModel.classification.type,
      score: viewModel.quality.score,
      timestamp: new Date().toISOString(),
      data: viewModel
    };

    this.state.history.unshift(item);
    if (this.state.history.length > 20) this.state.history.pop();

    try {
      sessionStorage.setItem('docforge_history', JSON.stringify(this.state.history));
    } catch (e) {
      // sessionStorage might be full
      console.warn('Could not save to sessionStorage:', e);
    }
  },

  loadHistory() {
    try {
      const hist = sessionStorage.getItem('docforge_history');
      if (hist) {
        this.state.history = JSON.parse(hist);
      }
    } catch (e) {
      this.state.history = [];
    }
  },

  renderHistoryList() {
    this.els.historyList.innerHTML = '';

    if (this.state.history.length === 0) {
      this.els.historyList.innerHTML = '<div class="empty-state">No processing history yet.<br>Run the pipeline to get started.</div>';
      return;
    }

    this.state.history.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';

      const date = new Date(item.timestamp).toLocaleString();
      const scoreColor = item.score >= 80 ? 'var(--accent-emerald)' : item.score >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)';

      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${this.escapeHtml(item.filename)}</strong>
          <span class="badge" style="background: ${scoreColor}20; color: ${scoreColor}; border: 1px solid ${scoreColor}40; margin-left:8px;">${item.score}%</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>${(item.type || '').replace(/_/g, ' ')}</span>
          <span>${date}</span>
        </div>
      `;

      div.addEventListener('click', () => {
        this.loadFromHistory(index);
        this.toggleHistory(false);
      });

      this.els.historyList.appendChild(div);
    });
  },

  loadFromHistory(index) {
    const item = this.state.history[index];
    if (!item || !item.data) return;

    this.state.pipelineResult = item.data;

    // Reset carousel
    const approvalSlide = document.getElementById('tab-approval');
    if (approvalSlide) approvalSlide.style.display = 'none';
    this.renderCarouselIndicators();
    this.goToSlide(0);

    // Show pipeline as all complete
    this.els.pipelineSection.classList.remove('hidden');
    for (let i = 0; i < 13; i++) {
      DocForgeAnimations.setStageState(i, 'complete');
      if (i < 12) DocForgeAnimations.animateConnector(i, true);
    }

    // Render results
    this.renderResults(item.data);
    this.els.resultsSection.classList.remove('hidden');
    this.els.resultsSection.scrollIntoView({ behavior: 'smooth' });
    this.showToast(`Loaded: ${item.filename}`, 'success');
  },

  // ─────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span>${icon}</span> <div>${this.escapeHtml(message)}</div>`;

    this.els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ── Initialize on DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  DocForge.init();
});

