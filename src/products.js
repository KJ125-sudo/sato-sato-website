import { FLAVOURS } from './flavours.js';

export function renderProductCard(flavour) {
  return `
    <article
      class="product-card reveal"
      style="--product-accent-a: ${flavour.accent}; --product-accent-b: ${flavour.accentB};"
      data-flavour="${flavour.id}"
    >
      <div class="product-card__stage">
        <canvas class="can-bubbles" aria-hidden="true"></canvas>
        <div class="product-card__can-wrap">
          <img
            class="product-card__can"
            src="${flavour.image}"
            data-product-src="${flavour.productImage}"
            alt="Sato Sato ${flavour.name}"
            width="220"
            height="392"
            loading="lazy"
            draggable="false"
          >
        </div>
        <div class="product-card__info">
          <img class="product-card__thumb" src="${flavour.image}" alt="" loading="lazy">
          <div class="product-card__meta">
            <p class="product-card__name">${flavour.name}</p>
            <p class="product-card__desc">${flavour.description}</p>
          </div>
          <div class="product-card__price-col">
            <span class="product-card__badge">${flavour.badge}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderProductGrid(container) {
  if (!container) return;
  container.innerHTML = FLAVOURS.map(renderProductCard).join('');
}

export { FLAVOURS };
