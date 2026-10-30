// Layer 6: card system. Every card element (image, title, body, CTA) can be toggled off
// via d.show.{image,title,body,cta} or by leaving the field empty.

import { tokens } from '../tokens.js';
import { section, columns, columnWidth, spacer, headline, subheading, bodyText, button, image } from '../primitives.js';
import { on, join } from './util.js';

const { gutter } = tokens;
const grid2 = { gutter: gutter.cards, gap: 30 }; // Figma 2-card / 4-card: 270px columns
const grid3 = { gutter: gutter.cards, gap: 15 }; // Figma 3-card: 180px columns

// One card's content stack. Spacing follows Figma: image → 28 → title → 20 → body → 24 → CTA.
function cardStack(c, { width, titleSize = 'S', ctaVariant = 'primary', alias }) {
  const parts = [];
  if (on(c, 'image', c.image)) parts.push(image({ src: c.image, alt: c.alt ?? '', width, href: c.href, alias: alias && `${alias}-image` }));
  if (on(c, 'eyebrow')) parts.push(subheading({ text: c.eyebrow, size: 'S', variant: 'eyebrow', level: 3 }));
  if (on(c, 'title')) parts.push(headline({ text: c.title, size: titleSize, level: 3 }));
  if (on(c, 'body')) parts.push(bodyText({ html: c.body }));
  if (on(c, 'cta', c.cta?.label)) parts.push(button({ label: c.cta.label, href: c.cta.href, variant: c.cta.variant ?? ctaVariant, alias: alias && `${alias}-cta` }));

  const gaps = { image: 28, eyebrow: 12, title: 20, body: 24 };
  const kinds = ['image', 'eyebrow', 'title', 'body', 'cta'].filter((k) => on(c, k, k === 'image' ? c.image : k === 'cta' ? c.cta?.label : c[k]));
  return parts.map((p, i) => (i < parts.length - 1 ? p + spacer(gaps[kinds[i]]) : p)).join('');
}

// L6.1 1-card
//   layout 'stacked' (full-bleed 640 image, content below) or 'side' (270 image beside copy)
//   imageSide 'left' | 'right' for side-by-side; mobile always shows the image first
export function oneCard(d) {
  if (d.layout === 'side') {
    const g = { gutter: gutter.sideBySide, gap: 27, ratios: [297, 310] };
    const img = on(d, 'image', d.image) ? image({ src: d.image, alt: d.alt ?? '', width: columnWidth(2, { ...g, index: 0 }), href: d.href, alias: 'card-image' }) : '';
    const copy = cardStack({ ...d, show: { ...d.show, image: false } }, { width: 283, alias: 'card' });
    if (!img) return section({ gutter: gutter.desktop, padTop: 30, padBottom: 30, content: copy });
    return columns({ ...g, padTop: 30, padBottom: 30, valign: 'middle', reverse: d.imageSide === 'right', cols: [img, copy] });
  }

  const img = on(d, 'image', d.image) ? section({ gutter: 0, content: image({ src: d.image, alt: d.alt ?? '', width: tokens.width, href: d.href, alias: 'card-image' }) }) : '';
  const copy = cardStack({ ...d, show: { ...d.show, image: false } }, { width: 560, titleSize: 'M', alias: 'card' });
  return join(img, copy && section({ padTop: 30, padBottom: 30, content: copy }));
}

// L6.2 2-cards, L6.4 4-cards (2×2): 270px columns, stack on mobile
export function twoCards(d) {
  const w = columnWidth(2, grid2);
  return columns({ ...grid2, padTop: 35, padBottom: 35, cols: d.cards.slice(0, 2).map((c, i) => cardStack({ ...c, show: { ...d.show, ...c.show } }, { width: w, alias: `card-${i + 1}` })) });
}

export function fourCards(d) {
  const w = columnWidth(2, grid2);
  return columns({ ...grid2, perRow: 2, rowGap: 40, padTop: 35, padBottom: 35, cols: d.cards.slice(0, 4).map((c, i) => cardStack({ ...c, show: { ...d.show, ...c.show } }, { width: w, alias: `card-${i + 1}` })) });
}

// L6.3 3-cards
//   variant 'copy': title, body, CTA (image optional); stacks on mobile
//   variant 'image': linked image + optional title; stays 3 across on mobile (Figma: 100px tiles)
export function threeCards(d) {
  const w = columnWidth(3, grid3);
  if (d.variant === 'image') {
    const cols = d.cards.slice(0, 3).map((c, i) => join(
      image({ src: c.image, alt: c.alt ?? c.title ?? '', width: w, href: c.href, alias: `tile-${i + 1}` }),
      on({ ...c, show: { ...d.show, ...c.show } }, 'title') && spacer(8) + subheading({ text: c.title, size: 'S', variant: 'eyebrow', level: 3 }),
    ));
    return columns({ ...grid3, mobile: 3, padTop: 30, padBottom: 30, cols });
  }
  return columns({ ...grid3, padTop: 30, padBottom: 30, cols: d.cards.slice(0, 3).map((c, i) => cardStack({ ...c, show: { ...d.show, ...c.show } }, { width: w, alias: `card-${i + 1}` })) });
}

const url = 'https://www.justerinis.com/';
const ph = (w, h, t) => `https://placehold.co/${w * 2}x${h * 2}/D9D9D9/5C5C5C/png?text=${encodeURIComponent(t)}`;
const card = (n, w, h) => ({ image: ph(w, h, `${w}x${h}`), alt: `Card ${n}`, href: url, title: `Heading ${n}`, body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien.', cta: { label: 'CTA button text', href: url } });

export const cardSamples = {
  'L6.1': {
    name: '1-card',
    render: oneCard,
    samples: [
      { label: 'Stacked', data: { layout: 'stacked', ...card(1, 640, 400), title: 'Producer profile', body: 'Copy-heavy section, new product announcement or featured article.' } },
      { label: 'Side by side · image left', data: { layout: 'side', ...card(2, 270, 270) } },
      { label: 'Side by side · image right, no CTA', data: { layout: 'side', imageSide: 'right', ...card(3, 270, 270), show: { cta: false } } },
    ],
  },
  'L6.2': { name: '2-cards', render: twoCards, samples: [{ label: 'All elements', data: { cards: [card(1, 270, 270), card(2, 270, 270)] } }] },
  'L6.3': {
    name: '3-cards',
    render: threeCards,
    samples: [
      { label: 'Copy + CTA (stacks on mobile)', data: { variant: 'copy', cards: [1, 2, 3].map((n) => card(n, 180, 165)) } },
      { label: 'Image + title (3 across on mobile)', data: { variant: 'image', cards: [1, 2, 3].map((n) => card(n, 180, 165)) } },
    ],
  },
  'L6.4': { name: '4-cards (2×2)', render: fourCards, samples: [{ label: 'No body copy', data: { show: { body: false }, cards: [1, 2, 3, 4].map((n) => card(n, 270, 270)) } }] },
};
