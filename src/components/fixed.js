// Layer 1: fixed components (header and footer)

import { tokens, assets } from '../tokens.js';
import { section, spacer, rule, themedImage, TABLE } from '../primitives.js';
import { text, link, join } from './util.js';

const { color } = tokens;

// L1.1 Brand header: logo, optional row of 3–4 navigation links between two rules
export function brandHeader(d = {}) {
  const logo = themedImage({ ...assets.logo, alt: 'Justerini & Brooks', href: d.logoHref ?? 'https://www.justerinis.com/', alias: 'header-logo' });
  const nav = (d.nav ?? []).slice(0, 4);

  if (!d.showNav || nav.length < 3) {
    return section({ padTop: 29, padBottom: 29, content: logo });
  }

  const cells = nav.map((n, i) => `<td align="center" valign="middle" width="${Math.floor(100 / nav.length)}%" style="padding:4px 2px;">`
    + text({ kind: 'label', align: 'center', tag: 'div', className: 'jb-nav-link', raw: true, html: link({ label: n.label, href: n.href, alias: `nav-${i + 1}` }) })
    + '</td>').join('');

  return section({
    gutter: 28,
    padTop: 29,
    padBottom: 29,
    content: join(
      logo,
      spacer(8),
      rule(),
      `<table ${TABLE} width="100%"><tr>${cells}</tr></table>`,
      rule(),
    ),
  });
}

// L1.2 Footer: logo (wordmark or monogram), service links, social icons, legal text, unsubscribe
export function footer(d = {}) {
  const mark = d.variant === 'monogram' ? assets.monogram : assets.logo;
  const socials = (d.social ?? ['instagram', 'facebook', 'youtube', 'web'])
    .map((k) => assets.social[k])
    .filter(Boolean)
    .map((s, i) => `<td width="16" style="padding:0 0 0 ${i ? 16 : 0}px;">${themedImage({ ...s, width: 16, href: s.href, alias: `social-${i + 1}` })}</td>`)
    .join('');

  const links = (d.links ?? []).map((l, i) => text({ kind: 'small', align: 'center', raw: true, html: link({ label: l.label, href: l.href, alias: `footer-${i + 1}` }) }));

  return section({
    bg: color.footer,
    className: 'jb-bg-footer',
    gutter: 80,
    padTop: 36,
    padBottom: 36,
    content: join(
      themedImage({ ...mark, alt: 'Justerini & Brooks', href: 'https://www.justerinis.com/', alias: 'footer-logo' }),
      spacer(20),
      links.join(spacer(8)),
      spacer(24),
      `<table ${TABLE} align="center"><tr>${socials}</tr></table>`,
      spacer(28),
      rule(),
      spacer(20),
      text({ kind: 'small', align: 'center', className: 'jb-muted', html: d.legal }),
      spacer(16),
      text({ kind: 'small', align: 'center', raw: true, html: link({ label: 'Unsubscribe', href: '%%unsub_center_url%%', alias: 'unsubscribe' }) + '&nbsp;&nbsp;·&nbsp;&nbsp;' + link({ label: 'Manage preferences', href: '%%profile_center_url%%', alias: 'preferences' }) }),
    ),
  });
}

export const fixedSamples = {
  'L1.1': {
    name: 'Brand header',
    render: brandHeader,
    samples: [
      { label: 'Logo only', data: { showNav: false } },
      { label: 'With 4-link navigation', data: { showNav: true, nav: [{ label: 'New Releases', href: 'https://www.justerinis.com/' }, { label: 'All Wines', href: 'https://www.justerinis.com/' }, { label: 'En Primeur', href: 'https://www.justerinis.com/' }, { label: 'Events', href: 'https://www.justerinis.com/' }] } },
      { label: 'With 3-link navigation', data: { showNav: true, nav: [{ label: 'New Releases', href: 'https://www.justerinis.com/' }, { label: 'En Primeur', href: 'https://www.justerinis.com/' }, { label: 'Events', href: 'https://www.justerinis.com/' }] } },
    ],
  },
  'L1.2': {
    name: 'Footer',
    render: footer,
    samples: ['wordmark', 'monogram'].map((variant) => ({
      label: variant === 'wordmark' ? 'V1 · wordmark' : 'V2 · monogram',
      data: {
        variant,
        links: [
          { label: '+44 (0)20 7484 6430', href: 'tel:+442074846430' },
          { label: 'Contact Us', href: 'https://www.justerinis.com/' },
          { label: 'Privacy Policy', href: 'https://www.justerinis.com/' },
        ],
        legal: 'Justerini &amp; Brooks 2026. All Rights Reserved. You must be 18 or over to order.<br>Reg. Company No. 68576 · 61 St. James Street, London, SW1A 1LZ',
      },
    })),
  },
};

