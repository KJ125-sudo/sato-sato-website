export const VENUES = [
  {
    name: 'Electric Sheep',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/electricsheepbkk/',
    maps: 'https://share.google/oNtfl07qVFpgAuyit',
  },
  {
    name: 'Muander',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/muander_bkk/',
    maps: 'https://tr.ee/UNrgXAPvAB',
  },
  {
    name: 'SatoSan',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/satosan.bkk/',
    maps: 'https://share.google/4BAHEISuPejjeqiOA',
  },
  {
    name: 'Jim Thompson',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/jimthompsonathairestaurant/?hl=en',
    maps: 'https://share.google/yH9pDW3AgLJhjcmeh',
  },
  {
    name: 'Siam @ Siam Design Hotel',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/siamatsiambangkok/?hl=en',
    maps: 'https://share.google/0bGZ2W8rGZBf2EyJ5',
  },
  {
    name: 'Intercontinental Phuket',
    location: 'Phuket',
    instagram: 'https://www.instagram.com/intercontinentalphuket/',
    maps: 'https://share.google/uPWG3mdcZ75FLfFvU',
  },
  {
    name: 'Rice 9',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/rice9gelato/',
    maps: 'https://share.google/oAiBRvXmFwZ3f72D1',
  },
  {
    name: 'Craft Estate',
    location: 'Bangkok',
    instagram: 'https://www.instagram.com/craft.estate/?hl=en',
    maps: 'https://share.google/8bNbkS8PT931WYfGC',
  },
];

const ICON_INSTAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`;

const ICON_MAP = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`;

function linkIcon(href, label, icon) {
  return `<a class="venue__link magnetic" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${icon}</a>`;
}

export function renderVenueCard(venue) {
  const links = [
    venue.instagram ? linkIcon(venue.instagram, `${venue.name} on Instagram`, ICON_INSTAGRAM) : '',
    venue.maps ? linkIcon(venue.maps, `${venue.name} on Google Maps`, ICON_MAP) : '',
  ].join('');

  return `
    <article class="venue">
      <p class="venue__name">${venue.name}</p>
      <p class="venue__type">${venue.location}</p>
      <div class="venue__links">${links}</div>
    </article>
  `;
}
