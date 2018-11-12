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
});
