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

// Brand assets. Placeholders until J&B supplies files; production URLs must be absolute https
// (e.g. Content Builder image URLs). Each needs a light and a dark-mode version, exported at 2x.
const ph = (w, h, text, dark = false) => `https://placehold.co/${w * 2}x${h * 2}/${dark ? '121212/F2F2F2' : 'FFFFFF/1A1A1A'}/png?text=${encodeURIComponent(text)}`;
const icon = (size, name) => ({ src: ph(size, size, name), srcDark: ph(size, size, name, true) });

export const assets = {
  logo: { src: ph(172, 39, 'Justerini & Brooks'), srcDark: ph(172, 39, 'Justerini & Brooks', true), width: 172, height: 39 },
  monogram: { src: ph(40, 37, 'JB'), srcDark: ph(40, 37, 'JB', true), width: 40, height: 37 }, // "N'61" mark, pending J&B decision
  social: {
    instagram: { ...icon(16, 'IG'), href: 'https://www.instagram.com/justerinis/', alt: 'Instagram' },
    facebook: { ...icon(16, 'FB'), href: 'https://www.facebook.com/justerinis/', alt: 'Facebook' },
    youtube: { ...icon(16, 'YT'), href: 'https://www.youtube.com/', alt: 'YouTube' },
    web: { ...icon(16, 'WWW'), href: 'https://www.justerinis.com/', alt: 'justerinis.com' },
  },
  // L9.2 service icons (labels from Figma, which differ from the PDF list)
  service: {
    store: { ...icon(36, 'Store'), label: 'Store with us' },
    sell: { ...icon(36, 'Sell'), label: 'Sell with us' },
    collect: { ...icon(36, 'Collect'), label: 'Collecting with us' },
    buy: { ...icon(36, 'Buy'), label: 'Buying with us' },
    events: { ...icon(36, 'Events'), label: 'Our events' },
    service: { ...icon(36, 'Help'), label: 'Customer service' },
  },
  // L9.1 event detail icons
  event: {
    date: icon(20, 'D'), time: icon(20, 'T'), location: icon(20, 'L'),
    availability: icon(20, 'A'), format: icon(20, 'F'), price: icon(20, '£'),
  },
};

// Usable content width inside a gutter (default 40 → 560)
export const contentWidth = (gutter = tokens.gutter.desktop) => tokens.width - 2 * gutter;
