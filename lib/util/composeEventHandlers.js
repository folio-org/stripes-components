/*
* Used to compose event handlers, calling the parameter array of functions in order.
*/
export default function composeEventHandlers(...fns) {
  return (event, ...args) => fns.forEach(fn => { if (fn) { fn(event, ...args); } });
}
