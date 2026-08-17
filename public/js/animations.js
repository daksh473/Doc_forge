/**
 * DocForge Animations Module
 */

window.DocForgeAnimations = {
  // Config
  colors: ['#3b82f6', '#06b6d4', '#10b981'],

  initPipelineConnectors() {
    // Connectors are initialized via CSS. 
    // This just ensures they reset when pipeline starts.
    for (let i = 0; i < 9; i++) {
      const line = document.querySelector(`#conn-${i} .connector-line`);
      if (line) {
        if (window.innerWidth <= 1024) {
          line.style.height = '0%';
          line.style.width = '100%';
        } else {
          line.style.width = '0%';
          line.style.height = '100%';
        }
      }
    }
  },

  setStageState(stageIndex, state) {
    const card = document.getElementById(`stage-${stageIndex}`);
    if (!card) return;

    // Remove old states
    card.classList.remove('idle', 'processing', 'complete', 'error');
    card.classList.add(state);

    const statusEl = card.querySelector('.stage-status');
    if (statusEl) {
      if (state === 'processing') statusEl.textContent = 'Processing...';
      if (state === 'complete') statusEl.textContent = 'Completed';
      if (state === 'error') statusEl.textContent = 'Failed';
      if (state === 'idle') statusEl.textContent = 'Waiting...';
    }
  },

  animateConnector(connectorIndex, active) {
    const line = document.querySelector(`#conn-${connectorIndex} .connector-line`);
    if (!line) return;
    
    requestAnimationFrame(() => {
      if (window.innerWidth <= 1024) {
        line.style.height = active ? '100%' : '0%';
      } else {
        line.style.width = active ? '100%' : '0%';
      }
    });
  },

  animateConfidenceGauge(score) {
    const progress = document.getElementById('gauge-progress');
    const scoreEl = document.getElementById('gauge-score');
    if (!progress || !scoreEl) return;

    // Dasharray is 283 (2 * pi * r where r=45)
    const maxOffset = 283;
    const offset = maxOffset - (score / 100) * maxOffset;
    
    // Set color based on score
    let color = 'var(--accent-emerald)';
    if (score < 40) color = 'var(--accent-rose)';
    else if (score < 70) color = 'var(--accent-amber)';

    requestAnimationFrame(() => {
      progress.style.strokeDashoffset = offset;
      progress.style.stroke = color;
    });

    this.animateCounter(scoreEl, score, 1000);
  },

  triggerCompletionEffect() {
    const btn = document.getElementById('start-pipeline-btn');
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  },

  animateCounter(element, targetValue, duration) {
    let startTimestamp = null;
    const startValue = parseInt(element.textContent) || 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeProgress);
      
      element.textContent = current;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = targetValue;
      }
    };
    
    window.requestAnimationFrame(step);
  },

  pulseElement(element) {
    if (!element) return;
    element.style.animation = 'none';
    element.offsetHeight; // trigger reflow
    element.style.animation = 'pulseGlowBlue 1s ease-out';
  },

  shakeElement(element) {
    if (!element) return;
    element.classList.remove('shake');
    element.offsetHeight;
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 300);
  }
};
