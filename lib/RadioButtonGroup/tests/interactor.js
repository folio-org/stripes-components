import {
  attribute,
  collection,
  interactor,
  text
} from '@bigtest/interactor';
import RadioButtonInteractor from '../../RadioButton/tests/interactor';
import styles from '../RadioButtonGroup.css';
import radioButtonStyles from '../../RadioButton/RadioButton.css';

const radioButtonRootClass = `.${radioButtonStyles.radioButton}`;

export default interactor(class RadioButtonGroupInteractor {
  id = attribute('input', 'id');
  options = collection(radioButtonRootClass, RadioButtonInteractor);
  feedbackText = text(`.${styles.groupFeedback}`);
});
