// Shared building blocks. Every function is pure (data in, HTML string out) so the same
// code runs in the Node build and inside the Content Builder custom blocks.

import { tokens, contentWidth, assets } from './tokens.js';

const { color, font, type } = tokens;
// border="0" is the default, so it's left out to save weight
const TABLE = 'role="presentation" cellpadding="0" cellspacing="0"';

// ---------------------------------------------------------------------------
// Escaping and rich text

export function escapeText(str) {
  return String(str ?? '')
    .replace(/&(?!(#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);)/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeAttr(str) {
  return escapeText(str).replace(/"/g, '&quot;');
}

// http(s), mailto, tel, anchors, or SFMC personalisation (%%...%%)
export function safeUrl(url) {
  return typeof url === 'string' && /^(https?:\/\/|mailto:|tel:|#|%%)/i.test(url.trim());
}

const linkStyle = `color:${color.text};text-decoration:underline;`;

// Whitelist: bold, italic, underline, links, line breaks. Paragraphs become double breaks.
// Anything else is stripped, so editors can't change fonts, colours or sizes.
const RICH_TAGS = { b: 'strong', strong: 'strong', i: 'em', em: 'em', u: 'u', a: 'a', br: 'br', p: 'p', div: 'p' };

export function richText(input) {
  const out = String(input ?? '')
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (!part.startsWith('<')) return escapeText(part);
      const m = part.match(/^<\s*(\/)?\s*([a-z0-9]+)([^>]*)>$/i);
      const tag = m && RICH_TAGS[m[2].toLowerCase()];
      if (!tag) return '';
      const closing = Boolean(m[1]);
      if (tag === 'br') return closing ? '' : '<br>';
      if (tag === 'p') return closing ? '<br><br>' : '';
      if (closing) return `</${tag}>`;
      if (tag !== 'a') return `<${tag}>`;
      const href = m[3].match(/href\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const url = href && (href[1] ?? href[2]);
      return safeUrl(url)
        ? `<a href="${escapeAttr(url)}" class="jb-link" style="${linkStyle}">`
        : '<a>';
    })
    .join('');
  return out.replace(/(<br>)+$/, '');
}

// ---------------------------------------------------------------------------
// Layout

// One full-width row. Every component renders as one or more of these.
// gutter: side padding on desktop (0 = full bleed). Mobile uses tokens.gutter.mobile unless full bleed.
export function section({ content, bg, gutter = tokens.gutter.desktop, padTop = 0, padBottom = 0, className = '' }) {
  const bgAttrs = bg ? ` bgcolor="${bg}" style="background-color:${bg};"` : '';
  const px = gutter ? 'jb-px' : 'jb-px-0';
  return `<table ${TABLE} width="100%" class="${className}"${bgAttrs}><tr>`
    + `<td class="${px}" style="padding:${padTop}px ${gutter}px ${padBottom}px ${gutter}px;">${content}</td>`
    + '</tr></table>';
}

// Hybrid columns: inline-block divs that stack on their own when space runs out,
// with an Outlook-only ghost table for classic Outlook.
//   gutter   side padding of the row on desktop (Figma: 35 for 2/3-card, 30 for side-by-side)
//   gap      space between columns
//   ratios   relative widths, e.g. [1, 1] or [5, 7]
//   mobile   'stack' (one column) or 2 / 3 (items per row kept on mobile)
//   perRow   items per row on desktop when there are more cols than fit (e.g. 2×2 grid); defaults to all
//   rowGap   vertical space between wrapped desktop rows
//   reverse  render visually right-to-left on desktop (source order still wins when stacked)
//   width    content width when nested inside another cell (then gutter is ignored)
function columnWidths({ count, ratios, gutter, gap, width }) {
  const r = ratios ?? Array(count).fill(1);
  const total = r.reduce((a, b) => a + b, 0);
  const outer = width ?? contentWidth(gutter) + gap; // nested rows keep a gap/2 inset at the edges
  return { outer, widths: r.map((x) => Math.floor((outer * x) / total)) };
}

// Content width available inside column `index`, e.g. for sizing images: columnWidth(2, { gutter: 35, gap: 30 }) → 270
export function columnWidth(count, { ratios, gutter = tokens.gutter.desktop, gap = 20, index = 0, width } = {}) {
  return columnWidths({ count, ratios, gutter, gap, width }).widths[index] - gap;
}

export function columns({ cols, ratios, gutter = tokens.gutter.desktop, gap = 20, valign = 'top', mobile = 'stack', perRow, rowGap = 0, reverse = false, bg, padTop = 0, padBottom = 0, width }) {
  const n = perRow ?? cols.length;
  const rowRatios = ratios ?? Array(n).fill(1);
  const { outer, widths: rowWidths } = columnWidths({ count: n, ratios: rowRatios, gutter, gap, width });
  const widths = cols.map((_, i) => rowWidths[i % n]);
  // Split the gap into whole pixels (e.g. 15 → 7 + 8): classic Outlook rounds half pixels,
  // which can push the last column onto a new line.
  const padL = Math.floor(gap / 2);
  const padR = gap - padL;
  const keep = mobile === 2 || mobile === 3;
  const colClass = keep ? `jb-col jb-col-m${mobile}` : 'jb-col';
  const dir = reverse ? ' dir="rtl"' : '';
  const innerDir = reverse ? ' dir="ltr"' : '';
  const lastRowStart = cols.length - (cols.length % n || n);

  const cells = cols.map((html, i) => {
    const last = i === cols.length - 1 ? ' jb-col-last' : '';
    const pb = i < lastRowStart ? rowGap : 0;
    const newRow = i > 0 && i % n === 0 ? '<!--[if mso]></tr><tr><![endif]-->' : '';
    return newRow
      + `<!--[if mso]><td width="${widths[i]}" valign="${valign}"${innerDir} style="padding:0 ${padR}px ${pb}px ${padL}px;"><![endif]-->`
      + `<div class="${colClass}${last}"${innerDir} style="display:inline-block;width:100%;max-width:${widths[i]}px;vertical-align:${valign};">`
      + `<div class="jb-col-pad" style="padding:0 ${padR}px ${pb}px ${padL}px;">${html}</div>`
      + '</div><!--[if mso]></td><![endif]-->';
  });

  // Outer padding tops up each edge column's inner padding to the gutter (nested rows: none)
  const gL = width ? 0 : gutter - padL;
  const gR = width ? 0 : gutter - padR;
  const bgAttrs = bg ? ` bgcolor="${bg}" style="background-color:${bg};"` : '';
  return `<table ${TABLE} width="100%"${bgAttrs}><tr>`
    + `<td class="${width ? 'jb-cols-nested' : keep ? 'jb-px-cols-keep' : 'jb-px-cols'}"${dir} style="padding:${padTop}px ${gR}px ${padBottom}px ${gL}px;font-size:0;line-height:0;text-align:left;">`
    + `<!--[if mso]><table ${TABLE} width="${outer}"${dir}><tr><![endif]-->`
    + cells.join('')
    + '<!--[if mso]></tr></table><![endif]-->'
    + '</td></tr></table>';
}

// A div spacer: classic Outlook respects line-height (exact rule set in the MSO head style)
export function spacer(height) {
  return `<div aria-hidden="true" style="height:${height}px;line-height:${height}px;font-size:1px;">&nbsp;</div>`;
}

export function rule() {
  return `<table ${TABLE} width="100%" aria-hidden="true"><tr>`
    + `<td class="jb-rule" height="1" style="height:1px;line-height:1px;font-size:1px;border-top:1px solid ${color.rule};">&nbsp;</td>`
    + '</tr></table>';
}

// ---------------------------------------------------------------------------
// Typography

// Only non-default declarations are written: weight is needed on headings (bold by default),
// text-align only when not left.
function textStyle({ family, size, lh, align = 'left', weight, italic = false, extra = '' }) {
  return `margin:0;font-family:${family};font-size:${size}px;line-height:${lh}px;`
    + `${weight != null ? `font-weight:${weight};` : ''}${italic ? 'font-style:italic;' : ''}`
    + `color:${color.text};${align !== 'left' ? `text-align:${align};` : ''}${extra}`;
}

// Mark OT Medium, uppercase (Figma). Arial renders weight 500 as regular.
export function headline({ text, size = 'M', align = 'left', bold = false, italic = false, level = 1 }) {
  const t = type.headline[size];
  const style = textStyle({ family: font.sans, size: t.size, lh: t.lh, align, weight: bold ? 700 : 500, italic, extra: 'text-transform:uppercase;' });
  return `<h${level} class="jb-sans jb-text jb-headline-${size}" style="${style}">${richText(text)}</h${level}>`;
}

// variant 'serif' for straplines and quotes, 'eyebrow' for uppercase sans labels
export function subheading({ text, size = 'M', align = 'left', bold = false, italic = false, variant = 'serif', level = 2 }) {
  const t = type.subheading[size];
  const eyebrow = variant === 'eyebrow';
  const style = textStyle({
    family: eyebrow ? font.sans : font.serif,
    size: t.size,
    lh: t.lh,
    align,
    weight: bold ? 700 : 400,
    italic,
    extra: eyebrow ? `text-transform:uppercase;letter-spacing:${type.label.tracking}px;` : '',
  });
  const familyClass = eyebrow ? 'jb-sans' : 'jb-serif';
  return `<h${level} class="${familyClass} jb-text jb-subheading-${size}" style="${style}">${richText(text)}</h${level}>`;
}

export function bodyText({ html, align = 'left' }) {
  const t = type.body;
  return `<p class="jb-serif jb-text jb-copy" style="${textStyle({ family: font.serif, size: t.size, lh: t.lh, align })}">${richText(html)}</p>`;
}

// ---------------------------------------------------------------------------
// Buttons

const labelStyle = `font-family:${font.sans};font-size:${type.cta.size}px;line-height:${type.cta.lh}px;`
  + `letter-spacing:${type.cta.tracking}px;text-transform:uppercase;font-weight:500;text-decoration:none;`;
// Small CTA (product list price buttons) keeps the 12px label size
const labelStyleSmall = labelStyle.replace(`font-size:${type.cta.size}px;line-height:${type.cta.lh}px;`, `font-size:${type.label.size}px;line-height:${type.label.lh}px;`);

function aliasAttr(alias) {
  return alias ? ` alias="${escapeAttr(alias)}"` : '';
}

function alignRow(align, inner) {
  return `<table ${TABLE} width="100%"><tr><td align="${align}" style="text-align:${align};">${inner}</td></tr></table>`;
}

// variant: 'primary' (solid), 'secondary' (outline), 'arrow' (text link with arrow)
// width:   'full' (spans the column; align sets the label) or 'auto' (hugs the label; align sets the button)
// size:    'regular' (49px, Figma CTA) or 'small' (product list price CTA)
// The whole button is clickable everywhere except classic Outlook with width 'full' (label only).
export function button({ label, href, variant = 'primary', width = 'full', align = 'left', size = 'regular', alias }) {
  const url = safeUrl(href) ? href : '#';
  const text = escapeText(label);
  const a = aliasAttr(alias);

  // Arrow + text: Figma's 16px arrow icon, 11px gap, label. Both parts link to the same URL.
  if (variant === 'arrow') {
    const icon = themedImage({ ...assets.arrow, alt: '', align: 'left', href: url, alias: alias && `${alias}-arrow` });
    return alignRow(align, `<table ${TABLE} align="${align === 'center' ? 'center' : 'left'}"><tr>`
      + `<td width="${assets.arrow.width}" valign="middle" style="width:${assets.arrow.width}px;padding-right:11px;">${icon}</td>`
      + `<td valign="middle"><a href="${escapeAttr(url)}"${a} class="jb-sans jb-link" style="${labelStyle}color:${color.ink};">${text}</a></td>`
      + '</tr></table>');
  }

  const { border } = tokens.button;
  const ls = size === 'small' ? labelStyleSmall : labelStyle;
  const padY = size === 'small' ? 6 : tokens.button.padY;
  const padX = size === 'small' ? 12 : tokens.button.padX;
  const primary = variant === 'primary';
  const fg = primary ? color.inkText : color.ink;
  const cls = primary ? 'jb-btn-primary' : 'jb-btn-secondary';
  const fill = primary ? `background-color:${color.ink};` : '';

  if (width === 'full') {
    return `<table ${TABLE} width="100%"><tr>`
      + `<td class="${cls}" align="${align}"${primary ? ` bgcolor="${color.ink}"` : ''} style="${fill}border:${border}px solid ${color.ink};mso-padding-alt:${padY}px ${padX}px;">`
      + `<a href="${escapeAttr(url)}"${a} class="jb-sans ${cls}-label" style="${ls}display:block;padding:${padY}px ${padX}px;color:${fg};text-align:${align};">${text}</a>`
      + '</td></tr></table>';
  }

  // Auto width: padded inline-block link. The MSO-only <i> spacers recreate the padding
  // in classic Outlook, which ignores padding on <a>.
  const msoWidth = Math.round((padX / (size === 'small' ? type.label.size : type.cta.size)) * 100);
  return alignRow(align, `<a href="${escapeAttr(url)}"${a} class="jb-sans ${cls} ${cls}-label" style="${ls}${fill}border:${border}px solid ${color.ink};`
    + `display:inline-block;padding:${padY}px ${padX}px;color:${fg};mso-padding-alt:0;text-underline-color:${primary ? color.ink : color.page};">`
    + `<!--[if mso]><i style="mso-font-width:${msoWidth}%;mso-text-raise:${padY * 2}pt;" hidden>&emsp;</i><span style="mso-text-raise:${padY}pt;"><![endif]-->`
    + text
    + `<!--[if mso]></span><i style="mso-font-width:${msoWidth}%;" hidden>&emsp;&#8203;</i><![endif]-->`
    + '</a>');
}

// ---------------------------------------------------------------------------
// Images

function imgTag({ src, alt, width, className = '', round = false, fluid = false, style = '' }) {
  return `<img src="${escapeAttr(src)}" width="${width}" alt="${escapeAttr(alt)}" class="jb-img${fluid ? ' jb-fluid' : ''} ${className}" `
    + `style="display:block;width:100%;max-width:${width}px;height:auto;border:0;outline:none;text-decoration:none;`
    + `${round ? 'border-radius:50%;' : ''}font-family:${font.serif};font-size:14px;line-height:20px;color:${color.muted};${style}">`;
}

function linkWrap(html, href, alias) {
  return href && safeUrl(href)
    ? `<a href="${escapeAttr(href)}"${aliasAttr(alias)} style="display:block;text-decoration:none;">${html}</a>`
    : html;
}

// Content hidden until the mobile media query reveals it; classic Outlook never sees it
function mobileOnly(html) {
  return `<!--[if !mso]><!--><div class="jb-show-m" style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${html}</div><!--<![endif]-->`;
}

// width is the slot width in px; the image file should be exported at 2x.
// frame:     { width, color } draws a border around the image (L3.1 option)
// mobileSrc: optional art-directed crop shown below the breakpoint (Figma hero/image break)
// round:     circular crop where supported; supply a pre-cropped PNG for classic Outlook
// fluid:     fill the column when stacked on mobile (off for bottles, photos and icons)
export function image({ src, alt = '', width = contentWidth(), href, alias, frame, mobileSrc, round = false, align, fluid = true }) {
  const fw = frame?.width ?? 0;
  const w = width - 2 * fw;
  let html = imgTag({ src, alt, width: w, round, fluid: fluid && !round, style: align === 'center' ? 'margin:0 auto;' : '' });
  if (mobileSrc) {
    html = `<div class="jb-hide-m">${html}</div>` + mobileOnly(imgTag({ src: mobileSrc, alt, width: w, fluid }));
  }
  html = linkWrap(html, href, alias);
  if (fw) {
    const c = frame.color ?? color.ink;
    html = `<table ${TABLE} width="100%"><tr><td class="jb-frame" bgcolor="${c}" style="padding:${fw}px;background-color:${c};">${html}</td></tr></table>`;
  }
  return html;
}

// Logo/icon with a separate dark-mode file (e.g. white wordmark). Only the light file shows
// where dark mode can't be detected, so it must have enough contrast on both backgrounds.
export function themedImage({ src, srcDark, alt = '', width, href, alias, align = 'center' }) {
  const centre = align === 'center' ? 'margin:0 auto;' : '';
  let html = imgTag({ src, alt, width, className: 'jb-logo-light', style: centre });
  if (srcDark) {
    html += `<!--[if !mso]><!--><div class="jb-logo-dark" style="display:none;max-height:0;overflow:hidden;mso-hide:all;">`
      + `${imgTag({ src: srcDark, alt, width, style: centre })}</div><!--<![endif]-->`;
  }
  return linkWrap(html, href, alias);
}

// Horizontal rule with an image centred on it (divider monogram, author photo)
export function ruleWithImage({ imageHtml, imageWidth, imageHeight }) {
  const line = rule();
  return `<table ${TABLE} width="100%"><tr>`
    + `<td valign="middle" style="vertical-align:middle;">${line}</td>`
    + `<td width="${imageWidth + 32}" align="center" valign="middle" style="width:${imageWidth + 32}px;height:${imageHeight}px;">${imageHtml}</td>`
    + `<td valign="middle" style="vertical-align:middle;">${line}</td>`
    + '</tr></table>';
}

export { TABLE, aliasAttr, mobileOnly };
