import {
  attribute,
  fillable,
  interactor,
  Interactor,
  value,
} from '@bigtest/interactor';
import TextFieldInteractor from '../../TextField/tests/interactor';


@interactor class TimepickerInteractor {
  id = attribute('input', 'id');
  inputValue = value('input');
  input = new TextFieldInteractor('[data-test-timepicker-input]')
  fillInput = fillable('input');
  dropdown = new Interactor('[data-test-timepicker-dropdown]');
}

export default TimepickerInteractor;
