import createDOMPurify from 'dompurify';

// Elements that are interactive, can load active content, or can restyle/hijack the page.
// These are always forbidden, even when a consumer's config tries to allow them.
const FORBIDDEN_TAGS = [
  'form', 'input', 'button', 'select', 'textarea', 'option', 'label',
  'style', 'script', 'iframe', 'object', 'embed', 'svg', 'math',
  'video', 'audio', 'link', 'meta', 'base', 'template', 'noscript',
];

// DOMPurify already drops `on*` handlers. They're listed along with a hook (below) for defense in depth.
const FORBIDDEN_ATTRS = [
  'style', 'srcset', 'formaction',
  'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus',
];

// Only web, mail and phone links, relative URLs and raster image data URIs.
// Notably excludes `javascript:`, `vbscript:` and `data:text/html`.
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|data:image\/(?:png|jpe?g|gif|webp)[;,]|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;
const SAFE_DATA_IMAGE = /^data:image\/(?:png|jpe?g|gif|webp)[;,]/i;

export const defaultSanitizeConfig = Object.freeze({
  ALLOWED_TAGS: [
    'a', 'img', 'p', 'br', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'sub', 'sup', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'width', 'height'],
  FORBID_TAGS: FORBIDDEN_TAGS,
  FORBID_ATTR: FORBIDDEN_ATTRS,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  ALLOWED_URI_REGEXP,
});

const ARRAY_KEYS = ['ALLOWED_TAGS', 'ALLOWED_ATTR', 'ADD_TAGS', 'ADD_ATTR', 'FORBID_TAGS', 'FORBID_ATTR'];

// Consumer config is layered over the defaults. Array options are unioned with the defaults, so
// overrides can widen the allowlists (ADD_TAGS, ADD_ATTR, ...) but the forbidden lists
// can only grow. DOMPurify gives FORBID_* precedence over allow lists.
const mergeConfig = (config = {}) => {
  const merged = { ...defaultSanitizeConfig, ...config };

  ARRAY_KEYS.forEach(key => {
    const union = [...(defaultSanitizeConfig[key] || []), ...(config[key] || [])];
    if (union.length) merged[key] = [...new Set(union)];
  });

  // these must never be weakened by an override.
  merged.FORBID_TAGS = [...new Set([...FORBIDDEN_TAGS, ...(config.FORBID_TAGS || [])])];
  merged.FORBID_ATTR = [...new Set([...FORBIDDEN_ATTRS, ...(config.FORBID_ATTR || [])])];
  merged.ALLOW_UNKNOWN_PROTOCOLS = false;

  return merged;
};

let purifier;
// set by hooks when they alter markup without DOMPurify recording a removal.
let hookModified = false;

// An isolated instance keeps our hooks/config from leaking into other users of the global DOMPurify.
const getPurifier = () => {
  if (purifier) return purifier;
  if (typeof window === 'undefined') return null;

  purifier = createDOMPurify(window);

  purifier.addHook('uponSanitizeAttribute', (node, data) => {
    const name = data.attrName.toLowerCase();

    if (name.startsWith('on')) {
      data.keepAttr = false;
      return;
    }

    if (node.nodeName === 'IMG' && name === 'src') {
      const value = String(data.attrValue).replace(/[\u0000- ]/g, '');
      if (/^data:/i.test(value) && !SAFE_DATA_IMAGE.test(value)) {
        data.keepAttr = false;
      }
    }
  });

  purifier.addHook('afterSanitizeAttributes', node => {
    if (node.nodeName !== 'A' || !node.hasAttribute('target')) return;

    if (!['_blank', '_self'].includes(node.getAttribute('target'))) {
      node.removeAttribute('target');
      hookModified = true;
    } else if (node.getAttribute('target') === '_blank' &&
      node.getAttribute('rel') !== 'noopener noreferrer') {
      node.setAttribute('rel', 'noopener noreferrer');
      hookModified = true;
    }
  });

  return purifier;
};

/**
 * Sanitize HTML (e.g. from a backend response) before rendering it.
 * Only a small set of formatting tags, anchors and images survive. Interactive elements,
 * scripts, styles, event handler attributes and unsafe URLs are removed.
 *
 * @param {string} html - markup to sanitize. Non-strings are returned unchanged.
 * @param {object} [config] - DOMPurify options layered over `defaultSanitizeConfig`.
 * @returns {string} sanitized markup
 */
export const sanitizeHtml = (html, config = {}) => {
  const dompurify = getPurifier();

  if (typeof html !== 'string' || !dompurify) return html;

  hookModified = false;
  const result = dompurify.sanitize(html, mergeConfig(config));

  // If nothing was actually removed or changed, keep the original string. DOMPurify may reorder
  // attributes, which makes editors like Quill treat the value as changed and reset the cursor.
  if (result !== html && dompurify.removed.length === 0 && !hookModified) {
    return html;
  }

  return result;
};

export default sanitizeHtml;
