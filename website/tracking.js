const STORAGE_KEY = 'websiteTrackingEvents';
const REDIRECT_STORAGE_KEY = 'redirectLandingVisits';
const USER_ID_STORAGE_KEY = 'websiteTrackingUserId';
const SESSION_START_STORAGE_KEY = 'websiteTrackingSessionStart';
const MAX_EVENTS = 200;

function getUserId() {
  try {
    let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!userId) {
      userId = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(USER_ID_STORAGE_KEY, userId);
    }
    return userId;
  } catch (error) {
    return 'anonymous';
  }
}

function getPageSource() {
  const urlSource = new URLSearchParams(window.location.search).get('source');
  if (urlSource) return urlSource;

  const referrer = document.referrer || '';
  if (!referrer) return 'direct';

  try {
    const parsed = new URL(referrer);
    if (parsed.pathname.includes('redirect-test')) return 'redirect';
  } catch (error) {
    // Ignore invalid URLs
  }

  return 'direct';
}

function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function getRedirectLandingStats() {
  try {
    return JSON.parse(localStorage.getItem(REDIRECT_STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function getSessionStart() {
  try {
    return Number(localStorage.getItem(SESSION_START_STORAGE_KEY) || Date.now());
  } catch (error) {
    return Date.now();
  }
}

function recordLandingVisit(pageName, source = 'direct') {
  const stats = getRedirectLandingStats();
  const currentPage = pageName || 'redirect-test';
  const currentSource = source || 'direct';

  stats[currentPage] = stats[currentPage] || { total: 0, sources: {} };
  stats[currentPage].total += 1;
  stats[currentPage].sources[currentSource] = (stats[currentPage].sources[currentSource] || 0) + 1;

  localStorage.setItem(REDIRECT_STORAGE_KEY, JSON.stringify(stats));
}

function trackEvent(eventName, payload = {}) {
  const eventData = {
    eventName,
    page: window.location.pathname,
    source: getPageSource(),
    userId: getUserId(),
    timestamp: new Date().toISOString(),
    ...payload,
  };

  const events = getStoredEvents();
  events.push(eventData);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  console.log('[website tracking]', eventData);
}

window.trackEvent = trackEvent;
window.recordLandingVisit = recordLandingVisit;
window.getUserId = getUserId;
window.getPageSource = getPageSource;

function bindClickTracking() {
  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => {
      trackEvent('cta_click', {
        label: element.dataset.track,
        text: element.textContent.trim(),
        source: getPageSource(),
      });
    });
  });
}

function bindOutboundTracking() {
  document.querySelectorAll('a[href^="http"], a[target="_blank"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('outbound_click', {
        url: link.href,
        text: link.textContent.trim(),
      });
    });
  });
}

function bindScrollTracking() {
  const sectionTargets = document.querySelectorAll('[data-track-section]');
  const thresholds = [25, 50, 75, 100];
  const seenDepths = new Set();

  const onScroll = () => {
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop;
    const scrollHeight = docEl.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    thresholds.forEach((threshold) => {
      if (progress >= threshold && !seenDepths.has(threshold)) {
        seenDepths.add(threshold);
        trackEvent('scroll_depth', {
          depth: threshold,
          percent: Number(progress.toFixed(1)),
        });
      }
    });
  };

  if (!('IntersectionObserver' in window)) {
    sectionTargets.forEach((section) => trackEvent('section_view', { section: section.dataset.trackSection }));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trackEvent('section_view', { section: entry.target.dataset.trackSection });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  sectionTargets.forEach((section) => observer.observe(section));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function bindFormTracking() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('focus', () => {
      trackEvent('form_field_focus', {
        form: 'contact',
        field: field.name || field.id || field.type,
      });
    });

    field.addEventListener('input', () => {
      trackEvent('form_field_input', {
        form: 'contact',
        field: field.name || field.id || field.type,
        value_length: (field.value || '').length,
      });
    });
  });

  form.addEventListener('invalid', () => {
    trackEvent('form_validation_error', {
      form: 'contact',
      invalid_field: form.querySelector(':invalid')?.name || 'unknown',
    });
  }, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name') || 'Unknown user';

    trackEvent('form_submit', {
      form: 'contact',
      name,
      email: formData.get('email') || '',
    });

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Thanks!';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      form.reset();
    }, 1600);
  });
}

function bindMouseTracking() {
  let lastMoveAt = 0;

  document.addEventListener('mousemove', (event) => {
    const now = Date.now();
    if (now - lastMoveAt < 150) return;

    lastMoveAt = now;
    trackEvent('mouse_move', {
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      source: getPageSource(),
    });
  }, { passive: true });
}

function bindHoverTracking() {
  let lastHoverAt = 0;

  document.addEventListener('mouseover', (event) => {
    const now = Date.now();
    if (now - lastHoverAt < 250) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const trackedTarget = target.closest('[data-track]') || target.closest('[data-track-section]') || target;
    const elementName = trackedTarget?.dataset?.track || trackedTarget?.dataset?.trackSection || trackedTarget?.tagName?.toLowerCase() || 'unknown';

    lastHoverAt = now;
    trackEvent('hover_heatmap', {
      element: elementName,
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      text: (trackedTarget?.textContent || '').trim().slice(0, 60),
      source: getPageSource(),
    });
  }, { passive: true });
}

function bindExitTracking() {
  window.addEventListener('beforeunload', () => {
    const startedAt = getSessionStart();
    const durationMs = Math.max(0, Date.now() - startedAt);

    trackEvent('page_exit', {
      scrollY: window.scrollY,
      path: window.location.pathname,
    });

    trackEvent('time_on_site', {
      duration_ms: durationMs,
      source: getPageSource(),
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const currentSource = getPageSource();
  const isRedirectPage = currentPath.endsWith('/redirect-test.html') || currentPath.endsWith('redirect-test.html');

  if (!localStorage.getItem(SESSION_START_STORAGE_KEY)) {
    localStorage.setItem(SESSION_START_STORAGE_KEY, Date.now().toString());
  }

  if (isRedirectPage) {
    recordLandingVisit('redirect-test', currentSource);
  }

  trackEvent('page_view', {
    title: document.title,
    source: currentSource,
  });

  bindClickTracking();
  bindOutboundTracking();
  bindScrollTracking();
  bindFormTracking();
  bindMouseTracking();
  bindHoverTracking();
  bindExitTracking();
});
