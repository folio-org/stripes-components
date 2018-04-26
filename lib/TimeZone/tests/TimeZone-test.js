import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  interactor,
  text,
} from '@bigtest/interaction';

import { mount } from '../../../tests/helpers';

import withTimeZone, { TimeZoneContext } from '../../TimeZone';

describe('TimeZone', () => {
  let TimeZoneComponent = ({ timeZone }) => (
    <div data-test-time-zone>{timeZone}</div>
  );

  let TimeZoneComponentInteractor = interactor(class TimeZoneComponentInteractor {
    timeZone = text();
  });
  let testComponent = new TimeZoneComponentInteractor('[data-test-time-zone]');

  let WrappedTimeZoneComponent = withTimeZone(TimeZoneComponent);

  describe('without parent context', () => {
    describe('without a timeZone prop', () => {
      beforeEach(async () => {
        await mount(<WrappedTimeZoneComponent />);
      });

      it('passes the default timeZone', () => {
        expect(testComponent.timeZone).to.equal('UTC');
      });
    });

    describe('with a timeZone prop', () => {
      beforeEach(async () => {
        await mount(<WrappedTimeZoneComponent timeZone="America/Los_Angeles" />);
      });

      it('uses the prop passed in', () => {
        expect(testComponent.timeZone).to.equal('America/Los_Angeles');
      });
    });
  });

  describe('with parent context', () => {
    describe('without a timeZone prop', () => {
      beforeEach(async () => {
        await mount(
          <TimeZoneContext.Provider value="Australia/Sydney">
            <WrappedTimeZoneComponent />
          </TimeZoneContext.Provider>
        );
      });

      it('passes the timeZone from the context', () => {
        expect(testComponent.timeZone).to.equal('Australia/Sydney');
      });
    });

    describe('with a timeZone prop', () => {
      beforeEach(async () => {
        await mount(
          <TimeZoneContext.Provider value="Australia/Sydney">
            <WrappedTimeZoneComponent timeZone="America/Los_Angeles" />
          </TimeZoneContext.Provider>
        );
      });

      it('overrides the context with the prop', () => {
        expect(testComponent.timeZone).to.equal('America/Los_Angeles');
      });
    });
  });
});
