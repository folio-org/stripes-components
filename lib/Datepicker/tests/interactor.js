import {
  attribute,
  blurrable,
  clickable,
  fillable,
  focusable,
  interactor,
  is,
  triggerable,
  selectable as selectOption,
  value,
  collection,
  text,
  scoped,
  property,
  hasClass,
  action
} from '@bigtest/interactor';

import css from '../Calendar.css';
import TextFieldInteractor from '../../TextField/tests/interactor';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/**
 * Set the selection range on an element. Equivalent to calling
 * inputElement.setSelectionRange(selectionStart, selectionEnd)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
 *
 * @param {*} selector
 * @param {Number} start
 * @param {Number} end
 */
function selectable(selector = null) {
  return action(function (start = 0, end = start) {
    return this.$(selector).setSelectionRange(start, end);
  });
}

@interactor class Day {
  title = attribute('title');
  date = attribute('data-test-date');
  click = clickable();
  ariaLabel = attribute('aria-label');
  isMuted = hasClass(`.${css.dayLabel}`, css.muted);
  isSelected = hasClass(`.${css.dayLabel}`, css.selected);
  isCursor = hasClass(css.cursor);
  isToday = hasClass(`.${css.dayLabel}`, css.today);
  isExcluded = hasClass(`.${css.dayLabel}`, css.excluded);
  isFocused = is(':focus');
  tabindex = attribute('tabindex');

  get disabled() {
    return this.ariaLabel.includes('unavailable');
  }

  pressUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 38,
    key: 'ArrowUp'
  });

  pressDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 40,
    key: 'ArrowDown'
  });

  pressLeft = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 37,
    key: 'ArrowLeft'
  });

  pressRight = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 39,
    key: 'ArrowRight'
  });

  pressPageUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 33,
    key: 'PageUp'
  });

  pressPageDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 34,
    key: 'PageDown'
  });

  altPageUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 33,
    altKey: true,
    key: 'PageUp'
  });

  altPageDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 34,
    altKey: true,
    key: 'PageDown'
  });

  pressEnter = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
    key: 'Enter'
  });

  pressEscape = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 27,
    key: 'Escape'
  });

  pressTab = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 9,
    key: 'Tab'
  });
}

@interactor class YearField {
  setYear = fillable();
  value = value();
  focus = focusable();
  isFocused = is(':focus');
  pressTab = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 9,
    key: 'Tab'
  });
}

@interactor class MonthField {
  selectMonth = selectOption();
  value = value();
  focus = focusable();
  isFocused = is(':focus');
  get valueString() {
    return months[this.value];
  }

  pressEscape = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 27,
    key: 'Escape'
  });

  pressTab = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 9,
    key: 'Tab'
  });
}

export const Calendar = interactor(class Calendar {
  days = collection('td[role="button"][data-day]', Day);
  monthField = scoped('[data-test-month-select]', MonthField);
  yearField = scoped('[data-test-year-input]', YearField);
  previousMonth = clickable('[data-test-calendar-previous-month]');
  nextMonth = clickable('[data-test-calendar-next-month]');
  previousYear = clickable('[data-test-calendar-previous-year]');
  nextYear = clickable('[data-test-calendar-next-year]');

  focusCalendarDay = focusable('td[role="button"][data-day][tabindex="0"]');

  get text() {
    return this.days().map(day => {
      if (day.isMuted) {
        return `_${day.text}_`;
      } else {
        return day.text;
      }
    });
  }

  get excludedDates() {
    return this.days().filter(day => day.isExcluded).map(day => day.date);
  }

  get selected() {
    return this.days().find(day => day.isSelected);
  }

  get cursor() {
    return this.days().find(day => day.tabindex === '0');
  }

  get header() {
    return `${months[this.monthField.value]} ${this.yearField.value}`;
  }

  pressEscape = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 27,
    key: 'Escape'
  });
});

export default interactor(class DatepickerInteractor {
  calendar = scoped('[data-test-calendar]', Calendar);
  id = attribute('input', 'id');
  input = scoped('[data-test-datepicker-container]', TextFieldInteractor);
  inputValue = value('input');
  fillInput = fillable('input');
  focusInput = focusable('input');
  blurInput = blurrable('input');
  clickInput = clickable('input');
  clearButton = scoped('[data-test-clear]');
  calendarButton = scoped('[data-test-calendar-button]');
  disabled = property('input', 'disabled')
  labelText = text('label');
  required = property('input', 'required');
  placeholder = attribute('input', 'placeholder');
  inputSelectionStart = property('input', 'selectionStart');
  inputSelectionRange = selectable('input');

  openCalendar = clickable('[data-test-calendar-button]');

  focusCalendar() {
    return this
      .openCalendar()
      .calendar.cursor.focusable();
  }

  pressEnter = triggerable('td[role="button"][data-day][tabindex="0"]', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
    key: 'Enter'
  });

  pressTab = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 9,
    key: 'Tab'
  });

  pressEscape = triggerable('td[role="button"][data-day][tabindex="0"]', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 27,
    key: 'Escape'
  });

  press1 = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 1,
    key: '1'
  });

  fillAndBlur(date) {
    return this
      .focusInput()
      .fillInput(date)
      .blurInput();
  }
});
