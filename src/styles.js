// Head CSS, generated from tokens. Split into separate <style> blocks on purpose:
// Gmail drops a whole block if it dislikes one rule, so the risky selectors
// (dark mode, Outlook.com attribute selectors) live apart from the core layout CSS.

import { tokens } from './tokens.js';

const { color, dark, font, type, breakpoint, gutter, stackGap } = tokens;

const sizeRules = (group, prefix) => Object.entries(group)
  .map(([k, v]) => `.jb-${prefix}-${k}{font-size:${v.m.size}px!important;line-height:${v.m.lh}px!important}`)
  .join('');

// Resets and client fixes
export const coreCss = [
  'body{margin:0!important;padding:0!important;width:100%!important;-webkit-text-size-adjust:100%;text-size-adjust:100%}',
  'table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}',
  'img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}',
  'a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}',
  '#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}',
  'u+.jb-body a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}',
].join('');

// Mobile layout
export const responsiveCss = `@media screen and (max-width:${breakpoint}px){`
  + '.jb-container{width:100%!important;max-width:100%!important}'
  + `.jb-px,.jb-px-cols{padding-left:${gutter.mobile}px!important;padding-right:${gutter.mobile}px!important}`
  + `.jb-px-cols-keep{padding-left:${gutter.mobile - 5}px!important;padding-right:${gutter.mobile - 5}px!important}`
  + `.jb-col{display:block!important;max-width:100%!important;padding-bottom:${stackGap}px}`
  + '.jb-px-cols .jb-col-pad{padding:0!important}'
  + '.jb-col .jb-fluid{max-width:100%!important}'
  + '.jb-col-m2,.jb-col-m3{display:inline-block!important;padding-bottom:10px}'
  + '.jb-col-m2{max-width:50%!important}.jb-col-m3{max-width:33.33%!important}'
  + '.jb-px-cols-keep .jb-col-pad{padding:0 5px!important}'
  + '.jb-col-last{padding-bottom:0!important}'
  + `.jb-copy{font-size:${type.body.m.size}px!important;line-height:${type.body.m.lh}px!important}`
  + sizeRules(type.headline, 'headline')
  + sizeRules(type.subheading, 'subheading')
  + '.jb-hide-m{display:none!important;max-height:0!important;overflow:hidden!important}'
  + '.jb-show-m{display:block!important;max-height:none!important;overflow:visible!important}'
  + '.jb-nav-link{font-size:10px!important;letter-spacing:1px!important}'
  + '.jb-stack-rule{border-right:0!important;border-bottom:1px solid ' + tokens.color.rule + '!important;padding:0 0 20px 0!important;margin-bottom:20px!important}'
  + '.jb-quote-mark{width:24px!important}'
  + '}';

// Licensed brand web fonts, wrapped in @media screen so classic Outlook ignores them
export const webFontCss = tokens.webFonts.length
  ? '@media screen{' + tokens.webFonts.map((f) => `@font-face{font-family:'${f.family}';font-weight:${f.weight};font-style:${f.style};src:url('${f.url}') format('woff2')}`).join('') + '}'
  : '';

// Dark mode for clients that support prefers-color-scheme (Apple Mail, iOS, Outlook Mac/new Outlook...)
const darkRules = (scope = '') => [
  `${scope}.jb-bg{background-color:${dark.page}!important}`,
  `${scope}.jb-bg-footer{background-color:${dark.footer}!important}`,
  `${scope}.jb-text,${scope}.jb-link{color:${dark.text}!important}`,
  `${scope}.jb-muted{color:${dark.muted}!important}`,
  `${scope}.jb-rule{border-color:${dark.rule}!important}`,
  `${scope}.jb-btn-primary{background-color:${dark.ink}!important;border-color:${dark.ink}!important}`,
  `${scope}.jb-btn-primary-label{color:${dark.inkText}!important}`,
  `${scope}.jb-btn-secondary{border-color:${dark.ink}!important}`,
  `${scope}.jb-btn-secondary-label{color:${dark.ink}!important}`,
  `${scope}.jb-logo-light{display:none!important}`,
  `${scope}.jb-logo-dark{display:block!important;max-height:none!important;overflow:visible!important}`,
].join('');

export const darkCss = ':root{color-scheme:light dark;supported-color-schemes:light dark}'
  + `@media (prefers-color-scheme:dark){${darkRules()}}`;

// Outlook.com / Outlook apps apply their own dark mode and tag elements with data-ogsc / data-ogsb
export const outlookDarkCss = darkRules('[data-ogsc] ') + darkRules('[data-ogsb] ');

// Classic Outlook (Word engine): force fallback fonts so it doesn't drop to Times New Roman
export const msoCss = `.jb-serif{font-family:${font.serifMso}!important}`
  + `.jb-sans{font-family:${font.sansMso}!important}`
  + 'td,th,div,p,a,h1,h2,h3,h4,span{mso-line-height-rule:exactly}';

export const styleBlocks = [coreCss + webFontCss + responsiveCss, darkCss, outlookDarkCss];
