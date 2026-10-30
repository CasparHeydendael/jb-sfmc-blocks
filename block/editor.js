// Content Builder custom block editor for the J&B component library.
// Inside Content Builder it talks to the Block SDK; opened directly in a browser it runs
// standalone with a local preview (data kept in localStorage) for testing.
//
// URL params: ?layer=L6 limits the picker to one layer (one Installed Package block per layer).

import { components, layers } from '../src/components/index.js';
import { schemas } from '../src/components/schema.js';
import { renderShell } from '../src/shell.js';
import { safeUrl } from '../src/primitives.js';

const layer = new URLSearchParams(location.search).get('layer');
const inSfmc = window.parent !== window && window.sfdc?.BlockSDK;
const sdk = inSfmc ? new window.sfdc.BlockSDK() : standaloneSdk();

const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, '');
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  kids.flat().forEach((k) => k != null && n.append(k));
  return n;
};

// ---------------------------------------------------------------------------
// State and data paths ('cta.label' → data.cta.label)

let state = { component: null, data: {} };

const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
  target[last] = value;
}
const valueOf = (obj, f) => getPath(obj, f.key) ?? f.default;

// ---------------------------------------------------------------------------
// SDK: Block SDK in Content Builder, or a local stand-in

function standaloneSdk() {
  const key = `jb-block:${layer ?? 'all'}`;
  return {
    getData(cb) {
      let saved = {};
      try { saved = JSON.parse(localStorage.getItem(key)) ?? {}; } catch { /* storage unavailable */ }
      cb(saved);
    },
    setData(d) {
      try { localStorage.setItem(key, JSON.stringify(d)); } catch { /* storage unavailable */ }
    },
    setContent(html) {
      $('#frame').srcdoc = renderShell({ mode: 'static', title: 'Preview', body: html });
    },
    setSuperContent() {},
  };
}

// ---------------------------------------------------------------------------
// Output

let timer;
function scheduleOutput() {
  clearTimeout(timer);
  timer = setTimeout(output, 250);
}

function output() {
  const { component, data } = state;
  if (!component) return;
  showIssues(validate(component, data));
  let html;
  try {
    html = components[component].render(data);
  } catch (err) {
    showIssues([{ level: 'error', text: `Could not render: ${err.message}` }]);
    return;
  }
  sdk.setData({ component, data });
  sdk.setContent(html);
  sdk.setSuperContent(html);
}

// ---------------------------------------------------------------------------
// Validation: required fields, link format, placeholder images, list counts

function validate(id, data) {
  const issues = [];
  const walk = (fields, obj, prefix = '') => {
    for (const f of fields) {
      if (f.when && valueOf(obj, { key: f.when[0] }) !== f.when[1]) continue;
      const v = getPath(obj, f.key);
      const name = prefix + f.label;
      if (f.type === 'list') {
        const items = v ?? [];
        if (f.counts && !f.counts.includes(items.length)) issues.push({ level: 'error', text: `${name}: use ${f.counts.join(', ')} items (now ${items.length}).` });
        items.forEach((item, i) => walk(f.fields, item, `${f.label} ${i + 1} · `));
        continue;
      }
      const empty = v == null || String(v).replace(/<[^>]*>|&nbsp;/g, '').trim() === '';
      if (f.required && empty) issues.push({ level: 'error', text: `${name} is required.` });
      if (!empty && (f.type === 'url' || f.type === 'image') && !safeUrl(String(v))) issues.push({ level: 'error', text: `${name}: use a full https:// link.` });
      if (!empty && f.type === 'image' && /placehold\.co/.test(v)) issues.push({ level: 'warn', text: `${name}: still a placeholder image.` });
    }
  };
  walk(schemas[id] ?? [], data);
  return issues;
}

function showIssues(issues) {
  const box = $('#issues');
  box.hidden = issues.length === 0;
  box.replaceChildren(
    el('strong', {}, issues.some((i) => i.level === 'error') ? 'Fix before sending' : 'Check'),
    el('ul', {}, issues.map((i) => el('li', { class: `msg ${i.level}` }, i.text))),
  );
}

// ---------------------------------------------------------------------------
// Form

const visibility = []; // [element, condition, scopeObject]

function refreshVisibility() {
  for (const [node, [key, val], scope] of visibility) node.hidden = valueOf(scope(), { key }) !== val;
}

function onChange(scope, key, value) {
  setPath(scope(), key, value);
  refreshVisibility();
  scheduleOutput();
}

function buildField(f, scope) {
  const id = `f-${Math.random().toString(36).slice(2, 8)}`;
  const value = valueOf(scope(), f);
  const help = f.help && el('div', { class: 'help' }, f.help);
  let input;

  switch (f.type) {
    case 'text':
    case 'url':
      input = el('input', { id, type: f.type === 'url' ? 'url' : 'text', value: value ?? '', placeholder: f.type === 'url' ? 'https://' : '', oninput: (e) => onChange(scope, f.key, e.target.value) });
      break;
    case 'select':
      input = el('select', { id, onchange: (e) => onChange(scope, f.key, typeof f.options[0][0] === 'number' ? Number(e.target.value) : e.target.value) },
        f.options.map(([v, label]) => el('option', { value: v, selected: String(v) === String(value ?? f.options[0][0]) }, label)));
      if (value == null) setPath(scope(), f.key, f.options[0][0]);
      break;
    case 'toggle':
      return el('div', { class: 'field' }, el('label', { class: 'toggle' },
        el('input', { type: 'checkbox', checked: Boolean(value), onchange: (e) => onChange(scope, f.key, e.target.checked) }), f.label));
    case 'rich':
    case 'inline':
      input = richEditor(f, value, (html) => onChange(scope, f.key, html));
      break;
    case 'image':
      return imageField(f, value, id, (v) => onChange(scope, f.key, v));
    case 'list':
      return listField(f, scope);
    default:
      input = el('span', {}, `Unsupported field ${f.type}`);
  }
  return el('div', { class: 'field' }, el('label', { for: id }, f.label + (f.required ? ' *' : '')), input, help);
}

// Minimal rich text: bold/italic (+ underline and links for 'rich'). Pasted text arrives unformatted;
// the renderer also strips anything outside the whitelist.
function richEditor(f, value, onInput) {
  const area = el('div', { class: `rich${f.type === 'inline' ? ' inline' : ''}`, contenteditable: 'true', role: 'textbox', 'aria-multiline': String(f.type === 'rich') });
  area.innerHTML = value ?? '';
  area.addEventListener('input', () => onInput(area.innerHTML));
  area.addEventListener('paste', (e) => {
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });
  if (f.type === 'inline') area.addEventListener('keydown', (e) => e.key === 'Enter' && e.preventDefault());

  const cmd = (name, label, title, arg) => el('button', {
    type: 'button',
    title,
    onmousedown: (e) => e.preventDefault(),
    onclick: () => {
      const a = arg ? arg() : undefined;
      if (arg && !a) return;
      document.execCommand(name, false, a);
      onInput(area.innerHTML);
    },
  }, label);
  const tools = [cmd('bold', 'B', 'Bold'), cmd('italic', 'I', 'Italic')];
  if (f.type === 'rich') {
    tools.push(cmd('underline', 'U', 'Underline'), cmd('createLink', 'Link', 'Add link', () => {
      const href = prompt('Link address (https://…)');
      return href && safeUrl(href) ? href : null;
    }));
  }
  return el('div', {}, el('div', { class: 'toolbar' }, tools), area);
}

// Image URL with thumbnail and a sharpness check against the recommended 2× size
function imageField(f, value, id, onInput) {
  const thumb = el('img', { class: 'thumb', alt: '', hidden: !value });
  const msg = el('div', { class: 'msg' });
  const check = (src) => {
    msg.textContent = '';
    thumb.hidden = !src;
    if (!src) return;
    thumb.src = src;
    const probe = new Image();
    probe.onload = () => {
      const [w] = f.size ?? [];
      if (w && probe.naturalWidth < w) {
        msg.className = 'msg warn';
        msg.textContent = `Image is ${probe.naturalWidth}px wide; export at ${w}px or more to look sharp on high-resolution screens.`;
      }
    };
    probe.onerror = () => { msg.className = 'msg error'; msg.textContent = 'Image could not be loaded.'; };
    probe.src = src;
  };
  const input = el('input', { id, type: 'url', value: value ?? '', placeholder: 'Paste the Content Builder image URL', oninput: (e) => { onInput(e.target.value); check(e.target.value); } });
  check(value);
  const size = f.size && el('div', { class: 'help' }, `Recommended size: ${f.size[0]}×${f.size[1]}px`);
  return el('div', { class: 'field' }, el('label', { for: id }, f.label + (f.required ? ' *' : '')), input, size, f.help && el('div', { class: 'help' }, f.help), thumb, msg);
}

function listField(f, scope) {
  const items = () => {
    let arr = getPath(scope(), f.key);
    if (!arr) setPath(scope(), f.key, (arr = []));
    return arr;
  };
  const max = f.max ?? 20;
  const min = f.min ?? 0;
  const wrap = el('div', { class: 'field' }, el('div', { class: 'label' }, f.label));
  const box = el('div', { class: 'list' });
  wrap.append(box);

  const draw = () => {
    box.replaceChildren();
    items().forEach((item, i) => {
      const itemScope = () => items()[i];
      const head = el('div', { class: 'item-head' }, `${f.label.replace(/s$/, '')} ${i + 1}`,
        el('span', {},
          el('button', { type: 'button', title: 'Move up', disabled: i === 0, onclick: () => { const a = items(); [a[i - 1], a[i]] = [a[i], a[i - 1]]; draw(); scheduleOutput(); } }, '↑'),
          ' ',
          el('button', { type: 'button', title: 'Remove', disabled: items().length <= min, onclick: () => { items().splice(i, 1); draw(); scheduleOutput(); } }, 'Remove')));
      box.append(el('div', { class: 'item' }, head, f.fields.map((sub) => buildField(sub, itemScope))));
    });
    box.append(el('button', { type: 'button', class: 'add', disabled: items().length >= max, onclick: () => { items().push(structuredClone(items().at(-1) ?? {})); draw(); scheduleOutput(); } }, `+ Add ${f.label.replace(/s$/, '').toLowerCase()}`));
  };
  draw();
  return wrap;
}

function buildForm() {
  const form = $('#form');
  visibility.length = 0;
  form.replaceChildren();
  const scope = () => state.data;
  let group;
  for (const f of schemas[state.component] ?? []) {
    if (f.group && f.group !== group) form.append(el('div', { class: 'group-title' }, f.group));
    group = f.group;
    const node = buildField(f, scope);
    if (f.when) visibility.push([node, f.when, scope]);
    form.append(node);
  }
  refreshVisibility();
}

// ---------------------------------------------------------------------------
// Component picker

// Content per component is kept while the editor is open, so switching back and forth loses nothing
// (no confirm dialog: Content Builder's iframe may block modals).
const drafts = {};

function selectComponent(id, data) {
  if (state.component) drafts[state.component] = state.data;
  state = { component: id, data: data ?? drafts[id] ?? structuredClone(components[id].samples[0].data) };
  $('#component').value = id;
  buildForm();
  output();
}

function init(saved) {
  const ids = Object.keys(components).filter((id) => !layer || id.startsWith(`${layer}.`));
  const picker = $('#component');
  picker.replaceChildren(...ids.map((id) => el('option', { value: id }, `${id} ${components[id].name}`)));
  picker.addEventListener('change', (e) => selectComponent(e.target.value));

  if (!inSfmc) {
    $('#preview').hidden = false;
    document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $('#frame').width = b.dataset.width;
    }));
  }

  const start = saved?.component && components[saved.component] && ids.includes(saved.component) ? saved.component : ids[0];
  selectComponent(start, start === saved?.component ? saved.data : undefined);
}

document.title = layer ? `J&B · ${layer} ${layers[layer] ?? ''}` : document.title;
sdk.getData(init);
