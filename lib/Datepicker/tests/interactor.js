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
  text
} from '@bigtest/interactor';

@interactor class Day {
  state = attribute('data-test-calendar-day');

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

  get cursored() {
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
  pressEnter = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });
  placeholder = attribute('input', 'placeholder');

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }
});
