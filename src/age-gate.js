export function initAgeGate(onVerified) {
  const gate = document.getElementById('age-gate');
  if (!gate) {
    onVerified();
    return;
  }

  const yesBtn = gate.querySelector('[data-age-gate="yes"]');
  const noBtn = gate.querySelector('[data-age-gate="no"]');
  const prompt = gate.querySelector('.age-gate__prompt');
  const declined = gate.querySelector('.age-gate__declined');
  const pageContent = document.querySelectorAll('.page, .nav, .footer, .watermark');

  document.body.classList.add('age-gate-open');
  pageContent.forEach((el) => el.setAttribute('inert', ''));

  function dismissGate() {
    gate.classList.add('is-dismissed');
    document.body.classList.remove('age-gate-open');
    pageContent.forEach((el) => el.removeAttribute('inert'));

    window.setTimeout(() => {
      gate.remove();
      onVerified();
    }, 450);
  }

  function showDeclined() {
    prompt?.setAttribute('hidden', '');
    declined?.removeAttribute('hidden');
  }

  yesBtn?.addEventListener('click', dismissGate);
  noBtn?.addEventListener('click', showDeclined);

  yesBtn?.focus();
}
