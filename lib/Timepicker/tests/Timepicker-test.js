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
  converge,
  Keyboard,
} from '@folio/stripes-testing';

import translationsDE from '../../../translations/stripes-components/de';

import { mountWithContext } from '../../../tests/helpers';

import Timepicker from '../Timepicker';
import TimepickerHarness from './TimepickerHarness';

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
    clickInput: ({ perform }) => perform((el) => el.querySelector('input').click()),
    focusDropdownButton: ({ find }) => find(IconButton({ icon: 'clock' })).focus(),
    clickClear: ({ find }) => find(IconButton({ icon: 'times-circle-solid' })).click()
  });

describe('Timepicker', () => {
  const timepicker = TimepickerInteractor();
  const timeDropdown = TimepickerDropdownInteractor();

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

    describe('opening the time dropdown with a 12-hour value in the input', () => {
      beforeEach(async () => {
        await timepicker.clickDropdownToggle();
      });

      it('should show the timepicker dropdown', () => timeDropdown.exists());

      it('should populate the minute field with the correct values', () => () => timeDropdown.has({ minute: '00' }));

      it('should populate the hour field with the correct values', () => () => timeDropdown.has({ hour: 5 }));
    });

    describe('removing a value', () => {
      beforeEach(async () => {
        await timepicker.fillIn('');
      });

      it('emits an event with the time formatted as displayed', () => converge(() => timeOutput === ''));
    });

    describe('setting an incomplete value', () => {
      beforeEach(async () => {
        await timepicker.fillIn('2');
      });

      it('retains the value as entered', () => timepicker.has({ value: '2' }));
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

    describe('picking a time in a non-english locale', () => {
      beforeEach(async () => {
        await timepicker.clickDropdownToggle();
      });

      it('contains no axe errors - Timepicker: open menu', runAxeTest);

      it('should show the timepicker dropdown', () => timeDropdown.exists());

      describe('when filling out the hour/minute inputs and clicking the confirm button', () => {
        const initialHours = 14;
        const initialMinutes = 30;

        beforeEach(async () => {
          // Manually filling out the hours and minutes inputs
          await timeDropdown.fillHour(initialHours);
          await timeDropdown.fillMinute(initialMinutes);
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

  describe('parsing a value prop with a time offset (usually from backend)', () => {
    const testTime = '10:00:00.000Z';
    const expectedTime = moment.utc(testTime, 'HH:mm:ss.sssZ').local().format('H:mm A');
    beforeEach(async () => {
      await mountWithContext(
        <Timepicker
          id="timepicker-test"
          value={testTime}
        />
      );
    });

    it('displays parsed time in input', () => timepicker.has({ value: expectedTime }));
  });

  describe('Application level behavior', () => {
    const initialTime = '10:00:00.000Z';
    const expectedTime = moment.utc(initialTime, 'HH:mm:ss.sssZ').local().format('H:mm A');
    beforeEach(async () => {
      await mountWithContext(
        <TimepickerHarness
          id="timepicker-test"
          initialValue={initialTime}
        />
      );
    });

    it('displays parsed time in input', () => timepicker.has({ value: expectedTime }));

    describe('clearing the time', () => {
      beforeEach(async () => {
        await Button('clear time').click();
      });

      it('displays empty time value', () => timepicker.has({ value: '' }));
    });
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

  describe('Timedropdown', () => {
    const initialTime = '10:00:00.000Z';
    const expectedTime = moment.utc(initialTime, 'HH:mm:ss.sssZ').local().format('H:mm A');
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <TimepickerHarness
            initialValue={initialTime}
            id="timepicker-dropdown-test"
            autoFocus
          />
          <div id="anywhere-else" />
        </div>
      );

      await timepicker.focusDropdownButton();
    });

    it('time dropdown is hidden', () => timeDropdown.absent());

    describe('clearing the timepicker', () => {
      beforeEach(async () => {
        await timepicker.clickClear();
      });

      it('displays empty time value', () => timepicker.has({ value: '' }));
    });

    describe('opening the dropdown via arrow key', () => {
      beforeEach(async () => {
        await Keyboard.arrowDown();
      });

      it('should show the timepicker dropdown', () => timeDropdown.exists());
    });

    describe('opening the dropdown via dropdown toggle', () => {
      beforeEach(async () => {
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

        describe('pressing the enter key', () => {
          beforeEach(async () => {
            await Keyboard.enter();
          });

          it('should close the timepicker dropdown', () => timeDropdown.absent());

          it('should update the timepicker input with the selected values', () => timepicker.has({ value: including(`${initialHours}:${initialMinutes}`) }));
        });

        describe('clicking the confirm button', () => {
          beforeEach(async () => {
            await timeDropdown.clickConfirm();
          });

          it('should close the timepicker dropdown', () => timeDropdown.absent());

          it('should update the timepicker input with the selected values', () => timepicker.has({ value: including(`${initialHours}:${initialMinutes}`) }));
        });

        describe('pressing the escape key', () => {
          beforeEach(async () => {
            await Keyboard.escape();
          });

          it('should close the timepicker dropdown', () => timeDropdown.absent());

          it('should leave the orinal value in the timepicker', () => timepicker.has({ value: expectedTime }));
        });
      });
    });
  });
});
