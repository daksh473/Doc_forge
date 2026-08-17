/**
 * DocForge JSON Viewer Module
 */

window.JsonViewer = class JsonViewer {
  constructor(container, data, options = {}) {
    this.container = container;
    this.data = data;
    this.options = {
      collapsedDepth: options.collapsedDepth !== undefined ? options.collapsedDepth : 2,
      showLineNumbers: options.showLineNumbers !== undefined ? options.showLineNumbers : true,
      highlightInferred: options.highlightInferred !== undefined ? options.highlightInferred : true,
      searchable: options.searchable !== undefined ? options.searchable : true
    };
  }

  render() {
    this.container.innerHTML = '';
    const rootEl = this._createNode('', this.data, 0, true);
    this.container.appendChild(rootEl);
  }

  _createNode(key, value, depth, isLast) {
    const type = this._getType(value);
    const wrapper = document.createElement('div');
    wrapper.className = 'json-node';
    wrapper.style.paddingLeft = depth === 0 ? '0' : '20px';

    const line = document.createElement('div');
    line.className = 'json-line';
    
    // Formatting prefix
    let prefix = '';
    if (key !== '') {
      prefix = `<span class="json-key">"${key}"</span>: `;
    }

    // Inferred Badge Check
    let badgeHtml = '';
    if (this.options.highlightInferred && type === 'object' && value !== null && value.inferred === true) {
      badgeHtml = `<span class="badge badge-inferred" style="margin-left:8px; font-size:0.6rem; padding: 2px 6px;">Inferred</span>`;
    }

    if (type === 'object' || type === 'array') {
      const isArray = type === 'array';
      const openBracket = isArray ? '[' : '{';
      const closeBracket = isArray ? ']' : '}';
      const keys = Object.keys(value);
      const isEmpty = keys.length === 0;

      if (isEmpty) {
        line.innerHTML = `${prefix}${openBracket}${closeBracket}${isLast ? '' : ','}`;
        wrapper.appendChild(line);
      } else {
        const toggle = document.createElement('span');
        toggle.className = 'json-toggle';
        toggle.innerHTML = '▼';
        
        const contentSpan = document.createElement('span');
        contentSpan.innerHTML = `${prefix}${openBracket}${badgeHtml}`;
        
        line.appendChild(toggle);
        line.appendChild(contentSpan);
        wrapper.appendChild(line);

        const childrenWrapper = document.createElement('div');
        childrenWrapper.className = 'json-children';
        
        const isCollapsed = depth >= this.options.collapsedDepth;
        if (isCollapsed) {
          childrenWrapper.style.display = 'none';
          toggle.classList.add('collapsed');
          const preview = document.createElement('span');
          preview.className = 'json-preview text-muted';
          preview.style.cursor = 'pointer';
          preview.innerHTML = ` ... ${keys.length} items `;
          preview.onclick = () => this._toggleNode(toggle, childrenWrapper, preview);
          line.appendChild(preview);
        }

        keys.forEach((k, index) => {
          const childNode = this._createNode(k, value[k], depth + 1, index === keys.length - 1);
          childrenWrapper.appendChild(childNode);
        });

        wrapper.appendChild(childrenWrapper);

        const closeLine = document.createElement('div');
        closeLine.className = 'json-line';
        closeLine.innerHTML = `<span class="json-indent"></span>${closeBracket}${isLast ? '' : ','}`;
        wrapper.appendChild(closeLine);

        toggle.onclick = () => this._toggleNode(toggle, childrenWrapper, line.querySelector('.json-preview'));
      }
    } else {
      // Primitive value
      let displayValue = value;
      let valClass = `json-${type}`;
      
      if (type === 'string') displayValue = `"${this._escapeHtml(value)}"`;
      else if (type === 'null') displayValue = 'null';
      
      line.innerHTML = `<span class="json-indent"></span>${prefix}<span class="${valClass}">${displayValue}</span>${isLast ? '' : ','}${badgeHtml}`;
      
      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'json-copy-btn btn-icon';
      copyBtn.innerHTML = '📋';
      copyBtn.title = 'Copy value';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(String(value));
        DocForge.showToast('Copied to clipboard', 'success');
      };
      line.appendChild(copyBtn);
      
      wrapper.appendChild(line);
    }

    return wrapper;
  }

  _toggleNode(toggle, children, preview) {
    const isCollapsed = toggle.classList.contains('collapsed');
    if (isCollapsed) {
      toggle.classList.remove('collapsed');
      children.style.display = 'block';
      if (preview) preview.style.display = 'none';
    } else {
      toggle.classList.add('collapsed');
      children.style.display = 'none';
      if (preview) preview.style.display = 'inline';
    }
  }

  _getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  _escapeHtml(unsafe) {
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  expandAll() {
    const toggles = this.container.querySelectorAll('.json-toggle.collapsed');
    toggles.forEach(t => t.click());
  }

  collapseAll() {
    const toggles = this.container.querySelectorAll('.json-toggle:not(.collapsed)');
    toggles.forEach(t => t.click());
  }

  search(term) {
    // Simple basic search: expand all and highlight
    if (!term) return;
    this.expandAll();
    
    // reset highlights (simplistic implementation)
    const allLines = this.container.querySelectorAll('.json-line');
    allLines.forEach(line => {
      line.style.background = '';
      if (line.textContent.toLowerCase().includes(term.toLowerCase())) {
        line.style.background = 'rgba(6, 182, 212, 0.2)'; // highlight with cyan
      }
    });
  }
};
