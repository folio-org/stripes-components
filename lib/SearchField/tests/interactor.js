import {
  attribute,
  fillable,
  interactor,
  property,
  selectable
} from '@bigtest/interactor';

export default interactor(class SearchFieldInteractor {
  id = attribute('input', 'id');
  fillInput = fillable('input');
  selectIndex = selectable('select');
  placeholder = attribute('input', 'placeholder');
  isDisabled = property('input', 'disabled');
  inputReadOnly = attribute('input', 'readonly');
  isDisabledIndex = property('select', 'disabled');
});
