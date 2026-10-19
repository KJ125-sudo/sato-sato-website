const GA_ID = import.meta.env.VITE_GA_ID;

export function initAnalytics() {
  if (!GA_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.append(script);

  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-track]');
    if (!el || typeof window.gtag !== 'function') return;
    window.gtag('event', el.dataset.track, {
      link_url: el.getAttribute('href') || undefined,
    });
  });
}

export function track(name, params) {
  if (!GA_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
