// Master email shell. In 'sfmc' mode the three regions become Content Builder template
// slots; in 'static' mode they are filled with rendered HTML (local previews, Litmus).

import { tokens } from './tokens.js';
import { styleBlocks, msoCss } from './styles.js';
import { escapeText } from './primitives.js';

const { color, width } = tokens;

// Fills the inbox preview after the preheader so body copy doesn't leak in
const previewFiller = '&#847;&zwnj;&nbsp;'.repeat(50);

function region(mode, key, label, html) {
  if (mode !== 'sfmc') return html;
  return `<div data-type="slot" data-key="${key}" data-label="${label}">${html}</div>`;
}

export function renderShell({ mode = 'static', title = 'Justerini & Brooks', preheader = '', lang = 'en', header = '', body = '', footer = '' }) {
  // SFMC injects the Content Builder preheader field itself; only add one for static builds.
  const pre = mode === 'static' && preheader ? escapeText(preheader) : '';
  const styles = styleBlocks.filter(Boolean).map((css) => `<style>${css}</style>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeText(title)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>${msoCss}</style>
<![endif]-->
${styles}
</head>
<body class="jb-body" style="margin:0;padding:0;width:100%;background-color:${color.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;" aria-hidden="true">${pre}${previewFiller}</div>
<div role="article" aria-roledescription="email" aria-label="${escapeText(title)}" lang="${lang}" dir="ltr" class="jb-bg" style="background-color:${color.page};">
<!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" width="${width}" align="center"><tr><td><![endif]-->
<div class="jb-container" style="max-width:${width}px;margin:0 auto;">
${region(mode, 'header', 'Header', header)}
${region(mode, 'body', 'Email content', body)}
${region(mode, 'footer', 'Footer', footer)}
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
</body>
</html>
`;
}
