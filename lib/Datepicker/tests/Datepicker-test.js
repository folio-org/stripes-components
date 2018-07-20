import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import mock from 'jest-mock';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
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

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
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

  describe('passThroughValue', () => {
    let onBlur;
    let onChange;

    beforeEach(async () => {
      onBlur = mock.fn();
      onChange = mock.fn();

      await mountWithContext(
        <Datepicker
          passThroughValue="yesterday"
          input={{
            value: 'yesterday',
            onBlur,
            onChange
          }}
        />
      );
    });

    it('has yesterday is in input field', () => {
      expect(datepicker.inputValue).to.equal('yesterday');
    });

    describe.skip('blur the input field', () => {
      beforeEach(async () => datepicker.focusInput());

      it('does not have any day selected', () => {
        expect(datepicker.calendar.selected).to.be.undefined;
      });
    });

    describe.skip('clearing and typing in yesterday', () => {
      beforeEach(async () => {
        await datepicker.fillAndBlur('04/01/2018');
        await datepicker.fillAndBlur('yesterday');
      });

      it('called onBlur twice', () => {
        expect(onBlur.mock.calls.length).to.be.equal(2);
      });

      it('sends yesterday to onBlur', () => {
        expect(onBlur.mock.calls[1]).to.be.equal('yesterday');
      });

      it('called onChange twice', () => {
        expect(onChange.mock.calls.length).to.be.equal(2);
      });

      it('sends yesterday to onChange', () => {
        expect(onChange.mock.calls[1]).to.be.equal('yesterday');
      });
    });
  });

  describe('press enter opens the calendar', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker />);

      await datepicker.pressEnter();
    });

    it('is opened the calendar', () => {
      expect(datepicker.calendar.isPresent).to.be.true;
    });
  });

  describe('clicking on calendar button', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker />);

      await datepicker.calendarButton.click();
    });

    it('opened the calendar', () => {
      expect(datepicker.calendar.isPresent).to.be.true;
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
      expect(datepicker.calendar.isPresent).to.be.false;
    });

    describe('focus', () => {
      beforeEach(async () => datepicker.focusInput());

      it('opens on focus', () => {
        expect(datepicker.calendar.isVisible).to.be.true;
      });

      describe('clicking outside of calendar', () => {
        beforeEach(() => document.getElementById('anywhere-else').click());
        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isPresent).to.be.false;
        });
      });

      describe('pressing escape while calendar open', () => {
        beforeEach(async () => datepicker.pressTab());
        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isPresent).to.be.false;
        });
      });

      describe('shifting the focus onBlur', () => {
        beforeEach(async () => {
          await datepicker.fillAndBlur('04/01/2018');
        });

        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isPresent).to.be.false;
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
