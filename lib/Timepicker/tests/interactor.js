import {
  attribute,
  fillable,
  interactor,
  Interactor,
  value,
} from '@bigtest/interactor';

import css from '../TimeDropdown.css';
import TextFieldInteractor from '../../TextField/tests/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

@interactor class TimepickerDropdownInteractor {
  static defaultScope = '[data-test-timepicker-dropdown]';

  confirmButton = new ButtonInteractor(`.${css.submitButton}`);
  minutesInput = new TextFieldInteractor('[data-test-timepicker-dropdown-minutes-input]');
  hoursInput = new TextFieldInteractor('[data-test-timepicker-dropdown-hours-input]');
}

@interactor class TimepickerInteractor {
  id = attribute('input', 'id');
  inputValue = value('input');
  input = new TextFieldInteractor('[data-test-timepicker-input]')
  fillInput = fillable('input');
  dropdown = new TimepickerDropdownInteractor('[data-test-timepicker-dropdown]');
}

export default TimepickerInteractor;
