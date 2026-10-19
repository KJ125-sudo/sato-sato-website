export const PLACES = [
  {
    name: 'Bottle Rockets',
    area: 'Silom · Rama IV Road',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/bottlerockets_bar/',
    image: '/images/places/bottle-rockets.jpg',
    alt: 'Bottle Rockets entrance on Rama IV Road in Silom at night',
  },
  {
    name: 'Muander',
    area: 'Yenakart · Soi Sribhumphen',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/muander_bkk/',
    maps: 'https://tr.ee/UNrgXAPvAB',
    venueName: 'Muander',
    image: '/images/places/muander.jpg',
    alt: 'Muander storefront on Soi Sribhumphen, Yenakart, with the neon sign lit',
  },
  {
    name: 'Nuaniyom',
    area: 'Silom Soi 3',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/nuaniyom/',
    image: '/images/places/nuaniyom.jpg',
    alt: 'Nuaniyom dining room seen from the street on Silom Soi 3',
  },
  {
    name: 'Sato Samosorn',
    area: 'Victory Monument',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/sato.sammosorn/',
    image: '/images/places/sato-samosorn.jpg',
    alt: 'The counter at Sato Samosorn near Victory Monument, with the kitchen open behind it',
  },
  {
    name: 'Sato San',
    area: 'Ratchaprasong · Moxy Bangkok',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/satosan.bkk/',
    maps: 'https://share.google/4BAHEISuPejjeqiOA',
    venueName: 'SatoSan',
    image: '/images/places/sato-san.jpg',
    alt: 'Woven lamps on the terrace at Sato San, Moxy Bangkok, Ratchaprasong',
  },
  {
    name: 'Electric Sheep',
    area: 'The Warehouse · Talad Noi',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/electricsheepbkk/',
    maps: 'https://share.google/oNtfl07qVFpgAuyit',
    venueName: 'Electric Sheep',
    image: '/images/places/electric-sheep.jpg',
    alt: 'Electric Sheep doorway at The Warehouse, Talad Noi',
  },
  {
    name: 'Rice 9',
    area: 'The Warehouse · Talad Noi',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/rice9gelato/',
    maps: 'https://share.google/oAiBRvXmFwZ3f72D1',
    venueName: 'Rice 9',
    image: '/images/places/rice-9.jpg',
    alt: 'Rice 9 storefront at The Warehouse, Talad Noi, seen through painted glass',
  },
  {
    name: 'Craft Estate',
    area: 'Bang Si Muang · Nonthaburi',
    location: 'Nonthaburi',
    instagram: 'https://www.instagram.com/craft.estate/',
    maps: 'https://share.google/8bNbkS8PT931WYfGC',
    venueName: 'Craft Estate',
    image: '/images/places/craft-estate.jpg',
    alt: 'Craft Estate rooftop at dusk in Bang Si Muang, Nonthaburi',
  },
];

const ICON_MAP = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`;

export function renderPlaces(places) {
  return places
    .map((place) => {
      const map = place.maps
        ? `<a class="place__map" href="${place.maps}" target="_blank" rel="noopener noreferrer" aria-label="${place.name} on Google Maps" data-track="venue_map">${ICON_MAP}</a>`
        : '';

      return `
        <article class="place">
          <a class="place__link" href="${place.instagram}" target="_blank" rel="noopener noreferrer" aria-label="${place.name} on Instagram">
            <img src="${place.image}" alt="${place.alt}" width="800" height="1000" loading="lazy">
            <span class="place__mark" aria-hidden="true">Instagram</span>
          </a>
          ${map}
        </article>
      `;
    })
    .join('');
}
