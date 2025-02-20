import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localeData from 'dayjs/plugin/localeData';
import timeZone from 'dayjs/plugin/timezone';

import {
  runAxeTest,
  Button,
  Select,
  including,
  converge,
  Keyboard,
  HTML
} from '@folio/stripes-testing';

import translationsDE from '../../../translations/stripes-components/de';

import { mountWithContext } from '../../../tests/helpers';
import Timepicker, { convertTo24hr } from '../Timepicker';
import TimepickerHarness from './TimepickerHarness';
import {
  Timepicker as TimepickerInteractor,
  TimeDropdown as TimepickerDropdownInteractor
} from './timepicker-interactor-bt';

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timeZone);

// check for DST with respect to the timezone of the tests since different zones can observe DST differently.
const isDST = function (tz = 'UTC') {
  const julDate = '2022-07-20';
  const janDate = '2022-01-01';

  const julOffset = dayjs(julDate).tz(tz).utcOffset();
  const janOffset = dayjs(janDate).tz(tz).utcOffset();
  const currentOffset = dayjs().tz(tz).utcOffset();
  // console.log(`TZ: ${tz} Current: ${currentOffset} Jan: ${janOffset} Jul: ${julOffset}`);
  // If they're the same, we can assume the zone doesn't observe DST... always false.
  if (janOffset === julOffset) return false;
  return Math.max(julOffset, janOffset) === currentOffset;
}

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

  describe('opening the dropdown with no time selected', () => {
    beforeEach(async () => {
      await timepicker.clickDropdownToggle();
    });

    it('displays the time dropdown', () => timeDropdown.exists());
    it('displays the current time in the time dropdown', () => timeDropdown.has({ hour: parseInt(dayjs().format('h'), 10), minute: parseInt(dayjs().format('mm'), 10) }));
  });

  describe('selecting a time', () => {
    let timeOutput;

    beforeEach(async () => {
      timeOutput = '';

      await mountWithContext(
        <Timepicker onChange={(event) => { timeOutput = event?.target.value; }} />
      );

      await timepicker.fillIn('5:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => converge(
      () => { if (timeOutput !== '5:00 PM') throw new Error(`timeOutput is "${timeOutput}", expected "05:00PM".`) }
    ));

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

      it('emits an event with the time formatted as displayed', () => converge(
        () => { if (timeOutput !== '') throw new Error(`timeOutput is "${timeOutput}", expected ""`); }
      ));
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

      await timepicker.fillIn('5:00 PM');
    });

    it('emits an event with the time formatted as displayed', () => converge(
      () => { if (timeOutput !== '5:00 PM') throw new Error(`timeOutput is "${timeOutput}", expected "5:00 PM"`); }
    ));

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
    const expectedTime = dayjs.utc(testTime, 'HH:mm:ss.sssZ').format('H:mm A');
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
    const expectedTime = dayjs.utc(initialTime, 'HH:mm:ss.sssZ').format('H:mm A');
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

  describe('selecting a time with timeZone prop (Los Angeles) (RFF)', () => {
    const tz = 'America/Los_Angeles';
    const testTime = isDST('America/Los_Angeles') ? '00:00:00.000Z' : '01:00:00.000Z';
    let timeOutput = '';
    beforeEach(async () => {
      timeOutput = '';
      await mountWithContext(
        <TimepickerHarness
          input={{
            onChange: (e) => { timeOutput = e.target.value; }
          }}
          timeZone={tz}
        />
      );

      await timepicker.fillIn('5:00 P');
    });

    it('emits an event with the time accounting for timezone', () => HTML({ id: 'state-time', text: testTime }).exists());
    it('displays full time in field', () => timepicker.has({ value: '5:00 PM' }));
    it('calls onChange with appropriate time', () => converge(
      () => { if (timeOutput !== testTime) throw new Error(`timeOutput is "${timeOutput}", expected "${testTime}"`); }
    ));
  });

  describe('selecting a time with timeZone prop (Barbados) (RFF)', () => {
    const tz = 'America/Barbados';
    // Barbados doesn't observe DST, so no `isDST()` needed for this tz!
    const testTime = '20:20:00.000Z';
    let timeOutput;
    beforeEach(async () => {
      timeOutput = '';
      await mountWithContext(
        <TimepickerHarness
          input={{
            onChange: (e) => { timeOutput = e.target.value; }
          }}
          timeZone={tz}
        />
      );

      await timepicker.fillIn('4:20 P');
    });

    it('emits an event with the time accounting for timezone', () => HTML({ id: 'state-time', text: testTime }).exists());
    it('displays full time in field', () => timepicker.has({ value: '4:20 PM' }));
    it('calls onChange with appropriate time', () => converge(
      () => { if (timeOutput !== testTime) throw new Error(`timeOutput is "${timeOutput}", expected "${testTime}"`); }
    ));
  });

  describe('parsing a time with timeZone prop (Barbados) (RFF)', () => {
    const tz = 'America/Barbados';
    // Barbados doesn't observe DST, so no `isDST()` needed for this tz!
    const testTime = '16:20:00.000Z';
    const expectedTime = dayjs(testTime, 'HH:mm:ss.sssZ').tz(tz).format('h:mm A');
    beforeEach(async () => {
      await mountWithContext(
        <TimepickerHarness
          initialValue={testTime}
          timeZone={tz}
        />
      );
    });

    it('displays expected time in the field', () => timepicker.has({ value: expectedTime }));
  });

  describe('parsing a time with timeZone prop (UTC) (RFF)', () => {
    const tz = 'UTC';
    const testTime = '15:20:00.000Z';
    const expectedTime = dayjs.tz(testTime, 'HH:mm:ss.sssZ', tz).format('h:mm A');
    beforeEach(async () => {
      await mountWithContext(
        <TimepickerHarness
          initialValue={testTime}
          timeZone={tz}
        />
      );
    });

    it('displays expected time in the field', () => timepicker.has({ value: expectedTime }));
  })

  describe('Timedropdown', () => {
    const initialTime = '10:00:00.000Z';
    const expectedTime = dayjs.utc(initialTime, 'HH:mm:ss.sssZ').format('H:mm A');
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
        const initialMinutes = 58;

        beforeEach(async () => {
          // Manually filling out the hours and minutes inputs
          await timeDropdown.fillHour(initialHours);
          await timeDropdown.fillMinute(initialMinutes);
        });

        describe('clicking the add hours button', () => {
          beforeEach(async () => {
            await timeDropdown.clickAddHour();
            await timeDropdown.clickAddHour();
          });

          it('should loop the value to the minimum hour value', () => timeDropdown.has({ hour: 1 }));
        });

        describe('clicking the add minute button', () => {
          beforeEach(async () => {
            await timeDropdown.clickAddMinute();
            await timeDropdown.clickAddMinute();
          });

          it('should loop the value to the maximum minute value', () => timeDropdown.has({ minute: 0 }));
        });

        describe('12 hour support (internal conversion) - 12:01 PM', () => {
          beforeEach(async () => {
            await timeDropdown.fillHour('12');
            await timeDropdown.fillMinute('01');
            await Select().choose('PM');
            await timeDropdown.clickConfirm();
          });

          it('displays appropriate hour and minute values', () => timepicker.has({ value: '12:01 PM' }));
        });

        describe('12 hour support (internal conversion) - 12:01 AM', () => {
          beforeEach(async () => {
            await timeDropdown.fillHour('12');
            await timeDropdown.fillMinute('01');
            await Select().choose('AM');
            await timeDropdown.clickConfirm();
          });

          it('displays appropriate hour and minute values', () => timepicker.has({ value: '12:01 AM' }));
        });

        describe('12 hour support (internal conversion) - 1:01 AM', () => {
          beforeEach(async () => {
            await timeDropdown.fillHour('1');
            await timeDropdown.fillMinute('01');
            await Select().choose('AM');
            await timeDropdown.clickConfirm();
          });

          it('displays appropriate hour and minute values', () => timepicker.has({ value: '1:01 AM' }));
        });

        describe('12 hour support (internal conversion) - 11:01 PM', () => {
          beforeEach(async () => {
            await timeDropdown.fillHour('11');
            await timeDropdown.fillMinute('01');
            await Select().choose('PM');
            await timeDropdown.clickConfirm();
          });

          it('displays appropriate hour and minute values', () => timepicker.has({ value: '11:01 PM' }));
        });

        describe('spinning through the minimum hour minute values', () => {
          beforeEach(async () => {
            await timeDropdown.fillHour('1');
            await timeDropdown.fillMinute('00');
          });

          it('displays appropriate hour and minute values', () => timeDropdown.has({ minute: 0, hour: 1 }));

          describe('decrement hours and minutes below the minimum', () => {
            beforeEach(async () => {
              await timeDropdown.clickDecrementHour();
              await timeDropdown.clickDecrementMinute();
            });

            it('displays maximum hour and minute values', () => timeDropdown.has({ minute: 59, hour: 12 }));
          });
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

          it('should leave the original value in the timepicker', () => timepicker.has({ value: expectedTime }));
        });
      });
    });
  });

  describe('Timedropdown with 24 hour mode', () => {
    beforeEach(async () => {
      await mountWithContext((
        <div>
          <TimepickerHarness
            initialValue={'6:00:00.000Z'}
            id="timepicker-dropdown-test"
            autoFocus
          />
          <div id="anywhere-else" />
        </div>),
      [{ prefix: 'stripes-components', translations: translationsDE }],
      'de');

      await timepicker.fillIn('0:00');
      await timepicker.clickDropdownToggle();
    });

    it('should open the time dropdown', () => timeDropdown.exists());

    describe('entering a 0 into the hour field', () => {
      beforeEach(async () => {
        await timeDropdown.fillHour('00');
        await timeDropdown.fillMinute('00');
      })

      it('zeros out the time', () => timeDropdown.has({ hour: 0 }));

      describe('decrementing below the minimum', () => {
        beforeEach(async () => {
          await timeDropdown.clickDecrementHour();
        });

        it('should loop to the maximum hour value', () => timeDropdown.has({ hour: 23 }));
      });
    });
  });
});

describe('convert to 24h utility function', () => {
  it('converts 12 AM to 0', () => {
    expect(convertTo24hr('12', 'am', ['am', 'pm'])).to.equal(0);
  });

  it('leaves 1 AM as 1', () => {
    expect(convertTo24hr('1', 'am', ['am', 'pm'])).to.equal(1);
  });

  it('converts 12 PM to 12', () => {
    expect(convertTo24hr('12', 'pm', ['am', 'pm'])).to.equal(12);
  });

  it('converts 1 PM to 13', () => {
    expect(convertTo24hr('1', 'pm', ['am', 'pm'])).to.equal(13);
  });

  it('converts 11 PM to 23', () => {
    expect(convertTo24hr('11', 'pm', ['am', 'pm'])).to.equal(23);
  });

  it('leaves 11 AM as 11', () => {
    expect(convertTo24hr('11', 'am', ['am', 'pm'])).to.equal(11);
  });
});
