/**
 * BehaviorShift External SDK — Magic Cart Integration
 * Tracks: page_view, hesitation, rage_click, blur_focus, exit_intent,
 *         idle_start, idle_end, scroll_depth, product_view, add_to_cart,
 *         checkout_start, order_placed
 *
 * All events include domPath metadata for heatmap aggregation.
 * Sends to /api/telemetry on the configured API URL.
 */
(function () {
  'use strict';

  // ─── Configuration ───────────────────────────────────────────────
  const API_URL = window.BEHAVIORSHIFT_API_URL || 'https://shift-savvy-choices-git-d-d045f6-mirna-salems-projects-fbd96804.vercel.app';
  const CLIENT_ID = window.BEHAVIORSHIFT_CLIENT_ID || 'magic-cart';
  const API_KEY = window.BEHAVIORSHIFT_API_KEY || '';
  const DEDUP_MS = 1000; // 1-second de-duplication window for same event types
  const IDLE_THRESHOLD_MS = 15000; // 15 seconds idle
  const HESITATION_THRESHOLD_MS = 3000; // 3 sec hover/focus without action
  const RAGE_CLICK_THRESHOLD = 4; // 4 clicks
  const RAGE_CLICK_WINDOW_MS = 2500; // within 2.5 seconds
  const SCROLL_DEPTH_INTERVAL = 25; // Report at 25%, 50%, 75%, 100%

  // ─── Session Management (sessionStorage-scoped) ──────────────────
  function getSessionId() {
    let sid = sessionStorage.getItem('bs_ext_session_id');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
      sessionStorage.setItem('bs_ext_session_id', sid);
    }
    return sid;
  }
  const SESSION_ID = getSessionId();

  // ─── De-duplication ──────────────────────────────────────────────
  let lastEvent = { type: '', ts: 0 };
  function isDuplicate(eventType) {
    const now = Date.now();
    if (lastEvent.type === eventType && now - lastEvent.ts < DEDUP_MS) return true;
    lastEvent = { type: eventType, ts: now };
    return false;
  }

  // ─── DOM Path Helper (for heatmap) ───────────────────────────────
  function getDomPath(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    const parts = [];
    let current = el;
    while (current && current !== document.body && parts.length < 6) {
      let tag = current.tagName?.toLowerCase() || '?';
      if (current.id) tag += '#' + current.id;
      else if (current.className && typeof current.className === 'string') {
        const cls = current.className.trim().split(/\s+/).slice(0, 2).join('.');
        if (cls) tag += '.' + cls;
      }
      parts.unshift(tag);
      current = current.parentElement;
    }
    return parts.join(' > ');
  }

  function getElementMeta(el) {
    if (!el) return {};
    return {
      domPath: getDomPath(el),
      tagName: el.tagName?.toLowerCase() || '',
      id: el.id || null,
      className: (typeof el.className === 'string' ? el.className : '') || null,
      text: (el.innerText || el.textContent || '').trim().substring(0, 80) || null,
    };
  }

  // ─── Telemetry Sender ────────────────────────────────────────────
  function sendEvent(eventType, extraMeta) {
    if (isDuplicate(eventType)) return;

    const payload = {
      eventType: eventType,
      clientId: CLIENT_ID,
      sessionId: SESSION_ID,
      pagePath: window.location.pathname,
      ts: Date.now(),
      metadata: {
        clientId: CLIENT_ID,
        sessionId: SESSION_ID,
        source: 'external',
        isExternal: true,
        client_id: CLIENT_ID,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        ...(extraMeta || {}),
      },
    };

    const endpoint = API_URL.replace(/\/$/, '') + '/telemetry';

    fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(r => {
        if (r.ok) console.log(`[BS-SDK] ✅ ${eventType}`, extraMeta?.button_label || extraMeta?.depth || '');
        else r.text().then(t => console.warn(`[BS-SDK] ⚠️ ${eventType} → ${r.status}`, t));
      })
      .catch(err => console.error(`[BS-SDK] ❌ ${eventType}`, err.message));
  }

  // ═══════════════════════════════════════════════════════════════════
  // 1. PAGE VIEW TRACKING
  // ═══════════════════════════════════════════════════════════════════
  let currentPath = window.location.pathname;

  function trackPageView() {
    sendEvent('page_view', { referrer: document.referrer });
    currentPath = window.location.pathname;

    // Track funnel events based on path
    const path = window.location.pathname.toLowerCase();
    if (path === '/products' || path.includes('/product')) {
      sendEvent('product_view', { page: path });
    } else if (path === '/cart') {
      // Don't auto-send add_to_cart here — that's button-driven
    } else if (path === '/checkout') {
      sendEvent('checkout_start', { page: path });
    }
  }

  // Initial page view
  trackPageView();

  // SPA navigation detection (react-router-dom uses pushState/popstate)
  const origPushState = history.pushState;
  history.pushState = function () {
    origPushState.apply(this, arguments);
    setTimeout(() => {
      if (window.location.pathname !== currentPath) trackPageView();
    }, 50);
  };
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      if (window.location.pathname !== currentPath) trackPageView();
    }, 50);
  });

  // ═══════════════════════════════════════════════════════════════════
  // 2. CLICK TRACKING + FUNNEL EVENTS + RAGE CLICK DETECTION
  // ═══════════════════════════════════════════════════════════════════
  const clickTimestamps = [];

  document.addEventListener('click', (e) => {
    const now = Date.now();
    const target = e.target.closest('button, a, .btn, .btn-primary, .btn-outline, .glass, input[type="submit"]');
    const elMeta = getElementMeta(e.target);

    // --- Rage click detection ---
    clickTimestamps.push(now);
    // Remove clicks older than window
    while (clickTimestamps.length > 0 && now - clickTimestamps[0] > RAGE_CLICK_WINDOW_MS) {
      clickTimestamps.shift();
    }
    if (clickTimestamps.length >= RAGE_CLICK_THRESHOLD) {
      sendEvent('rage_click', {
        clickCount: clickTimestamps.length,
        ...elMeta,
      });
      clickTimestamps.length = 0; // Reset after detection
      return; // Don't also send ui_click
    }

    if (!target) return;

    const text = (target.innerText || '').trim();
    const textL = text.toLowerCase();
    const targetMeta = getElementMeta(target);

    // --- Funnel event detection ---
    // Add to Cart (shopping cart icon button on product cards)
    if (target.closest('.btn-primary') && target.closest('[class*="glass"]')) {
      const productCard = target.closest('.glass');
      const productName = productCard?.querySelector('h3')?.textContent || '';
      if (productName && !textL.includes('checkout') && !textL.includes('continue') && !textL.includes('browse')) {
        sendEvent('add_to_cart', {
          product: productName,
          button_label: text || 'Add to Cart',
          ...targetMeta,
        });
        return;
      }
    }

    // Proceed to Checkout
    if (textL.includes('checkout') || textL.includes('proceed')) {
      sendEvent('checkout_start', {
        button_label: text,
        ...targetMeta,
      });
      return;
    }

    // Buy Now / Order placed
    if (textL.includes('buy now') || textL.includes('complete') || textL.includes('place order')) {
      sendEvent('order_placed', {
        button_label: text,
        ...targetMeta,
      });
      return;
    }

    // "Continue Shopping" after order
    if (textL.includes('continue shopping')) {
      sendEvent('order_placed', {
        button_label: text,
        status: 'success',
        ...targetMeta,
      });
      return;
    }

    // Default click
    sendEvent('ui_click', {
      button_label: text || 'interaction',
      ...targetMeta,
    });
  }, true);

  // ═══════════════════════════════════════════════════════════════════
  // 3. HESITATION DETECTION (hover > 3s on interactive elements)
  // ═══════════════════════════════════════════════════════════════════
  let hesitationTimer = null;
  let hesitationTarget = null;

  document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('button, a, .btn, .btn-primary, .glass, input, select');
    if (!interactive || interactive === hesitationTarget) return;

    clearTimeout(hesitationTimer);
    hesitationTarget = interactive;

    hesitationTimer = setTimeout(() => {
      sendEvent('hesitation', {
        durationMs: HESITATION_THRESHOLD_MS,
        ...getElementMeta(interactive),
      });
    }, HESITATION_THRESHOLD_MS);
  });

  document.addEventListener('mouseout', (e) => {
    const interactive = e.target.closest('button, a, .btn, .btn-primary, .glass, input, select');
    if (interactive === hesitationTarget) {
      clearTimeout(hesitationTimer);
      hesitationTarget = null;
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 4. BLUR / FOCUS DETECTION (tab switching)
  // ═══════════════════════════════════════════════════════════════════
  let blurTime = null;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      blurTime = Date.now();
      sendEvent('blur_focus', {
        action: 'blur',
        domPath: 'document',
        tagName: 'document',
      });
    } else if (blurTime) {
      const awayMs = Date.now() - blurTime;
      sendEvent('blur_focus', {
        action: 'focus',
        awayDurationMs: awayMs,
        domPath: 'document',
        tagName: 'document',
      });
      blurTime = null;
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 5. EXIT INTENT DETECTION (mouse leaves viewport at top)
  // ═══════════════════════════════════════════════════════════════════
  let exitIntentFired = false;

  document.addEventListener('mouseout', (e) => {
    if (exitIntentFired) return;
    if (e.clientY <= 5 && e.relatedTarget == null) {
      exitIntentFired = true;
      sendEvent('exit_intent', {
        domPath: 'document',
        tagName: 'document',
      });
      // Allow re-fire after 30 seconds
      setTimeout(() => { exitIntentFired = false; }, 30000);
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 6. IDLE DETECTION (no interaction for 15 seconds)
  // ═══════════════════════════════════════════════════════════════════
  let idleTimer = null;
  let idleStartTime = null;
  const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

  function resetIdleTimer() {
    if (idleStartTime) {
      const idleDuration = (Date.now() - idleStartTime) / 1000;
      sendEvent('idle_end', {
        idleDurationSec: Math.round(idleDuration),
        domPath: 'document',
        tagName: 'document',
      });
      idleStartTime = null;
    }

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      idleStartTime = Date.now();
      sendEvent('idle_start', {
        thresholdMs: IDLE_THRESHOLD_MS,
        domPath: 'document',
        tagName: 'document',
      });
    }, IDLE_THRESHOLD_MS);
  }

  activityEvents.forEach(evt => {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });
  resetIdleTimer(); // Start the first timer

  // ═══════════════════════════════════════════════════════════════════
  // 7. SCROLL DEPTH TRACKING (at 25%, 50%, 75%, 100%)
  // ═══════════════════════════════════════════════════════════════════
  const reportedDepths = new Set();

  function checkScrollDepth() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight <= 0) return;

    const pct = Math.round((scrollTop / scrollHeight) * 100);

    [25, 50, 75, 100].forEach(threshold => {
      if (pct >= threshold && !reportedDepths.has(threshold)) {
        reportedDepths.add(threshold);
        sendEvent('scroll_depth', {
          depth: threshold,
          domPath: 'document',
          tagName: 'document',
        });
      }
    });
  }

  window.addEventListener('scroll', checkScrollDepth, { passive: true });

  // Reset scroll depth on page navigation
  const origReportedClear = history.pushState;
  history.pushState = function () {
    origReportedClear.apply(this, arguments);
    reportedDepths.clear();
  };

  // ═══════════════════════════════════════════════════════════════════
  // 8. CHECKOUT STEP TRACKING (specific to Magic Cart step-based checkout)
  // ═══════════════════════════════════════════════════════════════════
  // Observe DOM changes in checkout to detect step completions
  let lastStepCount = 0;
  const checkoutObserver = new MutationObserver(() => {
    if (!window.location.pathname.includes('/checkout')) return;
    const completedSteps = document.querySelectorAll('[style*="rgb(34, 197, 94)"]');
    if (completedSteps.length > lastStepCount) {
      const stepLabels = ['add_address', 'checkout_summary', 'order_details', 'payment_info', 'payment_complete', 'buy_now'];
      const stepIndex = completedSteps.length - 1;
      if (stepIndex < stepLabels.length) {
        sendEvent('checkout_step', {
          step: stepLabels[stepIndex],
          stepNumber: stepIndex + 1,
          totalSteps: stepLabels.length,
          domPath: 'checkout > step-' + (stepIndex + 1),
          tagName: 'button',
        });
      }
      lastStepCount = completedSteps.length;
    }
  });

  // Start observing once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkoutObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
    });
  } else {
    checkoutObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  // ═══════════════════════════════════════════════════════════════════
  // 9. NUDGE ENGINE & PERSONA PAGE RULES
  // ═══════════════════════════════════════════════════════════════════
  let activeNudges = [];
  let evaluatedPersonas = [];
  
  // Basic behavioral profiling algorithm
  function evaluatePersona() {
    // Determine persona based on standard paths browsed during session
    const path = window.location.pathname.toLowerCase();
    let currentPersona = 'deal_seeker';
    let profile = 'medium_sensitivity';

    if (path.includes('products')) currentPersona = 'researcher';
    if (path.includes('checkout')) {
      currentPersona = 'impulse_buyer';
      profile = 'high_sensitivity';
    }
    
    return { persona: currentPersona, profile };
  }

  function fetchActiveNudges() {
    const endpoint = `${API_URL.replace(/\/$/, '')}/nudges?client_id=${CLIENT_ID}`;
    fetch(endpoint, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    })
    .then(r => r.json())
    .then(data => {
      if (data.success && data.nudges && data.nudges.length > 0) {
        activeNudges = data.nudges;
        evaluateAndRenderNudges();
      }
    })
    .catch(err => console.error('[BS-SDK] Failed to load Nudges', err));
  }

  function renderNudge(nudge, attributionSettings) {
    // Avoid re-rendering if already shown
    if (document.getElementById(`bs-nudge-${nudge.id}`)) return;

    const overlay = document.createElement('div');
    overlay.id = `bs-nudge-${nudge.id}`;
    
    // Minimalist Glassmorphism Styling
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 320px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding: 16px;
      z-index: 999999;
      font-family: inherit;
      animation: bs-slide-in 0.3s ease-out;
    `;

    const titleAttr = nudge.content?.title || nudge.title || 'Special Offer';
    const messageAttr = nudge.content?.message || nudge.message || 'Unlock Premium benefits now.';

    overlay.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
        <h4 style="margin: 0; font-size: 15px; font-weight: 600; color: #111827;">${titleAttr}</h4>
        <button id="bs-dismiss-${nudge.id}" style="background: none; border: none; font-size: 14px; cursor: pointer; color: #9CA3AF; padding: 0;">&times;</button>
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #4B5563;">${messageAttr}</p>
      <button id="bs-cta-${nudge.id}" style="width: 100%; background: #4F46E5; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: opacity 0.2s;">
        ${nudge.ctaLabel || 'Unlock Now'}
      </button>
    `;

    document.body.appendChild(overlay);

    // Track Impression
    sendEvent('nudge_impression', {
      nudgeId: nudge.id,
      variantId: nudge.variants ? 'variant_a' : 'default',
      triggerType: 'page_load',
      personaId: attributionSettings.persona,
      behavioralProfileId: attributionSettings.profile,
      pageRuleId: window.location.pathname
    });

    // Handle Clicks
    document.getElementById(`bs-cta-${nudge.id}`).addEventListener('click', () => {
      sendEvent('nudge_click', {
        nudgeId: nudge.id,
        variantId: nudge.variants ? 'variant_a' : 'default',
        triggerType: 'page_load',
        personaId: attributionSettings.persona,
        behavioralProfileId: attributionSettings.profile,
        pageRuleId: window.location.pathname
      });
      overlay.remove();
    });

    document.getElementById(`bs-dismiss-${nudge.id}`).addEventListener('click', () => {
      sendEvent('nudge_dismissed', {
        nudgeId: nudge.id,
        variantId: nudge.variants ? 'variant_a' : 'default',
        triggerType: 'page_load'
      });
      overlay.remove();
    });
    
    // Inject keyframes globally if not exists
    if (!document.getElementById('bs-style')) {
      const style = document.createElement('style');
      style.id = 'bs-style';
      style.innerHTML = '@keyframes bs-slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
      document.head.appendChild(style);
    }
  }

  function evaluateAndRenderNudges() {
    const { persona, profile } = evaluatePersona();
    const path = window.location.pathname.toLowerCase();
    
    // Trigger Nudges sequentially based on rules
    activeNudges.forEach(nudge => {
      // Basic rule matching: If trigger specifies event or just show on loaded paths
      const shouldShow = nudge.trigger?.eventTypes?.includes('page_view') || path.includes('/products');
      if (shouldShow) {
        setTimeout(() => renderNudge(nudge, { persona, profile }), 1500); // Slight delay for realism
      }
    });
  }

  // Hook Nudge execution directly into page views (SPA lifecycle)
  const origNudgePushState = history.pushState;
  history.pushState = function () {
    origNudgePushState.apply(this, arguments);
    setTimeout(fetchActiveNudges, 200);
  };
  window.addEventListener('popstate', () => setTimeout(fetchActiveNudges, 200));
  
  // Initial Nudge Fetch
  setTimeout(fetchActiveNudges, 500);

  // ─── Console Banner ─────────────────────────────────────────────
  console.log(
    '%c[BehaviorShift SDK] 🟢 Active — client: ' + CLIENT_ID + ' | session: ' + SESSION_ID.substring(0, 20) + '…',
    'background: #7c3aed; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;'
  );
  console.log('[BS-SDK] API endpoint:', API_URL + '/telemetry');
})();
