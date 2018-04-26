import {
  attribute,
  fillable,
  interactor,
  value,
} from '@bigtest/interactor';

export default interactor(class TimepickerInteractor {
  id = attribute('input', 'id');
  inputValue = value('input');
  fillInput = fillable('input');
});
