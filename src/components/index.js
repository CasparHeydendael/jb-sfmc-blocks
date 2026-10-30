// Component registry: id → { name, render(data), samples[] }. Used by the gallery build and,
// in Phase 3, by the Content Builder custom blocks.

import { fixedSamples } from './fixed.js';
import { basicsSamples } from './basics.js';
import { cardSamples } from './cards.js';
import { productSamples } from './product.js';
import { editorialSamples } from './editorial.js';

export const components = { ...fixedSamples, ...basicsSamples, ...cardSamples, ...productSamples, ...editorialSamples };

export const layers = {
  L1: 'Fixed frame',
  L2: 'Typography',
  L3: 'Media',
  L4: 'CTA',
  L5: 'Divider & spacer',
  L6: 'Card system',
  L7: 'Product',
  L8: 'Editorial & producer authority',
  L9: 'Action & service',
};

export const renderComponent = (id, data) => components[id].render(data);
