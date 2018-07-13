import {
  attribute,
  blurrable,
  clickable,
  fillable,
  focusable,
  interactor,
  triggerable,
  value,
  collection,
  text,
  scoped,
  property,
  hasClass
} from '@bigtest/interactor';

import css from '../Calendar.css';

@interactor class Day {
  title = attribute('title');
  date = attribute('data-test-date');

  isMuted = hasClass(css.muted);
  isSelected = hasClass(css.selected);
  isCursor = hasClass(css.cursor);
  isToday = hasClass(css.today);
  isExcluded = hasClass(css.excluded);

  pressUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 38
  });

  pressDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 40
  });

  pressLeft = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 37
  });

  pressRight = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 39
  });

  pressPageUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 33
  });

  pressPageDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 34
  });

  altPageUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 33,
    altKey: true
  });

  altPageDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 34,
    altKey: true
  });
}

@interactor class Calendar {
  days = collection(`.${css.dayButton}`, Day);
  header = text('[data-test-calendar-header]');
  previousMonth = clickable('[data-test-calendar-previous-month]');
  nextMonth = clickable('[data-test-calendar-next-month]');
  previousYear = clickable('[data-test-calendar-previous-year]');
  nextYear = clickable('[data-test-calendar-next-year]');

  get text() {
    return this.days().map(day => {
      if (day.isMuted) {
        return `_${day.text}_`;
      } else {
        return day.text;
      }
    });
  }

  get selected() {
    return this.days().find(day => day.isSelected);
  }

  get cursor() {
    return this.days().find(day => day.isCursor);
  }
}

export default interactor(class DatepickerInteractor {
  calendar = new Calendar('[data-test-calendar]');
  id = attribute('input', 'id');
  inputValue = value('input');
  fillInput = fillable('input');
  focusInput = focusable('input');
  blurInput = blurrable('input');
  clickInput = clickable('input');
  clearButton = scoped('[data-test-clear]');
  disabled = property('input', 'disabled')
  labelText = text('label');
  required = property('input', 'required');
  placeholder = attribute('input', 'placeholder');

  pressEnter = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });

  press1 = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 1
  });

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }
});
