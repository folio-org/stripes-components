/**
 *  @typedef {Function} getScrollParent()
 *   @description A vanilla combination of jquery's scrollParent, adjusted for FOLIO usage
 *  This function traverses the heirarchy of parent elements to find the element
 *  that user must scroll to reveal hidden parts of the element provided - the
 *  element that would be in charge of cropping off the provided element and possibly
 *  have scrollbars if the provided element has larger dimensions.
 *  Params:
 *    @param {object} element - an html element, or value of react ref's 'current' property.
 *    @param {bool} includeHiddenOverflow - if true elements with `overflow: hidden` will be included in the search.
 *        Note that overflow: hidden parents will crop off the provided element, but won't have any scroll bars
 *        to interact with.
 */

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
