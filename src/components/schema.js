// Editor schemas: which fields marketers see for each component in the Content Builder block.
// Field types: text, rich (bold/italic/underline/links), inline (bold/italic only), url, image,
// select, toggle, list (repeatable group). `when` shows a field only if another field matches.
// `size` on images is the recommended export size (2× the slot), used for a sharpness check.

const text = (key, label, opts = {}) => ({ type: 'text', key, label, ...opts });
const rich = (key, label, opts = {}) => ({ type: 'rich', key, label, ...opts });
const inline = (key, label, opts = {}) => ({ type: 'inline', key, label, ...opts });
const url = (key, label = 'Link', opts = {}) => ({ type: 'url', key, label, ...opts });
const img = (key, label, size, opts = {}) => ({ type: 'image', key, label, size, ...opts });
const select = (key, label, options, opts = {}) => ({ type: 'select', key, label, options, ...opts });
const toggle = (key, label, opts = {}) => ({ type: 'toggle', key, label, default: true, ...opts });
const list = (key, label, fields, opts = {}) => ({ type: 'list', key, label, fields, ...opts });

const align = select('align', 'Alignment', [['left', 'Left'], ['center', 'Centred']]);
const sizes = select('size', 'Size', [['S', 'Small'], ['M', 'Medium'], ['L', 'Large']]);
const ctaFields = [text('cta.label', 'Button text'), url('cta.href', 'Button link')];
const showToggles = (...keys) => keys.map(([k, label]) => toggle(`show.${k}`, `Show ${label}`, { group: 'Elements' }));
const cardFields = (size) => [img('image', 'Image', size), text('alt', 'Image description (alt text)'), url('href', 'Image link'), inline('title', 'Title'), rich('body', 'Body copy'), ...ctaFields];
const cardToggles = showToggles(['image', 'image'], ['title', 'title'], ['body', 'body copy'], ['cta', 'button']);

export const schemas = {
  'L1.1': [
    toggle('showNav', 'Show navigation row', { default: false }),
    list('nav', 'Navigation links', [text('label', 'Label'), url('href')], { min: 3, max: 4, when: ['showNav', true] }),
  ],
  'L1.2': [
    select('variant', 'Logo', [['wordmark', 'V1 · wordmark'], ['monogram', 'V2 · monogram']]),
    list('links', 'Service links', [text('label', 'Label'), url('href')], { min: 1, max: 4 }),
    rich('legal', 'Legal text'),
  ],
  'L2.1': [inline('text', 'Headline', { required: true }), sizes, align, toggle('bold', 'Bold', { default: false }), toggle('italic', 'Italic', { default: false })],
  'L2.2': [inline('text', 'Sub-heading', { required: true }), sizes, align, select('style', 'Style', [['serif', 'Serif strapline'], ['eyebrow', 'Uppercase eyebrow']]), toggle('bold', 'Bold', { default: false }), toggle('italic', 'Italic', { default: false })],
  'L2.3': [rich('html', 'Body text', { required: true }), align],
  'L3.1': [
    select('kind', 'Type', [['image', 'Image'], ['gif', 'Animated GIF'], ['video', 'Video thumbnail']]),
    img('src', 'Image', [1280, 800], { required: true, help: 'Video: bake the play button into the thumbnail. GIF: the first frame must work on its own.' }),
    img('mobileSrc', 'Mobile crop (optional)', [750, 560]),
    text('alt', 'Image description (alt text)'),
    url('href'),
    toggle('border', 'Border', { default: false }),
    select('borderWidth', 'Border width', [[2, '2px'], [4, '4px'], [6, '6px'], [8, '8px']], { when: ['border', true] }),
  ],
  'L3.2': [img('src', 'Image', [1280, 600], { required: true }), img('mobileSrc', 'Mobile crop (optional)', [750, 320]), text('alt', 'Image description (alt text)'), url('href')],
  'L4.1': [text('label', 'Button text', { required: true }), url('href', 'Button link', { required: true }), select('variant', 'Style', [['primary', 'Primary (solid)'], ['secondary', 'Secondary (outline)'], ['arrow', 'Arrow + text']]), align],
  'L4.2': [text('primary.label', 'Primary button text', { required: true }), url('primary.href', 'Primary link', { required: true }), text('secondary.label', 'Secondary button text', { required: true }), url('secondary.href', 'Secondary link', { required: true }), align],
  'L5.1': [
    select('variant', 'Type', [['monogram', 'Line + monogram'], ['line', 'Line only'], ['spacer', 'Spacer']]),
    select('height', 'Spacer height', [[16, '16px'], [24, '24px'], [32, '32px'], [48, '48px'], [64, '64px']], { when: ['variant', 'spacer'] }),
  ],
  'L6.1': [
    select('layout', 'Layout', [['stacked', 'Stacked (full-width image)'], ['side', 'Side by side']]),
    select('imageSide', 'Image position', [['left', 'Left'], ['right', 'Right']], { when: ['layout', 'side'] }),
    ...cardFields([1280, 800]),
    ...cardToggles,
  ],
  'L6.2': [list('cards', 'Cards', cardFields([540, 540]), { min: 2, max: 2 }), ...cardToggles],
  'L6.3': [
    select('variant', 'Layout', [['copy', 'Copy + button (stacks on mobile)'], ['image', 'Image + title (3 across on mobile)']]),
    list('cards', 'Cards', cardFields([360, 330]), { min: 3, max: 3 }),
    ...cardToggles,
  ],
  'L6.4': [list('cards', 'Cards', cardFields([540, 540]), { min: 4, max: 4 }), ...cardToggles],
  'L7.1': [img('image', 'Bottle image', [360, 730]), text('alt', 'Image description (alt text)'), url('href', 'Product link'), text('subtitle', 'Subtitle (category / region / producer)'), inline('title', 'Product name'), rich('body', 'Description'), ...ctaFields, ...showToggles(['image', 'image'], ['subtitle', 'subtitle'], ['body', 'description'], ['cta', 'button'])],
  'L7.2': [
    list('products', 'Products', [img('image', 'Bottle image', [540, 540]), text('alt', 'Image description (alt text)'), url('href', 'Product link'), text('subtitle', 'Subtitle'), inline('title', 'Product name'), rich('body', 'Description'), ...ctaFields], { min: 2, max: 2 }),
    ...showToggles(['image', 'image'], ['subtitle', 'subtitle'], ['title', 'name'], ['body', 'description'], ['cta', 'button']),
  ],
  'L7.3': [
    toggle('show.image', 'Show bottle images', { group: 'Elements' }),
    list('products', 'Products', [img('image', 'Bottle image', [160, 280]), inline('title', 'Product name'), rich('details', 'Details (format, region…)'), text('price', 'Price'), url('href', 'Product link'), text('cta.label', 'Button text')], { min: 1, max: 20 }),
  ],
  'L8.1': [text('score', 'Score (e.g. 98/100)', { required: true }), text('critic', 'Critic name'), text('publication', 'Publication'), inline('wine', 'Wine name'), rich('note', 'Tasting note')],
  'L8.2': [
    img('image', 'Bottle image', [360, 600]), text('alt', 'Image description (alt text)'), inline('title', 'Headline'), rich('intro', 'Intro copy'),
    rich('notes.nose', 'Nose'), rich('notes.body', 'Body'), rich('notes.palate', 'Palate'), rich('notes.finish', 'Finish'),
    ...showToggles(['image', 'image'], ['nose', 'nose'], ['body', 'body'], ['palate', 'palate'], ['finish', 'finish']),
  ],
  'L8.3': [inline('quote', 'Quote', { required: true }), text('name', 'Name'), text('subtitle', 'Sub-title'), ...showToggles(['name', 'name'], ['subtitle', 'sub-title'])],
  'L8.4': [img('photo', 'Author photo (pre-cropped circle)', [140, 140]), text('name', 'Name'), text('title', 'Title'), ...showToggles(['photo', 'photo'], ['name', 'name'], ['title', 'title'])],
  'L9.1': [
    text('pretitle', 'Pre-title label'), inline('title', 'Headline'),
    list('details', 'Event details', [
      select('icon', 'Icon', [['date', 'Date'], ['time', 'Time'], ['location', 'Location'], ['availability', 'Availability'], ['format', 'Format'], ['price', 'Price']]),
      text('label', 'Label'), rich('value', 'Value'),
    ], { min: 0, max: 6 }),
    rich('description', 'Description'), ...ctaFields,
    text('calendar.label', 'Calendar button text'), url('calendar.href', 'Calendar link (.ics or calendar URL)'),
  ],
  'L9.2': [
    list('items', 'Service links', [
      select('key', 'Service', [['store', 'Store with us'], ['sell', 'Sell with us'], ['collect', 'Collecting with us'], ['buy', 'Buying with us'], ['events', 'Our events'], ['service', 'Customer service']]),
      url('href'),
    ], { min: 3, max: 6, counts: [3, 4, 6] }),
  ],
};
