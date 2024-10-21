/**
 * Checks if a given DOM element is within the viewport.
 *
 * This function determines whether the specified element is currently visible
 * within the bounds of the browser's viewport by calculating the element's
 * bounding rectangle and comparing it to the viewport dimensions.
 *
 * @param {HTMLElement} element - The DOM element to check for visibility in the viewport.
 * @returns {boolean} `true` if the element is within the viewport, `false` otherwise.
 */

export default function isElementInViewport(element) {
  const rect = element?.getBoundingClientRect();

  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
