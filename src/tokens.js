// Design tokens for the J&B component library.
// Layout values are measured from the Figma components library (DEPT copy, Oct 2026).
// Colours and type are read from the Figma component frames (Nov 2026); the file has no variables.

export const tokens = {
  width: 640,
  // Figma uses different side padding per component type
  gutter: { desktop: 40, mobile: 28, text: 50, cards: 35, sideBySide: 30 },
  breakpoint: 660,

  color: {
    page: '#FFFFFF',
    text: '#000000',
    muted: '#5C5C5C',
    rule: '#D9D9D9',
    footer: '#EAE9E8',
    ink: '#000000', // primary CTA fill, secondary CTA outline
    inkText: '#FFFFFF',
  },

  // Dark mode palette, from the Figma dark frames (pure black, white text). Muted and rule are estimates.
  dark: {
    page: '#000000',
    footer: '#000000',
    text: '#FFFFFF',
    muted: '#B3B3B3',
    rule: '#3A3A3A',
    ink: '#FFFFFF',
    inkText: '#000000',
  },

  // Brand fonts per Figma: Bembo Book MT Pro (body) and Mark OT Medium (headlines, CTAs, labels).
  // They only render where a licensed web font is loaded; everything else uses the fallbacks.
  font: {
    serif: "'Bembo Book MT Pro',Georgia,serif",
    sans: "'Mark OT',Helvetica,Arial,sans-serif",
    serifMso: 'Georgia,serif',
    sansMso: 'Arial,sans-serif',
  },
  // { family: 'Bembo Std', weight: 400, style: 'normal', url: 'https://.../bembo.woff2' }
  webFonts: [],

  // Sizes from Figma. Headlines are Mark OT Medium, uppercase, line-height 'normal' (about 1.2).
  type: {
    headline: {
      S: { size: 21, lh: 26, m: { size: 18, lh: 23 } },
      M: { size: 30, lh: 36, m: { size: 26, lh: 32 } },
      L: { size: 40, lh: 48, m: { size: 40, lh: 48 } },
    },
    subheading: {
      S: { size: 13, lh: 18, m: { size: 13, lh: 18 } },
      M: { size: 16, lh: 22, m: { size: 16, lh: 22 } },
      L: { size: 20, lh: 26, m: { size: 20, lh: 26 } },
    },
    body: { size: 18, lh: 28, m: { size: 18, lh: 28 } },
    label: { size: 12, lh: 19, tracking: 1.5 }, // nav, eyebrows (sans, uppercase). Figma nav is 10px; kept at 12 for legibility
    cta: { size: 16, lh: 19, tracking: 1.6 }, // Mark OT Medium, uppercase
    small: { size: 13, lh: 19 }, // footer, captions
  },

  spacerPresets: [16, 24, 32, 48, 64],
  button: { padY: 14, padX: 20, border: 1 }, // 49px tall, as in Figma
  stackGap: 24, // vertical gap between stacked columns on mobile
};

// Brand assets. Production URLs must be absolute https (Content Builder image URLs), with a light
// and a dark-mode file each, exported at 2x. Real assets come from the Figma components library
// (exported at 2x, backgrounds keyed to transparent; sources in jb-email/assets/) and are hosted in
// Content Builder (DEPT sandbox, J&B Component Library folder).
const cb = (id) => `https://image.s10.sfmc-content.com/lib/fe4a15707564047f771470/m/1/${id}.png`;
const pair = (light, dark) => ({ src: cb(light), srcDark: cb(dark) });

export const assets = {
  logo: { ...pair('865b49ba-5882-44d0-a4ea-5b2de6a958ba', '0efbb65f-6186-4ee7-9655-2594520d31bd'), width: 172, height: 39 },
  // N°61 roundel from Figma (14:458 light / 50:559 dark)
  monogram: { ...pair('e1527e92-574d-4cc7-bb7a-869066159842', '5efb73b6-9830-4aaf-a0fe-8de0757d6a70'), width: 39, height: 39 },
  arrow: { ...pair('a114296d-a17b-4a02-93c4-a6974797d4b3', 'b24ff34d-6c64-4c50-b084-3509a8e125f9'), width: 16, height: 16 },
  social: {
    instagram: { ...pair('a1985272-d3fc-4278-83c3-224911dd8a81', '6760b5b5-39fe-488f-a1c6-451d493a8a4c'), href: 'https://www.instagram.com/justerinis/', alt: 'Instagram' },
    facebook: { ...pair('e29c28d6-9cb9-4d23-8147-34a91831db9f', 'b67c9c5a-2684-4948-b8c5-2796bd7bb943'), href: 'https://www.facebook.com/justerinis/', alt: 'Facebook' },
    youtube: { ...pair('09ac00ba-5954-482c-92e5-3477f9fe9263', '0fa86928-f6e9-4b75-91a5-ddf6e19d35e2'), href: 'https://www.youtube.com/', alt: 'YouTube' },
    web: { ...pair('d704efae-4a17-4790-94ba-3bb62dd4dc82', 'd62fdf54-1673-484d-9bc3-70975ca65cf6'), href: 'https://www.justerinis.com/', alt: 'justerinis.com' },
  },
  // L9.2 service icons (labels from Figma, which differ from the PDF list).
  // Figma frames 321:42 (light) / 325:234 (dark); 38px boxes, each icon centred
  service: {
    store: { ...pair('e86693f6-7bd8-4064-b070-f50c9b004e79', '752052c0-ade7-4afa-ab73-2b05b38a373c'), label: 'Store with us' },
    sell: { ...pair('18e90fbb-188c-41e9-b3dd-9f58b736a0fe', 'b7181ca3-4259-460f-a003-7a50f188d3a9'), label: 'Sell with us' },
    collect: { ...pair('72351e58-d8dc-4d47-83f3-ca55644ac095', '3426d9d8-a90d-43cd-b4ec-4eed4b9f3bbf'), label: 'Collecting with us' },
    buy: { ...pair('45250312-ef33-4f24-8766-6ffa6d2023e3', '9cbde3a0-b672-48cc-94f6-87b2b0c30ca9'), label: 'Buying with us' },
    events: { ...pair('ee0017a9-c2c0-405b-94cc-f324f078fa6d', '6a7c774d-3ccc-4b28-8152-a38ffe45a2b7'), label: 'Our events' },
    service: { ...pair('7c1146a4-1b69-4d47-859c-e62affbde82e', '7eba98ac-cb86-4097-9206-109b01a21f58'), label: 'Customer service' },
  },
  // L9.1 event detail icons (dark versions recoloured from the light export)
  event: {
    date: pair('ad862810-7e16-4d7e-b097-9407638bc114', 'd54d8d4b-1aa0-4d73-9571-f97d5d4e41ad'),
    time: pair('378a2fb9-8169-46b0-9643-cc7fed1d0eed', 'ca93ff07-0b20-4b68-84a1-17bdc13772f5'),
    location: pair('43e3aeee-fea7-4bf3-9e08-1a01735f14be', '52bcbddf-59e3-4e4d-ae90-a708bd3ffd8c'),
    availability: pair('b0959a3f-4d80-4447-bdaa-d598c741eb62', '0ed59948-178a-4651-b2a8-673838042c00'),
    format: pair('b7009b5a-86ce-426b-8853-90e6fea9baa3', '496e5764-2af9-488f-b3a8-92254253d377'),
    price: pair('36680137-2ae2-4ee4-b475-d5a19a1786f2', '0860eba7-1a74-4169-a6e8-559ebf46ff59'),
  },
};

// Usable content width inside a gutter (default 40 → 560)
export const contentWidth = (gutter = tokens.gutter.desktop) => tokens.width - 2 * gutter;
