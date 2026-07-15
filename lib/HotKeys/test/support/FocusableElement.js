import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

export default class FocusableElement {
  constructor(wrapper, testId) {
    this.element = wrapper.getByTestId(testId);
  }

  focus() {
    fireEvent.focus(this.element);
  }

  keyDown(keyCode) {
    fireEvent.keyDown(this.element, { keyCode });
  }

  keyPress(keyCode) {
    fireEvent.keyDown(this.element, { keyCode });
    fireEvent.keyPress(this.element, { keyCode });
  }

  keyUp(keyCode) {
    fireEvent.keyDown(this.element, { keyCode });
    fireEvent.keyUp(this.element, { keyCode });
  }

  fill(value) {
    fireEvent.change(this.element, { target: { value: 'test' } });
  }

  getInstance() {
    return this.element;
  }
};
