/** listen ()
 * Utility function that accepts a node, event name, event handler and options,
 * and returns a function to remove the added listener.
 */

export const listen = (node, eventName, handler, options) => {
  node.addEventListener(eventName, handler, options);
  return () => { node.removeEventListener(eventName, handler, options); };
};
