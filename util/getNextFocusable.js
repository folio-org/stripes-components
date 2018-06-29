/*  Returns next focusable DOM element
*   Params:
*     currentElement
*       (object) DOM element - starting element for search. Returns next focused element AFTER this element.
*     containing
*       (bool) Default: true. Will return the next focusable item within the current element.
*/

import contains from 'dom-helpers/query/contains';

export default function getNextFocusable(currentElement, containing = true) { // eslint-disable-line consistent-return
  // add all elements we want to include in our selection
  // eslint-disable-next-line max-len
  const focusableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
  let focusable = Array.prototype.filter.call(document.querySelectorAll(focusableElements),
    (element) => {
      // check for visibility while always include the current activeElement
      return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
    });
  if (!containing) {
    const outside = Array.prototype.filter.call(focusable, (element) => {
      if (element === currentElement) {
        return element;
      }
      return !contains(currentElement, element);
    });
    focusable = outside;
  }

  const index = focusable.indexOf(currentElement);
  if (index > -1) {
    const nextElement = focusable[index + 1] || focusable[0];
    return nextElement;
  }
}
