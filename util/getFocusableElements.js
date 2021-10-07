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

// THIS FILE IS ADAPTED FROM https://github.com/folio-org/stripes-components/blob/master/util/getFocusableElements.js
// With the option included to return null if run out of options
import contains from 'dom-helpers/query/contains';
import matches from 'dom-helpers/query/matches';
import first from 'lodash/first';
import last from 'lodash/last';

function getVisibleFocusableElements(container = document, includeContained, currentElement) {
  if (container.querySelectorAll) {
    // eslint-disable-next-line max-len
    const focusableSelector = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), [tabIndex="-1"]:not([disabled]):focus';
    return Array.from(container.querySelectorAll(focusableSelector))
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

function getFocusableElement(next, currentElement, includeContained = true, onlyContained = false, loop = true, nullOnExit = false) {
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
