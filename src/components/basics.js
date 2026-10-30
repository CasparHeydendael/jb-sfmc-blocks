// Layers 2–5: typography, media, CTA, divider & spacer

import { tokens, assets } from '../tokens.js';
import { section, spacer, rule, ruleWithImage, themedImage, headline as h, subheading as sub, bodyText, button, image } from '../primitives.js';
import { join } from './util.js';

const { gutter } = tokens;
const pad = { padTop: 20, padBottom: 20 };

// L2.1 Headline: size S/M/L, left/centre, bold/italic
export const headline = (d) => section({ gutter: gutter.text, ...pad, content: h({ text: d.text, size: d.size ?? 'M', align: d.align, bold: d.bold, italic: d.italic, level: d.level ?? 1 }) });

// L2.2 Sub-heading / campaign strapline: serif or uppercase eyebrow
export const subheading = (d) => section({ gutter: gutter.text, ...pad, content: sub({ text: d.text, size: d.size ?? 'M', align: d.align, bold: d.bold, italic: d.italic, variant: d.style ?? 'serif' }) });

// L2.3 Rich text body
export const body = (d) => section({ gutter: gutter.text, ...pad, content: bodyText({ html: d.html, align: d.align }) });

// L3.1 Hero image / L3.2 full-width image break. Full bleed; GIFs work as-is (first frame must
// carry the message). Video: the thumbnail must have the play button baked in, and links to the video.
function mediaImage(d, alias) {
  const alt = d.kind === 'video' && d.alt ? `Play video: ${d.alt}` : d.alt;
  const framed = d.border && d.borderWidth;
  return section({
    gutter: framed ? gutter.desktop : 0,
    content: image({
      src: d.src,
      mobileSrc: d.mobileSrc,
      alt,
      width: framed ? tokens.width - 2 * gutter.desktop : tokens.width,
      href: d.href,
      alias,
      frame: framed ? { width: d.borderWidth, color: d.borderColor } : undefined,
    }),
  });
}
export const hero = (d) => mediaImage(d, 'hero');
export const imageBreak = (d) => mediaImage(d, 'image-break');

// L4.1 Single CTA: primary / secondary / arrow; label left or centred
export const cta = (d) => section({ padTop: 25, padBottom: 25, content: button({ label: d.label, href: d.href, variant: d.variant ?? 'primary', align: d.align, alias: d.alias ?? 'cta' }) });

// L4.2 Double CTA: primary above secondary, 20px apart
export const doubleCta = (d) => section({
  padTop: 25,
  padBottom: 25,
  content: join(
    button({ label: d.primary.label, href: d.primary.href, variant: 'primary', align: d.align, alias: 'cta-primary' }),
    spacer(20),
    button({ label: d.secondary.label, href: d.secondary.href, variant: 'secondary', align: d.align, alias: 'cta-secondary' }),
  ),
});

// L5.1 Divider & spacer
//   variant 'monogram' (line + J&B mark), 'line', 'spacer' (height from tokens.spacerPresets)
export function divider(d) {
  if (d.variant === 'spacer') {
    const height = tokens.spacerPresets.includes(d.height) ? d.height : 32;
    return spacer(height);
  }
  if (d.variant === 'line') return section({ gutter: gutter.text, padTop: 24, padBottom: 24, content: rule() });
  const m = assets.monogram;
  return section({
    gutter: gutter.text,
    padTop: 13,
    padBottom: 13,
    content: ruleWithImage({ imageHtml: themedImage({ ...m, alt: '' }), imageWidth: m.width, imageHeight: m.height }),
  });
}

const url = 'https://www.justerinis.com/';
const ph = (w, h, t) => `https://placehold.co/${w * 2}x${h * 2}/D9D9D9/5C5C5C/png?text=${encodeURIComponent(t)}`;
const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.';

export const basicsSamples = {
  'L2.1': {
    name: 'Headline',
    render: headline,
    samples: [
      { label: 'L · left', data: { text: 'Headline L', size: 'L' } },
      { label: 'M · centred', data: { text: 'Headline M', size: 'M', align: 'center' } },
      { label: 'S · bold italic', data: { text: 'Headline S', size: 'S', bold: true, italic: true } },
    ],
  },
  'L2.2': {
    name: 'Sub-heading / strapline',
    render: subheading,
    samples: [
      { label: 'L · serif', data: { text: 'Campaign strapline in serif', size: 'L' } },
      { label: 'M · italic centred', data: { text: '“An opening authority quote”', size: 'M', italic: true, align: 'center' } },
      { label: 'S · eyebrow', data: { text: 'Section eyebrow label', size: 'S', style: 'eyebrow' } },
    ],
  },
  'L2.3': {
    name: 'Rich text body',
    render: body,
    samples: [{ label: 'Left', data: { html: `<p>${lorem} <b>Bold</b>, <i>italic</i>, <u>underline</u> and a <a href="${url}">link</a>.</p><p>${lorem}</p>` } }],
  },
  'L3.1': {
    name: 'Hero image',
    render: hero,
    samples: [
      { label: 'Image, separate mobile crop', data: { src: ph(640, 400, 'Hero 640x400'), mobileSrc: ph(375, 280, 'Mobile 375x280'), alt: 'Hero placeholder', href: url } },
      { label: 'With 6px border', data: { src: ph(560, 320, 'Bordered hero'), alt: 'Hero placeholder', border: true, borderWidth: 6, href: url } },
      { label: 'Video thumbnail', data: { kind: 'video', src: ph(640, 360, '▶ Video thumbnail'), alt: 'Meet the winemaker', href: 'https://www.youtube.com/' } },
    ],
  },
  'L3.2': {
    name: 'Full-width image break',
    render: imageBreak,
    samples: [{ label: '640x300, mobile 375x160', data: { src: ph(640, 300, 'Image break 640x300'), mobileSrc: ph(375, 160, 'Mobile 375x160'), alt: '' } }],
  },
  'L4.1': {
    name: 'Single CTA',
    render: cta,
    samples: [
      { label: 'Primary · left', data: { label: 'CTA button text goes here', href: url } },
      { label: 'Secondary · centred', data: { label: 'CTA button text goes here', href: url, variant: 'secondary', align: 'center' } },
      { label: 'Arrow + text', data: { label: 'CTA button text goes here', href: url, variant: 'arrow' } },
    ],
  },
  'L4.2': {
    name: 'Double CTA',
    render: doubleCta,
    samples: [{ label: 'Centred', data: { align: 'center', primary: { label: 'Primary action', href: url }, secondary: { label: 'Secondary action', href: url } } }],
  },
  'L5.1': {
    name: 'Divider & spacer',
    render: divider,
    samples: [
      { label: 'Line + monogram', data: { variant: 'monogram' } },
      { label: 'Line only', data: { variant: 'line' } },
      { label: 'Spacer 48', data: { variant: 'spacer', height: 48 } },
    ],
  },
};
