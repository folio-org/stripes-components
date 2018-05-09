import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import { LocaleContext } from '../../Locale';
import { TimeZoneContext } from '../../TimeZone';
import DatepickerInteractor from './interactor';

describe('Datepicker', () => {
  let datepicker = new DatepickerInteractor();

  beforeEach(async () => {
    await mount(
      <Datepicker />
    );
  });

  it('does not have a value in the input', () => {
    expect(datepicker.inputValue).to.equal('');
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mount(
        <Datepicker id="datepicker-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(datepicker.id).to.equal('datepicker-test');
    });
  });

  describe('with a locale context', () => {
    describe('selecting a date', () => {
      let dateOutput;

      beforeEach(async () => {
        dateOutput = '';

        await mount(
          <LocaleContext.Provider value="de">
            <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
          </LocaleContext.Provider>
        );

        await datepicker.fillInput('04/01/2018');
      });

      it('emits an event with the date formatted as displayed', () => {
        expect(dateOutput).to.equal('04/01/2018');
      });
    });
  });

  describe('with a locale prop', () => {
    describe('selecting a date', () => {
      let dateOutput;

      beforeEach(async () => {
        dateOutput = '';

        await mount(
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
  });

  describe('without a parent time zone context', () => {
    describe('selecting a date', () => {
      let dateOutput;

      beforeEach(async () => {
        dateOutput = '';

        await mount(
          <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
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

        await mount(
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

    describe('coupled to redux form', () => {
      describe('selecting a date', () => {
        let dateOutput;

        beforeEach(async () => {
          dateOutput = '';

          await mount(
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

          await mount(
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

  describe('inside a time zone context', () => {
    describe('selecting a date', () => {
      let dateOutput;

      beforeEach(async () => {
        dateOutput = '';

        await mount(
          <TimeZoneContext.Provider value="Australia/Sydney">
            <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
          </TimeZoneContext.Provider>
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

        await mount(
          <TimeZoneContext.Provider value="Australia/Sydney">
            <Datepicker
              onChange={(event) => { dateOutput = event.target.value; }}
              timeZone="America/Los_Angeles"
            />
          </TimeZoneContext.Provider>
        );

        await datepicker.fillInput('04/01/2018');
      });

      it('emits an event with the date formatted as displayed', () => {
        expect(dateOutput).to.equal('04/01/2018');
      });
    });

    describe('coupled to redux form', () => {
      describe('selecting a date', () => {
        let dateOutput;

        beforeEach(async () => {
          dateOutput = '';

          await mount(
            <TimeZoneContext.Provider value="Australia/Sydney">
              <Datepicker
                input={{
                  onChange: (value) => { dateOutput = value; },
                }}
              />
            </TimeZoneContext.Provider>
          );

          await datepicker.fillInput('04/01/2018');
        });

        it('returns an ISO 8601 datetime string at the context time zone', () => {
          expect(dateOutput).to.equal('2018-03-31T13:00:00.000Z');
        });
      });

      describe('selecting a date with timeZone prop', () => {
        let dateOutput;

        beforeEach(async () => {
          dateOutput = '';

          await mount(
            <TimeZoneContext.Provider value="Australia/Sydney">
              <Datepicker
                input={{
                  onChange: (value) => { dateOutput = value; },
                }}
                timeZone="America/Los_Angeles"
              />
            </TimeZoneContext.Provider>
          );

          await datepicker.fillInput('04/01/2018');
        });

        it('returns an ISO 8601 datetime string at the prop time zone, overriding the context', () => {
          expect(dateOutput).to.equal('2018-04-01T07:00:00.000Z');
        });
      });
    });
  });
});
