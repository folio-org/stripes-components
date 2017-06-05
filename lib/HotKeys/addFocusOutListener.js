/*  If possible, applies the browser's native focusout handler
*   Returns method for removing the listener (good for unmounting);
*/
export default function addFocusOutListener(elem, handler) {
  let eventName;
  let useCapture;
  let remove;
  if ("onfocusin" in document) {
    eventName = "focusout";
    useCapture = false;
  } else {      
    eventName = "blur";
    useCapture = true;
  }

  elem.addEventListener(eventName, handler, useCapture);
  remove = () => elem.removeEventListener(eventName, handler, useCapture);

  return { remove };
}