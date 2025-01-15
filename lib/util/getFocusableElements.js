/**
 * @typedef {Function} getNextFocusable()
 *    @description Returns next/previous focusable DOM element, respectively
 *   Params:
 *     @param {object} currentElement
 *       DOM element - starting element for search. Returns next focused element AFTER this element.
 *     @param {bool} includeContained
 *       Default: true. Will return the next focusable item within the current element. If false, returned
 *       element will be outside of the container,
 *      @param {bool} onlyContained
 *       Default: false. If true and includeContaining is true, the search is limited only to
 *        elements within the container.
 *     @param {bool} loop
 *       Default: true. Elements are chosen by index. If the index is beyond the end of the list,
 *       the first element will be returned.
 *       If the index is before the start of the list, the last element will be returned.
*/

import first from 'lodash/first';
import last from 'lodash/last';

// eslint-disable-next-line max-len
export const FOCUSABLE_SELECTOR = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), [tabIndex="-1"]:not([disabled]):focus';

function getVisibleFocusableElements(container = document, includeContained, currentElement) {
  if (container.querySelectorAll) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((element) => {
        if (!includeContained) {
          if (element === currentElement) {
            return true;
          }
          if (currentElement && currentElement.contains(element)) {
            return false;
          }
        }

        if (element.matches('[data-focus-exclude]')) {
          return false;
        }

        // check for visibility while always include the current activeElement
        return element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement;
      });
  }
  return [];
}

function getNextorPrevious(collection, current, loop, next, nullOnExit = false) {
  let index = collection.indexOf(current);
  if (index === -1) {
    index = collection.indexOf(document.activeElement);
  }
  const nextElement = collection[index + 1];
  const previousElement = collection[index - 1];

  // First determine if travelling forwards or backwards through the list
  if (next) {
    // If looping then loop to beginning if nextElement is null
    if (loop) {
      return nextElement || collection[0];
    }

    // If nullOnExit then return null if nextElement is null
    if (nullOnExit) {
      return nextElement;
    }

    // Else return end of the list if nextElement is null
    return collection[index + 1] || collection[collection.length - 1];
  } else {
    // If looping then loop to end if previousElement is null
    if (loop) {
      return previousElement || collection[collection.length - 1];
    }

    // If nullOnExit then return null if previousElement is null
    if (nullOnExit) {
      return previousElement;
    }

    // Else return beginning of the list if previousElement is null
    return collection[index - 1] || collection[0];
  }
}

function getFocusableElement(
  next,
  currentElement,
  includeContained = true,
  onlyContained = false,
  loop = true,
  nullOnExit = false
) {
  const container = includeContained && onlyContained ? currentElement : document;
  const focusable = getVisibleFocusableElements(container, includeContained, currentElement);
  if (focusable.length > 0) {
    return getNextorPrevious(focusable, currentElement, loop, next, nullOnExit);
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
