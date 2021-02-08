import {
  attribute,
  fillable,
  interactor,
  isPresent,
  property,
  selectable
} from '@bigtest/interactor';
import textAreaCSS from '../../TextArea/TextArea.css';
import textFieldCSS from '../../TextField/TextField.css';

export default interactor(class MultiSelectSearchFieldInteractor {
  id = attribute('input', 'id');
  fillInput = fillable('input');
  selectIndex = selectable('select');
  placeholder = attribute('input', 'placeholder');
  isDisabled = property('input', 'disabled');
  inputReadOnly = attribute('input', 'readonly');
  isDisabledIndex = property('select', 'disabled');
  textareaPresent = isPresent(`.${textAreaCSS.textArea}`);
  inputPresent = isPresent(`.${textFieldCSS.textField}`);
});
