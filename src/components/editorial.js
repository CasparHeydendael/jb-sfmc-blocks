// Layer 8: editorial / producer authority, and Layer 9: action & service

import { tokens, assets } from '../tokens.js';
import { section, columns, spacer, rule, ruleWithImage, themedImage, headline, bodyText, button, image, escapeAttr, safeUrl, TABLE } from '../primitives.js';
import { on, text, join } from './util.js';

const { gutter, color, font } = tokens;

const bigNumber = (html) => `<p class="jb-sans jb-text" style="margin:0;font-family:${font.sans};font-size:30px;line-height:36px;color:${color.text};">${html}</p>`;

// L8.1 Critic score + tasting note: score, critic, publication | wine name, note.
// Vertical rule between the halves on desktop; horizontal rule when stacked on mobile.
export function criticScore(d) {
  const left = `<table ${TABLE} width="100%"><tr><td class="jb-stack-rule jb-rule" style="border-right:1px solid ${color.rule};padding-right:20px;">`
    + join(bigNumber(d.score), spacer(14), text({ kind: 'label', bold: true, html: d.critic }), on(d, 'publication') && text({ kind: 'small', className: 'jb-muted', html: d.publication }))
    + '</td></tr></table>';
  const right = join(text({ kind: 'label', bold: true, html: d.wine }), spacer(10), bodyText({ html: d.note }));
  return columns({ gutter: gutter.text, gap: 20, ratios: [194, 386], padTop: 40, padBottom: 40, cols: [left, right] });
}

// L8.2 Whisky tasting note: optional intro (image + headline + copy), then Nose / Body / Palate / Finish
// rows, each switchable via d.show.{nose,body,palate,finish}.
export function whiskyNote(d) {
  const intro = (on(d, 'image', d.image) || on(d, 'title')) && columns({
    gutter: gutter.text,
    gap: 26,
    ratios: [206, 360],
    padTop: 40,
    valign: 'middle',
    cols: [
      on(d, 'image', d.image) ? image({ src: d.image, alt: d.alt ?? d.title ?? '', width: 180, href: d.href, align: 'center', fluid: false }) : '',
      join(on(d, 'title') && headline({ text: d.title, size: 'M', level: 2 }), on(d, 'intro') && spacer(16) + bodyText({ html: d.intro })),
    ],
  });
  const notes = ['nose', 'body', 'palate', 'finish']
    .filter((k) => d.show?.[k] !== false && d.notes?.[k])
    .map((k) => join(rule(), spacer(10), text({ kind: 'label', bold: true, html: k }), spacer(6), bodyText({ html: d.notes[k] })))
    .join(spacer(24));
  return join(intro, section({ gutter: gutter.text, padTop: 30, padBottom: 40, content: notes }));
}

// L8.3 Quote: centred quote between large quotation marks, optional name and sub-title
export function quote(d) {
  const mark = (ch, valign) => `<td class="jb-quote-mark" width="60" valign="${valign}" style="width:60px;">`
    + `<p class="jb-serif jb-text" aria-hidden="true" style="margin:0;font-family:${font.serif};font-size:64px;line-height:48px;color:${color.text};text-align:${valign === 'top' ? 'left' : 'right'};">${ch}</p></td>`;
  const body = `<table ${TABLE} width="100%"><tr>${mark('&ldquo;', 'top')}`
    + `<td valign="middle" style="padding:36px 0;">${headline({ text: d.quote, size: 'S', align: 'center', italic: true, level: 2 })}</td>`
    + `${mark('&rdquo;', 'bottom')}</tr></table>`;
  return section({
    padTop: 25,
    padBottom: 25,
    content: join(
      body,
      on(d, 'name') && spacer(20) + text({ kind: 'label', bold: true, align: 'center', html: d.name }),
      on(d, 'subtitle') && spacer(6) + text({ kind: 'small', align: 'center', className: 'jb-muted', html: d.subtitle }),
    ),
  });
}

// L8.4 Article author sign-off: circular photo on a rule, name and title below.
// Supply the photo pre-cropped to a circle (PNG); border-radius covers the rest.
export function authorSignOff(d) {
  const photo = on(d, 'photo', d.photo)
    ? ruleWithImage({ imageHtml: image({ src: d.photo, alt: d.name ?? '', width: 70, round: true, align: 'center' }), imageWidth: 70, imageHeight: 70 })
    : rule();
  return section({
    padTop: 20,
    padBottom: 20,
    content: join(
      photo,
      on(d, 'name') && spacer(15) + text({ kind: 'label', bold: true, align: 'center', html: d.name }),
      on(d, 'title') && spacer(6) + text({ kind: 'small', align: 'center', className: 'jb-muted', html: d.title }),
    ),
  });
}

// L9.1 Event invitation: pre-title, headline, icon detail rows, description, CTA, optional add-to-calendar.
// d.details: [{ icon: 'date'|'time'|'location'|'availability'|'format'|'price', label, value }]
export function eventInvite(d) {
  const rows = (d.details ?? []).filter((r) => r.value).map((r) => {
    const ic = assets.event[r.icon];
    return `<tr><td width="20" valign="top" style="width:20px;padding:0 10px 20px 0;">${ic ? themedImage({ ...ic, width: 20, alt: '' }) : ''}</td>`
      + `<td valign="top" style="padding:0 0 20px 0;">${text({ kind: 'label', bold: true, html: r.label })}${spacer(5)}${text({ kind: 'small', html: r.value })}</td></tr>`;
  }).join('');
  return section({
    padTop: 40,
    padBottom: 40,
    content: join(
      on(d, 'pretitle') && text({ kind: 'label', html: d.pretitle }) + spacer(10),
      on(d, 'title') && headline({ text: d.title, size: 'M', level: 2 }) + spacer(30),
      rows && `<table ${TABLE} width="100%">${rows}</table>` + spacer(10),
      on(d, 'description') && bodyText({ html: d.description }) + spacer(30),
      on(d, 'cta', d.cta?.label) && button({ label: d.cta.label, href: d.cta.href, alias: 'event-cta' }),
      on(d, 'calendar', d.calendar?.href) && spacer(20) + button({ label: d.calendar.label ?? 'Add to calendar', href: d.calendar.href, variant: 'secondary', alias: 'event-calendar' }),
    ),
  });
}

// L9.2 Service quick links: 3, 4 or 6 linked icons.
// Desktop: 3 per row (4 → one row of 4). Mobile: 3 → one row, 4 → 2×2, 6 → 2×3.
export function serviceLinks(d) {
  const items = (d.items ?? []).map((i) => ({ ...assets.service[i.key], ...i })).filter((i) => i.src);
  const n = items.length;
  const cols = items.map((it, i) => {
    const url = safeUrl(it.href) ? it.href : '#';
    return `<a href="${escapeAttr(url)}" alias="service-${it.key}" style="display:block;text-decoration:none;">`
      + themedImage({ src: it.src, srcDark: it.srcDark, alt: '', width: 36 })
      + spacer(10)
      + text({ kind: 'label', align: 'center', tag: 'div', html: it.label })
      + '</a>';
  });
  return columns({ gutter: gutter.desktop, gap: 20, perRow: n === 4 ? 4 : 3, rowGap: 20, mobile: n === 3 ? 3 : 2, padTop: 20, padBottom: 20, cols });
}

const url = 'https://www.justerinis.com/';
const ph = (w, h, t) => `https://placehold.co/${w * 2}x${h * 2}/D9D9D9/5C5C5C/png?text=${encodeURIComponent(t)}`;
const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.';

export const editorialSamples = {
  'L8.1': { name: 'Critic score + tasting note', render: criticScore, samples: [{ label: 'Score left, note right', data: { score: '98/100', critic: 'Critic name', publication: 'Publication name', wine: 'Château Example 2019', note: lorem } }] },
  'L8.2': {
    name: 'Whisky tasting note',
    render: whiskyNote,
    samples: [{ label: 'Intro + four notes', data: { image: ph(180, 300, 'Bottle'), title: 'Distillery release 18 Year Old', intro: 'Intro copy for the release.', notes: { nose: lorem, body: lorem, palate: lorem, finish: lorem } } }],
  },
  'L8.3': { name: 'Quote', render: quote, samples: [{ label: 'With name and title', data: { quote: 'A vintage of extraordinary balance; the finest we have tasted in a decade.', name: 'Winemaker name', subtitle: 'Domaine Example' } }] },
  'L8.4': { name: 'Author sign-off', render: authorSignOff, samples: [{ label: 'Photo, name, title', data: { photo: 'https://placehold.co/140x140/D9D9D9/5C5C5C/png?text=Photo', name: 'Author name', title: 'Fine Wine Buyer' } }] },
  'L9.1': {
    name: 'Event invitation',
    render: eventInvite,
    samples: [{
      label: 'All fields',
      data: {
        pretitle: 'Private client invitation',
        title: 'An evening of Burgundy',
        details: [
          { icon: 'date', label: 'Date', value: 'Thursday 4 December 2026' },
          { icon: 'time', label: 'Time', value: '18:30 – 21:00' },
          { icon: 'location', label: 'Location', value: 'Justerini &amp; Brooks<br>61 St. James Street<br>London SW1A 1LZ' },
          { icon: 'availability', label: 'Availability', value: 'Limited to 30 guests' },
          { icon: 'format', label: 'Format', value: 'Seated tasting' },
          { icon: 'price', label: 'Price', value: '£150 per person' },
        ],
        description: lorem,
        cta: { label: 'Reserve your place', href: url },
        calendar: { label: 'Add to calendar', href: url },
      },
    }],
  },
  'L9.2': {
    name: 'Service quick links',
    render: serviceLinks,
    samples: [
      { label: '6 icons (mobile 2×3)', data: { items: ['store', 'sell', 'collect', 'buy', 'events', 'service'].map((key) => ({ key, href: url })) } },
      { label: '4 icons (mobile 2×2)', data: { items: ['store', 'sell', 'events', 'service'].map((key) => ({ key, href: url })) } },
      { label: '3 icons (one row)', data: { items: ['buy', 'events', 'service'].map((key) => ({ key, href: url })) } },
    ],
  },
};

