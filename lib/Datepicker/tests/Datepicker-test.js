import React from 'react';
import { describe, beforeEach, afterEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import mock from 'jest-mock';
import { Interactor } from '@bigtest/interactor';

import { mountWithContext, focusPrevious, focusNext } from '../../../tests/helpers';

import Datepicker, { getMomentLocalizedFormat } from '../Datepicker';
import DatepickerAppHarness from './DatepickerAppHarness';
import DatepickerInteractor, { Calendar } from './interactor';

describe('Datepicker', () => {
  const datepicker = new DatepickerInteractor();

  describe('render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );
    });

    it('does not have a value in the input', () => {
      expect(datepicker.inputValue).to.equal('');
    });

    it('has a placeholder in the input', () => {
      expect(datepicker.placeholder).to.equal('MM/DD/YYYY');
    });
  });

  describe('exclude functionality', () => {
    let changed;
    beforeEach(async () => {
      changed = false;
      await mountWithContext(
        <Datepicker exclude={() => true} onChange={() => { changed = true; }} />
      );
      await datepicker.calendarButton.click();
    });

    it('renders all days excluded', () => {
      expect(datepicker.calendar.days().some((d) => !d.isExcluded)).to.be.false;
    });

    describe('key-handling on excluded (lack of)', () => {
      beforeEach(async () => {
        await datepicker.calendar.days(8).pressEnter();
      });

      it('date should not be changed', () => {
        expect(changed).to.be.false;
      });
    });
  });

  describe('usePortal functionality', () => {
    const datepickerOverlayInteractor = new Interactor('#OverlayContainer');
    const calendar = new Calendar();
    beforeEach(async () => {
      await mountWithContext(
        <DatepickerAppHarness lateValue="04/01/2019" usePortal />
      );
      await datepicker.calendarButton.click();
    });

    it('renders the datepicker to the "#OverlayContainer" div', () => {
      expect(datepickerOverlayInteractor.$root.children.length).to.be.gt(0);
    });

    describe('clicking wihin the picker doesn\'t close it', () => {
      beforeEach(async () => {
        await calendar.monthField.click();
      });

      it('doesn\'t close the datepicker when monthfield clicked', () => {
        expect(datepickerOverlayInteractor.$root.children.length).to.be.gt(0);
      });
    });

    describe('pressing escape closes the picker', () => {
      beforeEach(async () => {
        await calendar.monthField.pressEscape();
      });

      it('closes the picker', () => {
        expect(datepickerOverlayInteractor.$root.children.length).to.equal(0);
      });
    });

    describe('closing via root-close click', () => {
      beforeEach(async () => {
        await datepickerOverlayInteractor.$root.click();
      });

      it('closes the picker', () => {
        expect(datepickerOverlayInteractor.$root.children.length).to.equal(0);
      });
    });
  });

  describe('incomplete value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker value="12/" dateFormat="YYYY-MM-DD" />
      );
      await datepicker.calendarButton.click();
    });

    it('calendar date falls back to today\'s date', () => {
      expect(datepicker.calendar.cursor.isToday).to.be.true;
    });
  });

  describe('focus trapping', () => {
    beforeEach(async () => {
      await mountWithContext(
        <>
          <button type="button" id="firstButton">first</button>
          <Datepicker />
          <button type="button" id="lastButton">last</button>
        </>
      );

      await datepicker.openCalendar();
    });

    describe('focusing back off the first item', () => {
      beforeEach(async () => {
        await datepicker.calendar.monthField.pressTab();
        await focusPrevious(document.activeElement);
      });

      it('shifts focus to calendar', () => {
        expect(datepicker.calendar.cursor.isFocused).to.be.true;
      });

      describe('focusing back off the first item', () => {
        beforeEach(async () => {
          await datepicker.calendar.monthField.pressTab();
          await focusNext(document.activeElement);
        });

        it('shifts focus to monthField', () => {
          expect(datepicker.calendar.monthField.isFocused).to.be.true;
        });
      });
    });
  });

  describe('value set after initial render', () => {
    const datepickerAppInteractor = new Interactor();
    beforeEach(async () => {
      await mountWithContext(
        <DatepickerAppHarness lateValue="04/01/2019" />
      );
    });

    it('does not have a value in the input', () => {
      expect(datepicker.inputValue).to.equal('');
    });

    describe('applying late value', () => {
      beforeEach(async () => {
        await datepickerAppInteractor.click('button#applylatevalue');
      });

      it('displays the late-applied value', () => {
        expect(datepicker.inputValue).to.equal('04/01/2019');
      });
    });
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker id="datepicker-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(datepicker.id).to.equal('datepicker-test');
    });
  });

  describe('label', () => {
    beforeEach(async () => mountWithContext(
      <Datepicker
        label="Pick a date"
      />
    ));

    it('shows the label', () => {
      expect(datepicker.labelText).to.equal('Pick a date');
    });
  });

  describe('readOnly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker readOnly />
      );

      await datepicker.focusInput();
    });

    it('is not disabled', () => {
      expect(datepicker.disabled).to.be.false;
    });

    it('it did not open the calendar', () => {
      expect(datepicker.calendar.isPresent).to.be.false;
    });
  });

  describe('entering a date with the input', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
      );

      await datepicker.fillAndBlur('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('setting a date with the calendar', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );

      await datepicker.calendarButton.click();
      await datepicker.calendar.days(7).click();
    });

    it('sets a date in the field', () => {
      expect(datepicker.inputValue).to.not.equal('');
    });
  });

  describe('when backendDateStandard is YYYY-MM-DD and using native change', () => {
    let selectedDay;

    beforeEach(async () => {
      await mountWithContext(
        <Datepicker
          backendDateStandard="YYYY-MM-DD"
          timeZone="Europe/Kiev"
        />
      );

      await datepicker.calendarButton.click();

      // format from MM/DD/YYYY to YYYY-MM-DD
      const selectedDayParts = datepicker.calendar.days(4).date.split('/');
      selectedDay = `${selectedDayParts[2]}-${selectedDayParts[0]}-${selectedDayParts[1]}`;

      await datepicker.calendar.days(4).click();
    });

    it('sets a correct date in the hidden input', () => {
      expect(datepicker.hiddenInputValue).to.equal(selectedDay);
    });
  });

  describe('selecting a date with locale prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          locale="de"
        />
      );

      await datepicker.fillInput('01.04.2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('01.04.2018');
    });
  });

  describe('selecting a date with timeZone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          timeZone="America/Los_Angeles"
        />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('selecting a date with stripes.timezone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          stripes={{ timezone: 'America/Los_Angeles' }}
        />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('considering timeZone prop when provided a UTC value', () => {
    let onChange;

    beforeEach(async () => {
      onChange = mock.fn();
      await mountWithContext(
        <Datepicker
          onChange={onChange}
          timeZone="Europe/Kiev"
          value="2019-03-14T22:00:00.000+0000"
        />
      );
    });

    it('displays date localized to provided timezone.', () => {
      expect(datepicker.inputValue).to.equal('03/15/2019');
    });
  });

  describe('disabled prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker disabled />
      );
    });

    it('does not display the calendar button', () => {
      expect(datepicker.calendarButton.isPresent).to.be.false;
    });

    it('has disabled input', () => {
      expect(datepicker.disabled).to.be.true;
    });
  });

  describe('Month controls', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker value="2008-04-17T00:00:00.000+0000" />);

      await datepicker.calendarButton.click();
    });

    describe('changing the month field', () => {
      beforeEach(async () => {
        await datepicker.calendar.monthField.selectMonth('December');
      });

      it('updates the month in the calendar', () => {
        expect(datepicker.calendar.days(7).date).contains('12');
      });
    });
  });

  describe('Year controls', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker value="2008-04-17T00:00:00.000+0000" />);

      await datepicker.calendarButton.click();
    });

    describe('changing the year field', () => {
      beforeEach(async () => {
        await datepicker.calendar.yearField.setYear('2012');
      });

      it('updates the month in the calendar', () => {
        expect(datepicker.calendar.days(7).date).contains('2012');
      });
    });
  });

  describe('calendar widget', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker value="2008-04-17T00:00:00.000+0000" />);

      await datepicker.calendarButton.click();
    });

    afterEach(() => document.body.click());

    it('opened the calendar', () => {
      expect(datepicker.calendar.isPresent).to.be.true;
    });

    it('correct month selected in calendar', () => {
      expect(datepicker.calendar.monthField.valueString).to.equal('April');
    });

    it('correct year selected in calendar', () => {
      expect(datepicker.calendar.yearField.value).to.equal('2008');
    });

    describe('advancing the month', () => {
      beforeEach(async () => {
        await datepicker.calendar.nextMonth();
      });

      it('advances the month select', () => {
        expect(datepicker.calendar.monthField.valueString).to.equal('May');
      });

      describe('previous month', () => {
        beforeEach(async () => {
          await datepicker.calendar.previousMonth();
        });

        it('decrements the month select', () => {
          expect(datepicker.calendar.monthField.valueString).to.equal('April');
        });
      });
    });

    describe('advancing the year', () => {
      beforeEach(async () => {
        await datepicker.calendar.nextYear();
      });

      it('advances the month select', () => {
        expect(datepicker.calendar.yearField.value).to.equal('2009');
      });

      describe('previous year', () => {
        beforeEach(async () => {
          await datepicker.calendar.previousYear();
        });

        it('decrements the year control', () => {
          expect(datepicker.calendar.yearField.value).to.equal('2008');
        });
      });
    });

    describe('clicking outside of calendar', () => {
      beforeEach(() => document.body.click());
      it('closes the calendar picker', () => {
        expect(datepicker.calendar.isPresent).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker label="Pick a date" required />
      );
    });

    it('adds required attribute to input field', () => {
      expect(datepicker.required).to.be.true;
    });
  });

  describe('get localized format - moment fallback', () => {
    let format;
    beforeEach(async () => {
      format = getMomentLocalizedFormat({ locale:'de' }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });
});
