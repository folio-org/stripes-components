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
import styles from '../RadioButton.css';

const rootClass = `.${styles.radioButton}`;

export default interactor(class CheckboxInteractor {
  id = attribute('input', 'id');
  clickLabel = clickable('label');
  blurInput = blurrable('input');
  inputValue = value('input');
  isChecked = property('input', 'checked');
  feedbackText = text(`.${styles.radioFeedback}`);
  hasWarningStyle = hasClass(rootClass, styles.hasWarning);
  hasErrorStyle = hasClass(rootClass, styles.hasError);

  clickAndBlur() {
    return this
      .clickLabel()
      .blurInput();
  }
});
