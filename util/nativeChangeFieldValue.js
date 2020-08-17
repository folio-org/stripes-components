/* Programmatically change a field value and trigger the onChange event so that external state can be updated...
*  input ref - reference object
*  focus - boolean - send focus to the field after clearing.
*  value - new value for the field.
*  triggerChange - defaults true - whether or not to trigger the change event.
*/

export default (inputRef, focus, value = '', triggerChange = true) => {
  if (inputRef.current) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputRef.current, value);

    if (triggerChange) {
      const ev = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(ev);
      if (focus) {
        inputRef.current.focus();
      }
    }
  }
};
