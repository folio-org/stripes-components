import {
  attribute,
  blurrable,
  clickable,
  hasClass,
  interactor,
  property,
  text,
  value,
} from '@bigtest/interactor';
import styles from '../Checkbox.css';

const rootClass = `.${styles.checkbox}`;

export default interactor(class CheckboxInteractor {
  className = attribute(rootClass, 'class');
  id = attribute('input', 'id');
  clickLabel = clickable('label');
  blurInput = blurrable('input');
  inputValue = value('input');
  isChecked = property('input', 'checked');
  label = text(`.${styles.label}`);
  feedbackText = text(`.${styles.checkboxFeedback}`);
  hasWarningStyle = hasClass(rootClass, styles.hasWarning);
  hasErrorStyle = hasClass(rootClass, styles.hasError);
  isFullWidth = hasClass(rootClass, styles.fullWidth);
  isVertical = hasClass(rootClass, styles.vertical);

  ariaInvalid = attribute('input', 'aria-invalid');

  clickAndBlur() {
    return this
      .clickLabel()
      .blurInput();
  }
});
