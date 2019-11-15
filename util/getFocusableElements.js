/*  getNextFocusable() and getPreviousFocusable() -
*    Returns next/previous focusable DOM element, respectively
*   Params:
*     currentElement
*       (object) DOM element - starting element for search. Returns next focused element AFTER this element.
*     includeContaining
*       (bool) Default: true. Will return the next focusable item within the current element. If false, returned
*       element will be outside of the container,
*      strict
*       (bool) Default: false. If true and includeContaining is true, the search is limited only to
*        elements within the container.
*     loop
*       (bool) Default: true. Elements are chosen by index. If the index is beyond the end of the list,
*       the first element will be returned.
*       If the index is before the start of the list, the last element will be returned.
*/

import contains from 'dom-helpers/query/contains';

function getVisibleFocusableElements(container = document) {
  if (container.querySelectorAll) {
    // eslint-disable-next-line max-len
    const focusableSelector = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), [tabIndex="-1"]:not([disabled]):focus';
    const focusableElements = Array.from(container.querySelectorAll(focusableSelector))
      .filter((element) => {
        // check for visibility while always include the current activeElement
        return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
      });
    return focusableElements;
  }
  return [];
}

function getItem(collection, current, loop, next) {
  let index = collection.indexOf(current);
  if (index === -1) {
    index = collection.indexOf(document.activeElement);
  }

  if (loop) {
    return next ?
      collection[index + 1] || collection[0] :
      collection[index - 1] || collection[collection.length - 1];
  }
  return next ?
    collection[index + 1] || collection[collection.length - 1] :
    collection[index - 1] || collection[0];
}

export function getNextFocusable(currentElement, includeContaining = true, strict = false, loop = true) {
  const container = includeContaining && strict ? currentElement : document;
  let focusable = getVisibleFocusableElements(container);
  if (!includeContaining) {
    const outside = focusable.filter((element) => {
      if (element === currentElement) {
        return element;
      }
      return !contains(currentElement, element);
    });
    focusable = outside;
  }

  if (focusable.length > 0) {
    return getItem(focusable, currentElement, loop, true);
  }
  return null;
}

export function getPreviousFocusable(currentElement, includeContaining = true, strict = false, loop = true) {
  const container = includeContaining && strict ? currentElement : document;
  let focusable = getVisibleFocusableElements(container);
  if (!includeContaining) {
    const outside = focusable.filter((element) => {
      if (element === currentElement) {
        return element;
      }
      return !contains(currentElement, element);
    });
    focusable = outside;
  }

  if (focusable.length > 0) {
    return getItem(focusable, currentElement, loop, false);
  }
  return null;
}
