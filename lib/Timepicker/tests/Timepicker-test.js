import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Timepicker from '../Timepicker';
import { LocaleContext } from '../../Locale';
import { TimeZoneContext } from '../../TimeZone';
import TimepickerInteractor from './interactor';

describe('Timepicker', () => {
  let timepicker = new TimepickerInteractor();

  beforeEach(async () => {
    await mount(
      <Timepicker />
    );
  });

  it('does not have a value in the input', () => {
    expect(timepicker.inputValue).to.equal('');
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mount(
        <Timepicker id="timepicker-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(timepicker.id).to.equal('timepicker-test');
    });
  });

  describe('with a locale context', () => {
    describe('selecting a time', () => {
      let timeOutput;

      beforeEach(async () => {
        timeOutput = '';

        await mount(
          <LocaleContext.Provider value="de">
            <Timepicker onChange={(event) => { timeOutput = event.target.value; }} />
          </LocaleContext.Provider>
        );

        await timepicker.fillInput('05:00 PM');
      });

      it('emits an event with the time formatted as displayed', () => {
        expect(timeOutput).to.equal('05:00 PM');
      });
    });
  });

  describe('with a locale prop', () => {
    describe('selecting a time', () => {
      let timeOutput;

      beforeEach(async () => {
        timeOutput = '';

        await mount(
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
  });

  describe('without a parent time zone context', () => {
    describe('selecting a time', () => {
      let timeOutput;

      beforeEach(async () => {
        timeOutput = '';

        await mount(
          <Timepicker onChange={(event) => { timeOutput = event.target.value; }} />
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

        await mount(
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

          await mount(
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

        beforeEach(async () => {
          timeOutput = '';

          await mount(
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
  });

  describe('inside a time zone context', () => {
    describe('selecting a time', () => {
      let timeOutput;

      beforeEach(async () => {
        timeOutput = '';

        await mount(
          <TimeZoneContext.Provider value="Australia/Sydney">
            <Timepicker onChange={(event) => { timeOutput = event.target.value; }} />
          </TimeZoneContext.Provider>
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

        await mount(
          <TimeZoneContext.Provider value="Australia/Sydney">
            <Timepicker
              onChange={(event) => { timeOutput = event.target.value; }}
              timeZone="America/Los_Angeles"
            />
          </TimeZoneContext.Provider>
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

          await mount(
            <TimeZoneContext.Provider value="Australia/Sydney">
              <Timepicker
                input={{
                  onChange: (value) => { timeOutput = value; },
                }}
              />
            </TimeZoneContext.Provider>
          );

          await timepicker.fillInput('05:00 PM');
        });

        it('returns an ISO 8601 time string at the context time zone', () => {
          expect(timeOutput).to.equal('07:00:00.000Z');
        });
      });

      describe('selecting a time with timeZone prop', () => {
        let timeOutput;

        beforeEach(async () => {
          timeOutput = '';

          await mount(
            <TimeZoneContext.Provider value="Australia/Sydney">
              <Timepicker
                input={{
                  onChange: (value) => { timeOutput = value; },
                }}
                timeZone="America/Los_Angeles"
              />
            </TimeZoneContext.Provider>
          );

          await timepicker.fillInput('05:00 PM');
        });

        it('returns an ISO 8601 time string at the prop time zone, overriding the context', () => {
          expect(timeOutput).to.equal('00:00:00.000Z');
        });
      });
    });
  });
});
