// Helpers shared by components.

import { tokens } from '../tokens.js';
import { richText, escapeAttr, safeUrl } from '../primitives.js';

const { font, type, color } = tokens;

// Is an optional element switched on? Toggles default to on; empty content counts as off.
export const on = (d, key, value = d[key]) => d.show?.[key] !== false && value != null && value !== '';

// Free-form text with a preset style.
//   kind: 'label' (uppercase sans, CTA/nav size), 'small' (serif, footer/captions), 'meta' (serif muted)
//   raw:  html is trusted component markup (e.g. from link()) and skips the rich-text cleaner
export function text({ html, kind = 'small', align = 'left', tag = 'p', className = '', bold = false, raw = false }) {
  const s = {
    label: { family: font.sans, size: type.label.size, lh: type.label.lh, extra: `text-transform:uppercase;letter-spacing:${type.label.tracking}px;`, fam: 'jb-sans', col: color.text, cls: 'jb-text' },
    small: { family: font.serif, size: type.small.size, lh: type.small.lh, extra: '', fam: 'jb-serif', col: color.text, cls: 'jb-text' },
    meta: { family: font.serif, size: 16, lh: 22, extra: '', fam: 'jb-serif', col: color.muted, cls: 'jb-muted' },
  }[kind];
  const style = `margin:0;font-family:${s.family};font-size:${s.size}px;line-height:${s.lh}px;${bold ? 'font-weight:700;' : ''}`
    + `color:${s.col};${align !== 'left' ? `text-align:${align};` : ''}${s.extra}`;
  return `<${tag} class="${s.fam} ${s.cls} ${className}" style="${style}">${raw ? html : richText(html)}</${tag}>`;
}

// Plain text link in a given text kind (nav, footer links)
export function link({ label, href, alias, className = '' }) {
  const url = safeUrl(href) ? href : '#';
  return `<a href="${escapeAttr(url)}"${alias ? ` alias="${escapeAttr(alias)}"` : ''} class="jb-link ${className}" style="color:${color.text};text-decoration:none;">${richText(label)}</a>`;
}

export const join = (...parts) => parts.flat().filter(Boolean).join('');
