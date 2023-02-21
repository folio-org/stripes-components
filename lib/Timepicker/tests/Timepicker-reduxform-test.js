import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import {
  converge,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Timepicker from '../Timepicker';

import {
  Timepicker as TimepickerInteractor,
  TimeDropdown as TimepickerDropdownInteractor
} from './timepicker-interactor-bt';

describe('Timepicker with redux form', () => {
  const timepicker = TimepickerInteractor({ id: 'test-time' });
  const timedropdown = TimepickerDropdownInteractor();
  describe('selecting a time', () => {
    let timeOutput;
    const handleChange = sinon.spy((e) => {
      timeOutput = e.target.value;
    });
    beforeEach(async () => {
      timeOutput = '';
      await handleChange.resetHistory();
      const input = {
        onChange: (e) => handleChange(e),
        onBlur: (e) => handleChange(e)
      }
      await mountWithContext(
        <Timepicker
          input={input}
          id="test-time"
        />
      );

      await timepicker.fillIn('5:00 PM');
    });

    it('returns an ISO 8601 time string at UTC', () => converge(() => timeOutput === '17:00:00.000Z'));
    it('calls the handler multiple times - on change and onBlur', () => converge(() => handleChange.calledTwice));

    describe('opening the dropdown', () => {
      beforeEach(async () => {
        await timepicker.clickDropdownToggle();
      });

      it('focuses the timeDropdown', () => timedropdown.has({ focused: true }));
      it('retains the correct value in the input', () => timepicker.has({ value: '5:00 PM' }));
    });
  });
});
