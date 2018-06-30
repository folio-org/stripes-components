import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import DatepickerInteractor from './interactor';

describe('Datepicker', () => {
  const datepicker = new DatepickerInteractor();

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

  describe('the calendar picker', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <Datepicker />
        </div>
      );

      await datepicker.focusInput();
    });

    it('opens on focus', () => {
      expect(datepicker.calendar.isVisible).to.be.true;
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

  describe('coupled to redux form', () => {
    describe('selecting a date', () => {
      let dateOutput;

      beforeEach(async () => {
        dateOutput = '';

        await mountWithContext(
          <Datepicker
            input={{
              onChange: (value) => { dateOutput = value; },
            }}
          />
        );

        await datepicker.fillInput('04/01/2018');
      });

      it('returns an ISO 8601 datetime string at UTC', () => {
        expect(dateOutput).to.equal('2018-04-01T00:00:00.000Z');
      });
    });

    describe('selecting a date with timeZone prop', () => {
      let dateOutput;

      beforeEach(async () => {
        dateOutput = '';

        await mountWithContext(
          <Datepicker
            input={{
              onChange: (value) => { dateOutput = value; },
            }}
            timeZone="America/Los_Angeles"
          />
        );

        await datepicker.fillInput('04/01/2018');
      });

      it('returns an ISO 8601 datetime string for specific time zone', () => {
        expect(dateOutput).to.equal('2018-04-01T07:00:00.000Z');
      });
    });
  });
});
