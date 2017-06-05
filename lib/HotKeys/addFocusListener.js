/*  
*   If possible, applies the browser's native focusin handler to the supplied element.
*   Returns method for removing the listener (good for unmounting);
*/
export default function addFocusListener(elem, handler) {
  let eventName;
  let useCapture;
  let remove;
  if ("onfocusin" in document) {
    eventName = "focusin";
    useCapture = false;
  } else {      
    eventName = "focus";
    useCapture = true;
  }

  elem.addEventListener(eventName, handler, useCapture);
  remove = () => elem.removeEventListener(eventName, handler, useCapture);

  return { remove };
}
