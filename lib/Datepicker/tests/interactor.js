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
  property
} from '@bigtest/interactor';

@interactor class Day {
  date = attribute('data-test-date');
  title = attribute('title');
  state = attribute('data-test-calendar-day');

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

  get isMuted() {
    return this.state.indexOf('isMuted') !== -1;
  }

  get isSelected() {
    return this.state.indexOf('isSelected') !== -1;
  }

  get isCursored() {
    return this.state.indexOf('isCursored') !== -1;
  }

  get isToday() {
    return this.state.indexOf('isToday') !== -1;
  }

  get isExcluded() {
    return this.state.indexOf('isExcluded') !== -1;
  }
}

@interactor class Calendar {
  days = collection('[data-test-calendar-day]', Day);
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
    return this.days().find(day => day.isCursored);
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

  pressEnter = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });

  placeholder = property('input', 'placeholder');

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }
});
