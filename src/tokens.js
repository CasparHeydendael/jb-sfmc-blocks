// Design tokens for the J&B component library.
// Layout values are measured from the Figma components library (DEPT copy, Oct 2026).
// Colours and fonts are still TBC: the Figma file has no variables and its styles couldn't be read yet.

export const tokens = {
  width: 640,
  // Figma uses different side padding per component type
  gutter: { desktop: 40, mobile: 28, text: 50, cards: 35, sideBySide: 30 },
  breakpoint: 660,

  color: {
    page: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#5C5C5C',
    rule: '#D9D9D9',
    footer: '#EEEDEC', // sampled from the component library mockups (TBC)
    ink: '#000000', // primary CTA fill, secondary CTA outline
    inkText: '#FFFFFF',
  },

  // Dark mode palette (TBC: needs design sign-off)
  dark: {
    page: '#121212',
    footer: '#1E1E1E',
    text: '#F2F2F2',
    muted: '#B3B3B3',
    rule: '#3A3A3A',
    ink: '#F2F2F2',
    inkText: '#121212',
  },

  // Brand fonts are Bembo Std (serif) and Mark OT (sans), per the component library PDF.
  // They only render where a licensed web font is loaded; everything else uses the fallbacks.
  font: {
    serif: "'Bembo Std',Georgia,serif",
    sans: "'Mark OT',Helvetica,Arial,sans-serif",
    serifMso: 'Georgia,serif',
    sansMso: 'Arial,sans-serif',
  },
  // { family: 'Bembo Std', weight: 400, style: 'normal', url: 'https://.../bembo.woff2' }
  webFonts: [],

  // Sizes from the Figma annotations (pt treated as px). Line heights are estimates (TBC).
  type: {
    headline: {
      S: { size: 21, lh: 26, m: { size: 18, lh: 23 } },
      M: { size: 30, lh: 36, m: { size: 26, lh: 32 } },
      L: { size: 40, lh: 46, m: { size: 40, lh: 46 } },
    },
    subheading: {
      S: { size: 13, lh: 18, m: { size: 13, lh: 18 } },
      M: { size: 16, lh: 22, m: { size: 16, lh: 22 } },
      L: { size: 20, lh: 26, m: { size: 20, lh: 26 } },
    },
    body: { size: 18, lh: 28, m: { size: 18, lh: 28 } },
    label: { size: 12, lh: 19, tracking: 1.5 }, // CTA labels, nav, eyebrows (sans, uppercase)
    small: { size: 13, lh: 19 }, // footer, captions
  },

  spacerPresets: [16, 24, 32, 48, 64],
  button: { padY: 14, padX: 20, border: 1 }, // 49px tall, as in Figma
  stackGap: 24, // vertical gap between stacked columns on mobile
};

// Brand assets. Production URLs must be absolute https (Content Builder image URLs), with a light
// and a dark-mode file each, exported at 2x. Real assets come from the Figma components library
// (exported at 2x, backgrounds keyed to transparent; sources in jb-email/assets/) and are hosted in
// Content Builder (DEPT sandbox, J&B Component Library folder). Remaining placeholders are marked.
const ph = (w, h, text, dark = false) => `https://placehold.co/${w * 2}x${h * 2}/${dark ? '121212/F2F2F2' : 'FFFFFF/1A1A1A'}/png?text=${encodeURIComponent(text)}`;
const icon = (size, name) => ({ src: ph(size, size, name), srcDark: ph(size, size, name, true) });
const cb = (id) => `https://image.s10.sfmc-content.com/lib/fe4a15707564047f771470/m/1/${id}.png`;
const pair = (light, dark) => ({ src: cb(light), srcDark: cb(dark) });

export const assets = {
  logo: { ...pair('865b49ba-5882-44d0-a4ea-5b2de6a958ba', '0efbb65f-6186-4ee7-9655-2594520d31bd'), width: 172, height: 39 },
  // Placeholder: Figma notes J&B still to supply the "N'61" mark
  monogram: { src: ph(40, 37, 'JB'), srcDark: ph(40, 37, 'JB', true), width: 40, height: 37 },
  arrow: { ...pair('a114296d-a17b-4a02-93c4-a6974797d4b3', 'b24ff34d-6c64-4c50-b084-3509a8e125f9'), width: 16, height: 16 },
  social: {
    instagram: { ...pair('a1985272-d3fc-4278-83c3-224911dd8a81', '6760b5b5-39fe-488f-a1c6-451d493a8a4c'), href: 'https://www.instagram.com/justerinis/', alt: 'Instagram' },
    facebook: { ...pair('e29c28d6-9cb9-4d23-8147-34a91831db9f', 'b67c9c5a-2684-4948-b8c5-2796bd7bb943'), href: 'https://www.facebook.com/justerinis/', alt: 'Facebook' },
    youtube: { ...pair('09ac00ba-5954-482c-92e5-3477f9fe9263', '0fa86928-f6e9-4b75-91a5-ddf6e19d35e2'), href: 'https://www.youtube.com/', alt: 'YouTube' },
    web: { ...pair('d704efae-4a17-4790-94ba-3bb62dd4dc82', 'd62fdf54-1673-484d-9bc3-70975ca65cf6'), href: 'https://www.justerinis.com/', alt: 'justerinis.com' },
  },
  // L9.2 service icons (labels from Figma, which differ from the PDF list).
  // Placeholders: Figma export blocked by the Collab seat limit; layers 321:42 (light) / 325:234 (dark)
  service: {
    store: { ...icon(36, 'Store'), label: 'Store with us' },
    sell: { ...icon(36, 'Sell'), label: 'Sell with us' },
    collect: { ...icon(36, 'Collect'), label: 'Collecting with us' },
    buy: { ...icon(36, 'Buy'), label: 'Buying with us' },
    events: { ...icon(36, 'Events'), label: 'Our events' },
    service: { ...icon(36, 'Help'), label: 'Customer service' },
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
