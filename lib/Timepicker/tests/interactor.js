import {
  attribute,
  fillable,
  interactor,
  value,
} from '@bigtest/interactor';

import css from '../TimeDropdown.css';
import TextFieldInteractor from '../../TextField/tests/interactor';
import ButtonInteractor from '../../Button/tests/interactor';
import IconButtonInteractor from '../../IconButton/tests/interactor';

@interactor class TimepickerDropdownInteractor {
  static defaultScope = '[data-test-timepicker-dropdown]';

  confirmButton = new ButtonInteractor(`.${css.submitButton}`);

  hoursInput = new TextFieldInteractor('[data-test-timepicker-dropdown-hours-input]');
  incrementHoursButton = new IconButtonInteractor('[data-test-timepicker-dropdown-increment-hours-button]');
  decrementHoursButton = new IconButtonInteractor('[data-test-timepicker-dropdown-decrement-hours-button]');

  minutesInput = new TextFieldInteractor('[data-test-timepicker-dropdown-minutes-input]');
  incrementMinutesButton = new IconButtonInteractor('[data-test-timepicker-dropdown-increment-minutes-button]');
  decrementMinutesButton = new IconButtonInteractor('[data-test-timepicker-dropdown-decrement-minutes-button]');
}

@interactor class TimepickerInteractor {
  id = attribute('input', 'id');
  inputValue = value('input');
  input = new TextFieldInteractor('[data-test-timepicker-input]')
  fillInput = fillable('input');
  dropdown = new TimepickerDropdownInteractor('[data-test-timepicker-dropdown]');
}

export default TimepickerInteractor;
