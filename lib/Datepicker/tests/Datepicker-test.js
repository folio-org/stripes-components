import React from 'react';
import { describe, beforeEach, afterEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import mock from 'jest-mock';
import { Interactor } from '@bigtest/interactor';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import DatepickerAppHarness from './DatepickerAppHarness';
import DatepickerInteractor from './interactor';

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

  describe('selecting a date', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
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
    let onChange;
    let onBlur;

    beforeEach(async () => {
      onChange = mock.fn();
      onBlur = mock.fn();

      await mountWithContext(
        <Datepicker
          disabled
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    });

    it('shows value in the input field', () => {
      expect(datepicker.inputValue).to.be.equal('');
    });

    it('has disabled input', () => {
      expect(datepicker.disabled).to.be.true;
    });

    describe('choosing a date from calendar', () => {
      beforeEach(async () => datepicker.clickInput().focusInput());
      it('did not open the calendar', () => {
        expect(datepicker.calendar.isPresent).to.be.false;
      });

      it('did not call onChange', () => {
        expect(onChange.mock.calls.length).to.be.equal(0);
      });

      it('did not call onBlur', () => {
        expect(onBlur.mock.calls.length).to.be.equal(0);
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
});
