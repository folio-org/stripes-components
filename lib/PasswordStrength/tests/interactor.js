import {
  action,
  interactor,
  scoped,
  value,
  Interactor,
} from '@bigtest/interactor';

@interactor class InputField {
  value = value('input', 'type');

  fillInput = action(function (val) {
    return this.fill('input', val);
  });

  focusInput = action(function () {
    return this.focus('input');
  });

  blurInput = action(function () {
    return this.blur('input');
  });
}

@interactor class PasswordStrengthIndicator {
  text = scoped('[class^="password-strength-text__wrapper--"]');
  label = scoped('[class^="password-strength__label--"]');
  veryWeakIndicator = new Interactor('[class*="indicator__container--veryWeak--"]');
  weakIndicator = new Interactor('[class*="indicator__container--weak--"]');
  reasonableIndicator = new Interactor('[class*="indicator__container--reasonable--"]');
  strongIndicator = new Interactor('[class*="indicator__container--strong--"]');
  veryStrongIndicator = new Interactor('[class*="indicator__container--veryStrong--"]');
}

@interactor class PasswordStrengthComponent {
  passwordStrength = new PasswordStrengthIndicator('[class^="password-strength"]');
  textInput = new InputField('[class^="textField--"]');
}

export default new PasswordStrengthComponent('[data-test-password-strength]');
