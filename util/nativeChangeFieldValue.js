/* Programmatically change a field value and trigger the onChange event so that external state can be updated...
*  input ref - reference object
*  focus - boolean - send focus to the field after clearing.
*  value - new value for the field.
*  triggerChange - defaults true - whether or not to trigger the change event.
*/

function deletePropertySafe(elem, prop) {
  const desc = Object.getOwnPropertyDescriptor(elem, prop);
  if (desc && desc.configurable) {
    delete elem[prop];
  }
}

export default (inputRef, focus, value = '', triggerChange = true) => {
  const node = inputRef.current;
  let event;

  // grab the whole current descriptor for value (set and all...);
  const descriptor = Object.getOwnPropertyDescriptor(node, 'value');

  // maybe trigger focus...may be required...
  if (focus) {
    event = document.createEvent('UIEvents');
    event.initEvent('focus', false, false);
    node.dispatchEvent(event);
  }

  const initialValue = node.value;
  node.value = initialValue + '#';
  deletePropertySafe(node, 'value');
  node.value = value;

  if (triggerChange) {
    event = document.createEvent('HTMLEvents');
    event.initEvent('propertychange', false, false);
    event.propertyName = 'value';
    node.dispatchEvent(event);

    event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, false);
    node.dispatchEvent(event);
  }

  // Restore artificial value property descriptor.
  if (descriptor) {
    Object.defineProperty(node, 'value', descriptor);
  }

  // if focus was demanded, finish with that.
  if (focus) {
    node.focus();
  }
};
