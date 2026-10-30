// Layer 7: product components

import { tokens } from '../tokens.js';
import { section, columns, columnWidth, spacer, rule, headline, subheading, bodyText, button, image, TABLE } from '../primitives.js';
import { on, text, join } from './util.js';

const { gutter } = tokens;
const grid2 = { gutter: gutter.cards, gap: 30 };

// Subtitle (category / region / producer) → name → description → CTA
function productCopy(p, { alias, titleSize = 'S' }) {
  const parts = [
    on(p, 'subtitle') && subheading({ text: p.subtitle, size: 'S', variant: 'eyebrow', level: 3 }),
    on(p, 'title') && headline({ text: p.title, size: titleSize, level: 3 }),
    on(p, 'body') && bodyText({ html: p.body }),
    on(p, 'cta', p.cta?.label) && button({ label: p.cta.label, href: p.cta.href, alias: alias && `${alias}-cta` }),
  ].filter(Boolean);
  return parts.join(spacer(16));
}

// L7.1 Single product: 180px bottle image left, content right; stacks on mobile
export function singleProduct(d) {
  const g = { gutter: gutter.desktop, gap: 26, ratios: [206, 380] };
  const img = on(d, 'image', d.image) && image({ src: d.image, alt: d.alt ?? d.title ?? '', width: 180, href: d.href, alias: 'product-image', align: 'center', fluid: false });
  const copy = productCopy(d, { alias: 'product', titleSize: 'M' });
  if (!img) return section({ padTop: 27, padBottom: 27, content: copy });
  return columns({ ...g, valign: 'middle', padTop: 27, padBottom: 27, cols: [img, copy] });
}

// L7.2 Double product: two 270px cards (bottle image, subtitle, title, body, CTA); stack on mobile.
// Repeat the component for more rows.
export function doubleProduct(d) {
  const w = columnWidth(2, grid2);
  const cols = d.products.slice(0, 2).map((p, i) => {
    const item = { ...p, show: { ...d.show, ...p.show } };
    return join(
      on(item, 'image', p.image) && image({ src: p.image, alt: p.alt ?? p.title ?? '', width: w, href: p.href, alias: `product-${i + 1}-image` }) + spacer(28),
      productCopy(item, { alias: `product-${i + 1}` }),
    );
  });
  return columns({ ...grid2, padTop: 35, padBottom: 35, cols });
}

// L7.3 List / collector view: one row per product. Image (optional) | name, details | price + CTA.
// The row stays horizontal on mobile; price and CTA drop below the details.
export function productList(d) {
  const showImage = d.show?.image !== false;
  const rows = d.products.map((p, i) => {
    const details = join(
      text({ kind: 'label', bold: true, html: p.title }),
      spacer(6),
      p.details && text({ kind: 'small', className: 'jb-muted', html: p.details }),
    );
    const priceCta = join(
      text({ kind: 'small', bold: true, html: p.price, className: 'jb-price' }),
      spacer(8),
      button({ label: p.cta?.label ?? 'Buy', href: p.cta?.href ?? p.href, size: 'small', width: 'full', align: 'center', alias: `list-${i + 1}-cta` }),
    );
    const hasImage = showImage && p.image;
    const info = columns({ width: hasImage ? 470 : 560, gap: 10, ratios: [350, 110], valign: 'middle', cols: [details, priceCta] });
    const img = hasImage
      ? `<td width="80" valign="top" style="width:80px;padding-right:10px;">${image({ src: p.image, alt: p.alt ?? p.title, width: 80, href: p.href, alias: `list-${i + 1}-image`, fluid: false })}</td>`
      : '';
    return rule() + `<table ${TABLE} width="100%"><tr>${img}<td valign="middle" style="padding:15px 0;">${info}</td></tr></table>`;
  });
  return section({ padTop: 30, padBottom: 30, content: rows.join('') + rule() });
}

const url = 'https://www.justerinis.com/';
const ph = (w, h, t) => `https://placehold.co/${w * 2}x${h * 2}/D9D9D9/5C5C5C/png?text=${encodeURIComponent(t)}`;
const product = (n, w, h) => ({ image: ph(w, h, `${w}x${h}`), alt: `Product ${n}`, href: url, subtitle: 'Piedmont · Barolo', title: `Product name ${n}`, body: 'Short product description with tasting cues and provenance.', cta: { label: 'Shop now', href: url } });
const listItem = (n) => ({ image: ph(80, 140, 'Bottle'), title: `Château Example ${2018 + n}`, details: '6 × 75cl · In bond<br>Pauillac, Bordeaux', price: `£${(420 + n * 35).toFixed(2)}`, href: url, cta: { label: 'Buy', href: url } });

export const productSamples = {
  'L7.1': { name: 'Single product', render: singleProduct, samples: [{ label: 'Bottle left', data: { ...product(1, 180, 365), title: 'Barolo Riserva 2016', body: 'An icon wine warranting full editorial prominence: limited release, single vineyard.' } }] },
  'L7.2': { name: 'Double product', render: doubleProduct, samples: [{ label: 'Two products', data: { products: [product(1, 270, 270), product(2, 270, 270)] } }] },
  'L7.3': {
    name: 'List / collector view',
    render: productList,
    samples: [
      { label: 'With bottle images', data: { products: [1, 2, 3].map(listItem) } },
      { label: 'Without images', data: { show: { image: false }, products: [4, 5, 6].map(listItem) } },
    ],
  },
};
