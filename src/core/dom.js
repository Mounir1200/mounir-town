// Builds DOM nodes without innerHTML so content strings are always treated as text.
export function el(tag, options = {}, ...children) {
  const element = document.createElement(tag);
  const { className, text, attrs, dataset, on, ...properties } = options;
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  Object.entries(attrs ?? {}).forEach(([name, value]) => {
    if (value !== null && value !== undefined && value !== false) element.setAttribute(name, value === true ? '' : value);
  });
  Object.assign(element.dataset, dataset ?? {});
  Object.entries(on ?? {}).forEach(([event, handler]) => element.addEventListener(event, handler));
  Object.assign(element, properties);
  append(element, children);
  return element;
}

export function append(parent, children) {
  children.flat(Infinity).forEach(child => {
    if (child === null || child === undefined || child === false) return;
    parent.append(child instanceof Node ? child : String(child));
  });
  return parent;
}

export function externalLink(href, label, className = 'link') {
  return el('a', { className, href, text: `${label} ↗`, attrs: { target: '_blank', rel: 'noopener' } });
}

export function prefersReducedMotion() {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function isTouchFirst() {
  return globalThis.matchMedia?.('(pointer: coarse)').matches ?? false;
}
