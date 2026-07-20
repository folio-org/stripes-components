export default function contains(container, node) {
  if (container && node) {
    /* istanbul ignore else */
    if (container.contains) {
      return container.contains(node);
    }
    /* istanbul ignore next */
    if (container.compareDocumentPosition) {
      return container === node || (container.compareDocumentPosition(node) === 16);
    }
  }
  return false;
}
