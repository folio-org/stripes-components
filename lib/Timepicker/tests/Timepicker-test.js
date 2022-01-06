import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import moment from 'moment-timezone';

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

    describe('selecting a time with timeZone prop', () => {
      let timeOutput;
      const tz = 'America/Los_Angeles';

      beforeEach(async () => {
        timeOutput = '';

        await mountWithContext(
          <Timepicker
            input={{
              onChange: (value) => { timeOutput = value; },
            }}
            timeZone={tz}
          />
        );

        await timepicker.fillInput('05:00 PM');
      });

      it('returns an ISO 8601 time string for specific time zone', () => {
        expect(timeOutput).to.equal(moment().tz(tz).isDST() ? '00:00:00.000Z' : '01:00:00.000Z');
      });
    });
  });

  describe('when clicking the timepicker input', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <Timepicker
            id="timepicker-dropdown-test"
          />
          <div id="anywhere-else" />
        </div>
      );

      await timepicker.input.click();
    });

    it('should show the timepicker dropdown', () => {
      expect(timepicker.dropdown.isPresent).to.be.true;
    });

    describe('when filling out the hour/minute inputs and clicking the confirm button', () => {
      const initialHours = 11;
      const initialMinutes = 30;

      beforeEach(async () => {
        // Manually filling out the hours and minutes inputs
        await timepicker.dropdown.hoursInput.fill(initialHours);
        await timepicker.dropdown.minutesInput.fill(initialMinutes);
      });

      describe('clicking the increment minutes and hours buttons', () => {
        beforeEach(async () => {
          await timepicker.dropdown.incrementMinutesButton.clickIconButton();
          await timepicker.dropdown.incrementHoursButton.clickIconButton();
        });

        it('should increment the minutes input value', () => {
          expect(timepicker.dropdown.minutesInput.value).to.equal(`${initialMinutes + 1}`);
        });

        it('should increment the hours input value', () => {
          expect(timepicker.dropdown.hoursInput.value).to.equal(`${initialHours + 1}`);
        });
      });

      describe('clicking the decrement minutes and hours buttons', () => {
        beforeEach(async () => {
          await timepicker.dropdown.decrementMinutesButton.click();
          await timepicker.dropdown.decrementHoursButton.click();
        });

        it('should decrement the minutes input value', () => {
          expect(timepicker.dropdown.minutesInput.value).to.equal(`${initialMinutes - 1}`);
        });

        it('should decrement the hours input value', () => {
          expect(timepicker.dropdown.hoursInput.value).to.equal(`${initialHours - 1}`);
        });
      });

      describe('clicking outside the dropdown', () => {
        beforeEach(() => document.getElementById('anywhere-else').click());

        it('should close the timepicker dropdown', () => {
          expect(timepicker.dropdown.isPresent).to.be.false;
        });
      });

      describe('clicking the confirm button', () => {
        beforeEach(async () => {
          await timepicker.dropdown.confirmButton.click();
        });

        it('should close the timepicker dropdown', () => {
          expect(timepicker.dropdown.isPresent).to.be.false;
        });

        it('should update the timepicker input with the selected values', () => {
          expect(timepicker.inputValue).to.include(`${initialHours}:${initialMinutes}`);
        });
      });
    });
  });
});
