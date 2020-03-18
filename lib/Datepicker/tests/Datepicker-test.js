import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
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
      expect(datepicker.calendar.isVisible).to.be.false;
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
        expect(datepicker.calendar.isVisible).to.be.false;
      });

      it('did not call onChange', () => {
        expect(onChange.mock.calls.length).to.be.equal(0);
      });

      it('did not call onBlur', () => {
        expect(onBlur.mock.calls.length).to.be.equal(0);
      });
    });
  });

  describe('press enter opens the calendar', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker />);

      await datepicker.pressEnter();
    });

    it('is opened the calendar', () => {
      expect(datepicker.calendar.isVisible).to.be.true;
    });
  });

  describe('clicking on calendar button', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker />);

      await datepicker.calendarButton.click();
    });

    it('opened the calendar', () => {
      expect(datepicker.calendar.isVisible).to.be.true;
    });
  });

  describe('the calendar picker', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <Datepicker />
          <div id="anywhere-else" />
        </div>
      );
    });

    it('is closed', () => {
      expect(datepicker.calendar.isVisible).to.be.false;
    });

    describe('focus', () => {
      beforeEach(async () => datepicker.focusInput());

      it('opens on focus', () => {
        expect(datepicker.calendar.isVisible).to.be.true;
      });

      describe('clicking outside of calendar', () => {
        beforeEach(() => document.getElementById('anywhere-else').click());
        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isVisible).to.be.false;
        });
      });

      describe('pressing escape while calendar open', () => {
        beforeEach(async () => datepicker.pressTab());
        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isVisible).to.be.false;
        });
      });

      describe('shifting the focus onBlur', () => {
        beforeEach(async () => {
          await datepicker.fillAndBlur('04/01/2018');
        });

        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isVisible).to.be.false;
        });
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
