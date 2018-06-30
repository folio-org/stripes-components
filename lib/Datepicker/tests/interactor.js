import {
  attribute,
  blurrable,
  clickable,
  fillable,
  focusable,
  interactor,
  triggerable,
  value,
} from '@bigtest/interactor';

@interactor class Calendar {}

export default interactor(class DatepickerInteractor {
  calendar = new Calendar('[data-test-calendar]');
  id = attribute('input', 'id');
  inputValue = value('input');
  fillInput = fillable('input');
  focusInput = focusable('input');
  blurInput = blurrable('input');
  clickInput = clickable('input');
  pressEnter = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });
  placeholder = attribute('input', 'placeholder');

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }
});
