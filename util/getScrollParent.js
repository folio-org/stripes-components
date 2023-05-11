/* A vanilla combination of jquery's scrollParent, adjusted for FOLIO usage */

export default function getScrollParent(element, includeHiddenOverflow) {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHiddenOverflow ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === 'fixed') return document.body;
  let curElement = element;
  while (curElement.parentNode && curElement !== document.body) {
    style = getComputedStyle(curElement.parentNode);
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      if (excludeStaticParent) {
        if (style.position !== 'static') {
          return curElement.parentNode;
        }
      } else {
        return curElement.parentNode;
      }
    }
    curElement = curElement.parentNode;
  }
  return document.body;
}
