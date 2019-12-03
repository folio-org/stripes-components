/*  getNextFocusable() and getPreviousFocusable() -
*    Returns next/previous focusable DOM element, respectively
*   Params:
*     currentElement
*       (object) DOM element - starting element for search. Returns next focused element AFTER this element.
*     includeContained
*       (bool) Default: true. Will return the next focusable item within the current element. If false, returned
*       element will be outside of the container,
*      onlyContained
*       (bool) Default: false. If true and includeContaining is true, the search is limited only to
*        elements within the container.
*     loop
*       (bool) Default: true. Elements are chosen by index. If the index is beyond the end of the list,
*       the first element will be returned.
*       If the index is before the start of the list, the last element will be returned.
*/

import contains from 'dom-helpers/query/contains';
import matches from 'dom-helpers/query/matches';
import first from 'lodash/first';
import last from 'lodash/last';

function getVisibleFocusableElements(container = document, includeContained, currentElement) {
  if (container.querySelectorAll) {
    // eslint-disable-next-line max-len
    const focusableSelector = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), [tabIndex="-1"]:not([disabled]):focus';
    const focusableElements = Array.from(container.querySelectorAll(focusableSelector))
      .filter((element) => {
        if (!includeContained) {
          if (element === currentElement) {
            return true;
          }
          if (currentElement && contains(currentElement, element)) {
            return false;
          }
        }

        if (matches(element, '[data-focus-exclude]')) {
          return false;
        }

        // check for visibility while always include the current activeElement
        return element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement;
      });
    return focusableElements;
  }
  return [];
}

function getNextorPrevious(collection, current, loop, next) {
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

function getFocusableElement(next, currentElement, includeContained = true, onlyContained = false, loop = true) {
  const container = includeContained && onlyContained ? currentElement : document;
  const focusable = getVisibleFocusableElements(container, includeContained, currentElement);
  if (focusable.length > 0) {
    return getNextorPrevious(focusable, currentElement, loop, next);
  }
  return null;
}

export function getNextFocusable(...args) {
  return getFocusableElement(true, ...args);
}

export function getPreviousFocusable(...args) {
  return getFocusableElement(false, ...args);
}

export function getLastFocusable(container) {
  return last(getVisibleFocusableElements(container));
}

export function getFirstFocusable(container) {
  return first(getVisibleFocusableElements(container));
}
