import { prefersReducedMotion } from './utils.js';

export const EVENTS = [
  { src: '/images/events/event-15.jpg', alt: 'Three guests smiling with two Original can cutouts' },
  { src: '/images/events/event-01.jpg', alt: 'Three people talking at a Sato Sato event, one in a peach Sato Sato shirt' },
  { src: '/images/events/event-02.jpg', alt: 'A speaker with a microphone beside a Thai Rice Hub banner' },
  { src: '/images/events/event-03.jpg', alt: 'Three people in Sato Sato shirts at the booth, two holding Original can cutouts' },
  { src: '/images/events/event-04.jpg', alt: 'A man in a Sato Sato shirt talking with a guest across the booth table' },
  { src: '/images/events/event-05.jpg', alt: 'A man in a Sato Sato shirt holding up two cans at an outdoor table, a Rice Hub banner behind him' },
  { src: '/images/events/event-06.jpg', alt: 'A hand passing an Original can beside a Sato Sato cup at the bar' },
  { src: '/images/events/event-07.jpg', alt: 'A man in a Sato Sato shirt talking with a guest holding a tasting cup' },
  { src: '/images/events/event-08.jpg', alt: 'A man in a Sato Sato shirt handing a woven bag to two guests at the booth' },
  { src: '/images/events/event-09.jpg', alt: 'A man in a Sato Sato shirt pointing while a guest holds a can by the cooler' },
  { src: '/images/events/event-10.jpg', alt: 'Guests playing a tasting game at an outdoor table' },
  { src: '/images/events/event-11.jpg', alt: 'A guest holding up an Original can cutout' },
  { src: '/images/events/event-12.jpg', alt: 'Two Sato Sato cups topped with soft serve and cones' },
  { src: '/images/events/event-13.jpg', alt: 'A guest chatting with a man in a Sato Sato shirt beside the can cutout and cooler' },
  { src: '/images/events/event-14.jpg', alt: 'A guest smiling with a Sato Sato cup and an Original can' },
  { src: '/images/events/event-16.jpg', alt: 'A man in a Sato Sato shirt giving a thumbs-up with an Original can cutout' },
  { src: '/images/events/event-17.jpg', alt: 'Two guests with Sato Sato cans and cups, one holding an Original can cutout' },
  { src: '/images/events/event-18.jpg', alt: 'Two guests holding Sato Sato cans and cups at the booth' },
  { src: '/images/events/event-19.jpg', alt: 'A man in a Sato Sato shirt laughing with two guests at an outdoor event' },
  { src: '/images/events/event-20.jpg', alt: 'Two guests holding an Original can cutout at night' },
  { src: '/images/events/event-21.jpg', alt: 'Three guests at a table raising Sato Sato cups' },
  { src: '/images/events/event-22.jpg', alt: 'The Sato Sato team bringing a tray of tasting cups to a table by the river' },
  { src: '/images/events/event-23.jpg', alt: 'Guests reaching for tasting cups at a table by the river' },
  { src: '/images/events/event-24.jpg', alt: 'Two men in Sato Sato shirts handing out tasting cups to seated guests' },
];

function slideWidth(track) {
  const slide = track.querySelector('.out__slide');
  if (!slide) return track.clientWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
  return slide.getBoundingClientRect().width + gap;
}

export function initOut() {
  const track = document.getElementById('out-track');
  const prev = document.querySelector('[data-out-prev]');
  const next = document.querySelector('[data-out-next]');
  if (!track || !prev || !next) return;

  const count = document.querySelector('[data-out-count]');
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';

  track.innerHTML = EVENTS.map(
    (event) => `
      <figure class="out__slide">
        <img src="${event.src}" alt="${event.alt}" width="1600" height="1067" loading="lazy">
      </figure>
    `,
  ).join('');

  function update() {
    const width = slideWidth(track) || 1;
    const index = Math.min(EVENTS.length, Math.round(track.scrollLeft / width) + 1);
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
    if (count) count.textContent = `${index} / ${EVENTS.length}`;
  }

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -slideWidth(track), behavior });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: slideWidth(track), behavior });
  });

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next.click();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev.click();
    }
  });

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
