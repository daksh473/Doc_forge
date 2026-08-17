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

      tabs: document.querySelectorAll('.tab-btn'),
      tabIndicator: document.querySelector('.tab-indicator'),
      tabPanels: document.querySelectorAll('.tab-panel'),

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

    // ── Tabs ──
    this.els.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this.switchTab(tab));
    });

    // ── History Sidebar ──
    this.els.historyBtn.addEventListener('click', () => this.toggleHistory(true));
    this.els.closeHistoryBtn.addEventListener('click', () => this.toggleHistory(false));
    this.els.sidebarOverlay.addEventListener('click', () => this.toggleHistory(false));

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

    document.getElementById('expand-catalog')?.addEventListener('click', () => this.viewers?.catalog?.expandAll());
    document.getElementById('collapse-catalog')?.addEventListener('click', () => this.viewers?.catalog?.collapseAll());
    document.getElementById('search-catalog')?.addEventListener('input', (e) => this.viewers?.catalog?.search(e.target.value));

    // ── Export Controls ──
    document.getElementById('btn-download-json')?.addEventListener('click', () => this.downloadExport());
    document.getElementById('btn-copy-json')?.addEventListener('click', () => {
      const text = document.getElementById('export-textarea').value;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('JSON copied to clipboard', 'success');
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

    // Reset all stages to idle
    DocForgeAnimations.initPipelineConnectors();
    for (let i = 0; i < 8; i++) {
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

      // Stage 7: Catalog
      await this.sleep(400);
      DocForgeAnimations.setStageState(7, 'processing');
      await this.sleep(400);
      DocForgeAnimations.setStageState(7, 'complete');
      document.getElementById('duration-7').textContent = this.formatDuration(stages.catalog.duration_ms);

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
      for (let i = 0; i < 8; i++) {
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
    const enrichment = stages.enrich.result;
    const cataloging = stages.catalog ? stages.catalog.result : null;
    
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
      enrichment: enrichment,
      cataloging: cataloging,

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
    this.renderExtraction(data.extraction);
    if (data.normalization) this.renderNormalization(data.normalization);
    this.renderEnrichment(data.enrichment);
    if (data.cataloging) this.renderCataloging(data.cataloging);
    this.renderDataQuality(data.quality);
    this.renderExport(data._raw);
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
    const exportStr = JSON.stringify(data, null, 2);
    document.getElementById('export-textarea').value = exportStr;
  },

  // ─────────────────────────────────────────────────────
  // EXPORT
  // ─────────────────────────────────────────────────────

  downloadExport() {
    if (!this.state.pipelineResult) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(this.state.pipelineResult._raw, null, 2)
    );
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `docforge_${this.state.pipelineResult.filename || 'export'}_${Date.now()}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    this.showToast('JSON downloaded', 'success');
  },

  // ─────────────────────────────────────────────────────
  // TABS
  // ─────────────────────────────────────────────────────

  switchTab(clickedTab) {
    this.els.tabs.forEach(t => t.classList.remove('active'));
    clickedTab.classList.add('active');

    this.updateTabIndicator(clickedTab);

    const targetId = clickedTab.getAttribute('data-target');
    this.els.tabPanels.forEach(p => {
      p.classList.remove('active');
      if (p.id === targetId) p.classList.add('active');
    });

    this.state.activeTab = targetId;
  },

  updateTabIndicator(activeTab) {
    if (!activeTab || !this.els.tabIndicator) return;
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = activeTab.parentElement.getBoundingClientRect();

    this.els.tabIndicator.style.width = `${tabRect.width}px`;
    this.els.tabIndicator.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
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

    // Show pipeline as all complete
    this.els.pipelineSection.classList.remove('hidden');
    for (let i = 0; i < 8; i++) {
      DocForgeAnimations.setStageState(i, 'complete');
      if (i < 7) DocForgeAnimations.animateConnector(i, true);
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
