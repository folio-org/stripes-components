/**
 * Calculates number percentage between 2 Numbers
 *
 * @param {number} current
 * @param {number} total
 * @returns {number}
 */
export function calculatePercentage(current, total) {
  return Math.floor((current / total) * 100);
}
