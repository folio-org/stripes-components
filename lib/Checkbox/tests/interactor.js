import {
  attribute,
  blurrable,
  clickable,
  hasClass,
  interactor,
  property,
  text,
  value,
  isPresent,
  focusable,
} from '@bigtest/interactor';
import styles from '../Checkbox.css';

export default interactor(class CheckboxInteractor {
  static defaultScope = `.${styles.checkbox}`;
  className = attribute('class');
  id = attribute('input', 'id');
  clickLabel = clickable('label');
  clickInput = clickable('input');
  blurInput = blurrable('input');
  focusInput = focusable('input');
  inputValue = value('input');
  isChecked = property('input', 'checked');
  isDisabled = property('input', 'disabled');
  label = text(`.${styles.label}`);
  hasLabelElement = isPresent('label');
  feedbackText = text(`.${styles.checkboxFeedback}`);
  hasWarningStyle = hasClass(styles.hasWarning);
  hasErrorStyle = hasClass(styles.hasError);
  isFullWidth = hasClass(styles.fullWidth);
  isVertical = hasClass(styles.vertical);
  ariaInvalid = attribute('input', 'aria-invalid');
  ariaLabel = attribute('input', 'aria-label');

  clickAndBlur() {
    return this
      .clickLabel()
      .blurInput();
  }
});
