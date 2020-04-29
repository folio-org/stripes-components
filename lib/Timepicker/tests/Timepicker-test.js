import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Timepicker from '../Timepicker';
import TimepickerInteractor from './interactor';

describe('Timepicker', () => {
  const timepicker = new TimepickerInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Timepicker />
    );
  });

  it('does not have a value in the input', () => {
    expect(timepicker.inputValue).to.equal('');
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Timepicker id="timepicker-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(timepicker.id).to.equal('timepicker-test');
    });
  });

  describe('selecting a time', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker onChange={(event) => { timeOutput = event.target.value; }} />
      );

      await timepicker.fillInput('05:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => {
      expect(timeOutput).to.equal('05:00 PM');
    });
  });

  describe('selecting a time with locale prop', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker
          onChange={(event) => { timeOutput = event.target.value; }}
          locale="de"
        />
      );

      await timepicker.fillInput('05:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => {
      expect(timeOutput).to.equal('05:00 PM');
    });
  });

  describe('selecting a time with timeZone prop', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker
          onChange={(event) => { timeOutput = event.target.value; }}
          timeZone="America/Los_Angeles"
        />
      );

      await timepicker.fillInput('05:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => {
      expect(timeOutput).to.equal('05:00 PM');
    });
  });

  describe('coupled to redux form', () => {
    describe('selecting a time', () => {
      let timeOutput;

      beforeEach(async () => {
        timeOutput = '';

        await mountWithContext(
          <Timepicker
            input={{
              onChange: (value) => { timeOutput = value; },
            }}
          />
        );

        await timepicker.fillInput('05:00 PM');
      });

      it('returns an ISO 8601 time string at UTC', () => {
        expect(timeOutput).to.equal('17:00:00.000Z');
      });
    });

    // stopped working with daylight savings ending in US on 2018-11-04
    describe.skip('selecting a time with timeZone prop', () => {
      let timeOutput;

      beforeEach(async () => {
        timeOutput = '';

        await mountWithContext(
          <Timepicker
            input={{
              onChange: (value) => { timeOutput = value; },
            }}
            timeZone="America/Los_Angeles"
          />
        );

        await timepicker.fillInput('05:00 PM');
      });

      it('returns an ISO 8601 time string for specific time zone', () => {
        expect(timeOutput).to.equal('00:00:00.000Z');
      });
    });
  });

  describe('when clicking the timepicker input', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Timepicker
          id="timepicker-dropdown-test"
        />
      );

      await timepicker.input.click();
    });

    it('should show the timepicker dropdown', () => {
      expect(timepicker.dropdown.isPresent).to.be.true;
    });

    describe('when filling out the hour/minute inputs and clicking the confirm button', () => {
      beforeEach(async () => {
        await timepicker.dropdown.hoursInput.fill(12);
        await timepicker.dropdown.minutesInput.fill(30);
        await timepicker.dropdown.confirmButton.click();
      });

      it('should close the timepicker dropdown', () => {
        expect(timepicker.dropdown.isPresent).to.be.false;
      });

      it('should update the timepicker input with the selected values', () => {
        expect(timepicker.inputValue).to.include('12:30');
      });
    });
  });

  describe('when using the soon to be deprecated "tether"-prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Timepicker
          id="timepicker-tether-test"
          tether={{
            targetAttachment: 'bottom right',
          }}
        />
      );

      await timepicker.input.click();
    });

    it('should show the timepicker dropdown', () => {
      expect(timepicker.dropdown.isPresent).to.be.true;
    });
  });
});
