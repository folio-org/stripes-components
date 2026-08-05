/**
 * Small WCAG contrast-ratio helpers for the Color Contrast Tool guide page.
 *
 * There's no in-repo color-math utility to lean on, so this resolves CSS custom
 * properties via the browser itself (rather than hand-parsing color-mix()/oklch()/var()
 * chains) and implements the WCAG relative-luminance / contrast-ratio formulas directly.
 */

// Parses an rgb()/rgba() computed-style string into { r, g, b, a }.
export function parseRgb(str) {
  const match = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/.exec(str);
  if (!match) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  const [, r, g, b, a] = match;
  let alpha = 1;
  if (a !== undefined) {
    alpha = a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a);
  }
  return { r: Number(r), g: Number(g), b: Number(b), a: alpha };
}

// Resolves a CSS variable (e.g. '--primary') to whatever rgb()/rgba() string the browser
// computes for it, by applying it as `color` on an offscreen element and reading back
// the computed style. This handles any color function the browser supports, including
// color-mix(), oklch(), and var() chains found in lib/variables.css.
export function resolveCssVarColor(varName) {
  const el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  el.style.pointerEvents = 'none';
  el.style.color = `var(${varName})`;
  document.body.appendChild(el);
  const { color } = window.getComputedStyle(el);
  document.body.removeChild(el);
  return parseRgb(color);
}

// Blends a (possibly transparent) color over an opaque background, since several
// variables.css values are rgba() fills meant to sit on top of another color.
export function flattenOnBackground({ r, g, b, a = 1 }, bg) {
  return {
    r: (r * a) + (bg.r * (1 - a)),
    g: (g * a) + (bg.g * (1 - a)),
    b: (b * a) + (bg.b * (1 - a)),
  };
}

// WCAG relative luminance: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
export function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * rs) + (0.7152 * gs) + (0.0722 * bs);
}

// WCAG contrast ratio: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
export function contrastRatio(rgbA, rgbB) {
  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function toHex({ r, g, b }) {
  const channel = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`.toLowerCase();
}
