import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import moment from 'moment-timezone';
import {
  runAxeTest,
  HTML,
  TextField,
  IconButton,
  Button,
  including,
  converge
} from '@folio/stripes-testing';

import translationsDE from '../../../translations/stripes-components/de';

import { mountWithContext } from '../../../tests/helpers';

import Timepicker from '../Timepicker';

const TimepickerDropdownInteractor = HTML.extend('time dropdown')
  .selector('[data-test-timepicker-dropdown]')
  .filters({
    periodToggle: Button({ id: including('period-toggle') }).exists(),
    hour: (el) => {
      const node = el.querySelector('input[data-test-timepicker-dropdown-hours-input]');
      return node.value ? parseInt(node.value, 10) : '';
    },
    minute: (el) => {
      const node = el.querySelector('input[data-test-timepicker-dropdown-minutes-input]');
      return node.value ? parseInt(node.value, 10) : '';
    }
  })
  .actions({
    clickPeriodToggle: ({ find }) => find(Button({ id: including('period-toggle') })).click(),
    fillHour: ({ find }, value) => find(TextField({ id: including('hour-input') }))
      .perform((el) => {
        const node = el.querySelector('input');
        const property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(node), 'value');
        property.set.call(node, value);
        node.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', bubbles: true, cancelable: false }));
      }),
    fillMinute: ({ find }, value) => find(TextField({ id: including('minute-input') }))
      .perform((el) => {
        const node = el.querySelector('input');
        const property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(node), 'value');
        property.set.call(node, value);
        node.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', bubbles: true, cancelable: false }));
      }),
    clickConfirm: ({ find }) => find(Button({ id: including('set-time') })).click(),
    clickAddMinute: ({ find }) => find(IconButton({ id: including('next-minute') })).click(),
    clickAddHour: ({ find }) => find(IconButton({ id: including('next-hour') })).click(),
    clickDecrementMinute: ({ find }) => find(IconButton({ id: including('prev-minute') })).click(),
    clickDecrementHour: ({ find }) => find(IconButton({ id: including('prev-hour') })).click(),
  });

const TimepickerInteractor = TextField.extend('timepicker')
  .actions({
    clickDropdownToggle: ({ find }) => find(IconButton({ icon: 'clock' })).click(),
    clickInput: ({ perform }) => perform((el) => el.querySelector('input').click())
  });

describe.only('Timepicker', () => {
  const timepicker = TimepickerInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Timepicker id="timepicker-test" />
    );
  });

  it('contains no axe errors - Timepicker', runAxeTest);

  it('does not have a value in the input', () => timepicker.has({ value: '' }));

  it('has an id on the input element', () => timepicker.has({ id: 'timepicker-test' }));

  describe('selecting a time', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker onChange={(event) => { timeOutput = event?.target.value; }} />
      );

      await timepicker.fillIn('05:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => converge(() => timeOutput === '05:00 PM'));

    describe('removing a value', () => {
      beforeEach(async () => {
        await timepicker.fillIn('');
      });

      it('emits an event with the time formatted as displayed', () => converge(() => timeOutput === ''));
    });
  });

  describe('selecting a time with non-english locale', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker
          onChange={(event) => { timeOutput = event?.target.value; }}
        />,
        [{ prefix: 'stripes-components', translations: translationsDE }],
        'de'
      );

      await timepicker.fillIn('05:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => converge(() => (timeOutput === '05:00 PM')));
  });

  describe('selecting a time with timeZone prop', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker
          onChange={(event) => { timeOutput = event?.target.value; }}
          timeZone="America/Los_Angeles"
        />
      );

      await timepicker.fillIn('05:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => converge(() => timeOutput === '05:00 PM'));
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

        await timepicker.fillIn('05:00 PM');
      });

      it('returns an ISO 8601 time string at UTC', () => converge(() => timeOutput === '17:00:00.000Z'));
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

        await timepicker.fillIn('05:00 PM');
      });

      it('returns an ISO 8601 time string for specific time zone', () => converge(() => (timeOutput === moment().tz(tz).isDST() ? '00:00:00.000Z' : '01:00:00.000Z')));
    });
  });

  describe('when opening the time dropdown', () => {
    const timeDropdown = TimepickerDropdownInteractor();
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <Timepicker
            id="timepicker-dropdown-test"
          />
          <div id="anywhere-else" />
        </div>
      );

      await timepicker.clickDropdownToggle();
    });

    it('contains no axe errors - Timepicker: open menu', runAxeTest);

    it('should show the timepicker dropdown', () => timeDropdown.exists());

    describe('when filling out the hour/minute inputs and clicking the confirm button', () => {
      const initialHours = 11;
      const initialMinutes = 30;

      beforeEach(async () => {
        // Manually filling out the hours and minutes inputs
        await timeDropdown.fillHour(initialHours);
        await timeDropdown.fillMinute(initialMinutes);
      });

      describe('clicking the increment minutes and hours buttons', () => {
        beforeEach(async () => {
          await timeDropdown.clickAddMinute();
          await timeDropdown.clickAddHour();
        });

        it('should increment the minutes input value', () => timeDropdown.has({ minute: initialMinutes + 1 }));

        it('should increment the hours input value', () => timeDropdown.has({ hour: initialHours + 1 }));
      });

      describe('clicking the decrement minutes and hours buttons', () => {
        beforeEach(async () => {
          await timeDropdown.clickDecrementMinute();
          await timeDropdown.clickDecrementHour();
        });

        it('should decrement the minutes input value', () => () => timeDropdown.has({ minute: initialMinutes - 1 }));

        it('should decrement the hours input value', () => () => timeDropdown.has({ hour: initialHours - 1 }));
      });

      describe('clicking outside the dropdown', () => {
        beforeEach(() => document.getElementById('anywhere-else').click());

        it('should close the timepicker dropdown', () => timeDropdown.absent());
      });

      describe('clicking the confirm button', () => {
        beforeEach(async () => {
          await timeDropdown.clickConfirm();
        });

        it('should close the timepicker dropdown', () => timeDropdown.absent());

        it('should update the timepicker input with the selected values', () => TimepickerInteractor({ value: including(`${initialHours}:${initialMinutes}`) }));
      });
    });
  });
});
