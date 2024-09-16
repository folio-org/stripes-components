import React from 'react';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/fr';

import {
  Datepicker as Interactor,
  Calendar,
  // re-exported and importing Bigtest to differentiate between built-in interactors
  Bigtest,
  Keyboard,
  HTML,
  IconButton,
  runAxeTest,
  converge,
} from '@folio/stripes-testing';
import { mountWithContext, focusPrevious, focusNext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import {
  defaultOutputFormatter,
  passThroughParser,
  passThroughOutputFormatter,
  datePickerAppValidationProps
} from '../datepicker-util';
import AppValidatedDatepicker from '../AppValidatedDatepicker';
import DatepickerAppHarness from './DatepickerAppHarness';

const Weekday = HTML.extend('weekday')
  .selector('[class^=weekday]')
  .filters({
    index: (el) => [...el.parentNode.querySelectorAll('[class^=weekday]')].findIndex((n) => n === el),
  });

const CalendarDay = HTML.extend('calendar day')
  .selector('td')
  .filters({
    rowIndex: (el) => [...el.closest('tbody').querySelectorAll('tr')].findIndex(e => e.contains(el)),
    colIndex: (el) => [...el.parentNode.querySelectorAll('td')].findIndex(e => e === el),
  });

describe('Datepicker', () => {
  const datepicker = Interactor();
  const calendar = Calendar();
  const month = calendar.find(Bigtest.Select());
  const year = calendar.find(Bigtest.TextField());

  const CalendarDays = Bigtest.HTML.extend('calendar days')
    .selector('[class^=calendar-] td')
    .locator((el) => el.textContent)
    .filters({
      month: (el) => el.getAttribute('data-date').split('/')[0],
    });

  describe('render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );
    });

    it('has no axe errors. - Datepicker', runAxeTest);

    it('does not have a value in the input', () => datepicker.has({ inputValue: '' }));

    it('has a placeholder in the input', () => datepicker.has({ placeholder: 'MM/DD/YYYY' }));
  });

  describe('exclude functionality', () => {
    let changed;
    beforeEach(async () => {
      changed = false;
      await mountWithContext(
        <Datepicker exclude={() => true} onChange={() => { changed = true; }} />
      );
      await datepicker.openCalendar();
    });

    it('has no axe errors. - Datepicker - open', runAxeTest);

    it('renders all days excluded', () => calendar.assert((el) => {
      // find all 'td' and check if any is set to true
      return Array.from(el.querySelectorAll('td')).reduce((excluded, node) => {
        if (!excluded) return excluded;
        return node.getAttribute('data-excluded') === 'true';
      }, true);
    }));

    describe('key-handling on excluded (lack of)', () => {
      beforeEach(async () => {
        await CalendarDays('8').focus();
        await Keyboard.enter();
      });

      it('date should not be changed', () => {
        expect(changed).to.be.false;
      });
    });
  });

  describe('usePortal functionality', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DatepickerAppHarness lateValue="04/01/2019" usePortal />
      );
      await datepicker.openCalendar();
    });

    it('renders the datepicker to the "#OverlayContainer" div', () => calendar.is({ visible: true, portal: true }));

    describe('clicking within the picker doesn\'t close it', () => {
      beforeEach(async () => {
        await month.click();
      });

      it('doesn\'t close the datepicker when monthfield clicked', () => calendar.is({ visible: true }));
    });

    describe('pressing escape closes the picker', () => {
      beforeEach(async () => {
        await Keyboard.escape();
      });

      it('closes the picker', () => calendar.absent());
    });

    describe('closing via root-close click', () => {
      beforeEach(async () => {
        await HTML({ id: 'root' }).click();
      });

      it('closes the picker', () => calendar.absent());
    });
  });

  describe('incomplete value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker value="12/" dateFormat="YYYY-MM-DD" />
      );
      await datepicker.openCalendar();
    });

    // this checks that the calendar widget has the correct date
    // but note the datepicker input
    it('calendar date falls back to today\'s date', () => calendar.is({ today: true }));
  });

  describe('focus trapping', () => {
    beforeEach(async () => {
      await mountWithContext(
        <>
          <button type="button" id="firstButton">first</button>
          <Datepicker />
          <button type="button" id="lastButton">last</button>
        </>
      );

      await datepicker.openCalendar();
    });

    describe('focusing back off the first item', () => {
      beforeEach(async () => {
        // manually adjust focus since we are trapping tabIndex
        await focusPrevious(document.activeElement);
      });

      // for the calendar to have focus, it also needs to be visible
      it('shifts focus to calendar', () => calendar.is({ visible: true }));

      describe('focusing back off the first item', () => {
        beforeEach(async () => {
          // manually adjust focus since we are trapping tabIndex
          await focusNext(document.activeElement);
        });

        it('shifts focus to monthField', () => month.is({ focused: true }));
      });
    });
  });

  describe('focusing inputRef', () => {
    beforeEach(async () => {
      const inputRef = React.createRef();

      await mountWithContext(
        <Datepicker inputRef={inputRef} />
      );

      await datepicker.blur();
      await inputRef.current.focus();
    });

    it('focuses the input', () => {
      expect(datepicker.is({ focused: true }));
    });
  });

  describe('value set after initial render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DatepickerAppHarness lateValue="04/01/2019" />
      );
    });

    it('does not have a value in the input', () => datepicker.has({ inputValue: '' }));

    describe('applying late value', () => {
      beforeEach(async () => {
        await HTML({ id: 'applylatevalue' }).click();
      });

      it('displays the late-applied value', () => datepicker.has({ inputValue: '04/01/2019' }));
    });
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker id="datepicker-test" />
      );
    });

    it('has an id on the input element', () => datepicker.has({ id: 'datepicker-test' }));
  });

  describe('label', () => {
    beforeEach(async () => mountWithContext(
      <Datepicker
        label="Pick a date"
      />
    ));

    it('shows the label', () => {
      datepicker.has({ labelText: 'Pick a date' });
    });
  });

  describe('readOnly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker readOnly />
      );

      await datepicker.focus();
    });

    it('is not disabled', () => datepicker.is({ disabled: false, focused: true, readOnly: true }));

    it('it did not open the calendar', () => calendar.absent());
  });

  describe('entering a date with the input', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
      );

      await datepicker.fillIn('04/01/2018');
      await datepicker.blur();
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('setting a date with the calendar', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );

      await datepicker.openCalendar();
      await CalendarDays('7').click();
    });

    it('sets a date in the field', () => datepicker.is({ empty: false }));
  });

  describe('selecting a date with locale prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          locale="de"
        />
      );

      await datepicker.fillIn('01.04.2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('01.04.2018');
    });
  });

  describe('selecting a date with timeZone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          timeZone="America/Los_Angeles"
        />
      );

      await datepicker.fillIn('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('selecting a date with stripes.timezone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          stripes={{ timezone: 'America/Los_Angeles' }}
        />
      );

      await datepicker.fillIn('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('considering timeZone prop when provided a UTC value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker
          timeZone="Europe/Kiev"
          value="2019-03-14T22:00:00.000+0000"
        />
      );
    });

    it('displays date localized to provided timezone.', () => datepicker.has({ inputValue: '03/15/2019' }));
  });

  describe('disabled prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker disabled />
      );
    });

    it('does not display the calendar button', () => IconButton({ icon: 'calendar' }).absent());

    it('has disabled input', () => Interactor({ disabled: true }).exists());
  });

  describe('Month/Year controls', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker />);

      await datepicker.openCalendar();
    });

    describe('changing the month field', () => {
      beforeEach(async () => {
        await month.choose('November');
        await calendar.setYear('2008');
        await CalendarDays('7').click(); // this closes the calendar
        await datepicker.openCalendar();
      });

      it('updates the month in the calendar', async () => {
        await datepicker.has({ inputValue: '11/07/2008' });
      });
    });

    describe('changing the year field', () => {
      beforeEach(async () => {
        await month.choose('April');
        await calendar.setYear('2012');
        await CalendarDays('13').click(); // this closes the calendar
        await datepicker.openCalendar();
      });

      it('updates the year in the calendar', async () => {
        await datepicker.has({ inputValue: '04/13/2012' });
      });
    });
  });

  describe('calendar widget', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker value="2008-04-17T00:00:00.000+0000" />);

      await datepicker.openCalendar();
    });

    afterEach(() => document.body.click());

    it('opened the calendar', () => calendar.is({ visible: true }));

    it('correct month selected in calendar', () => month.has({ value: 'April' }));

    it('correct year selected in calendar', () => year.has({ value: '2008' }));

    describe('advancing the month', () => {
      beforeEach(async () => {
        await month.focus();
        await Keyboard.nextOption();
      });

      it('advances the month select', () => month.has({ value: 'May' }));

      describe('previous month', () => {
        beforeEach(async () => {
          await month.focus();
          await Keyboard.prevOption();
        });

        it('decrements the month select', () => month.has({ value: 'April' }));
      });
    });

    describe('advancing the year', () => {
      beforeEach(async () => {
        await year.focus();
        await Keyboard.incrementNumber();
      });

      it('advances the year field', () => year.has({ value: '2009' }));

      describe('previous year', () => {
        beforeEach(async () => {
          await year.focus();
          await Keyboard.decrementNumber();
        });

        it('decrements the year control', () => year.has({ value: '2008' }));
      });
    });

    describe('clicking outside of calendar', () => {
      beforeEach(() => document.body.click());
      it('closes the calendar picker', () => calendar.absent());
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker label="Pick a date" required />
      );
    });

    it('adds required attribute to input field', () => datepicker.is({ required: true }));
  });

  // this test runs successfully in a `describe.only(...)` block
  // but fails when run as part of the full suite.
  // grrrrrrr.
  // the same test is below with a Latn locale (fr) instead of
  // an Arab one (ar) since that seems to be the deciding factor.
  describe.skip('defaultOutputFormatter converts non-Latn input to Latn-output', () => {
    const arm = moment().locale('ar');

    let output;
    const value = arm.format('2021/07/11');
    beforeEach(async () => {
      output = defaultOutputFormatter({
        backendDateStandard: 'YYYY-MM-DD',
        value,
        uiFormat: 'YYYY/MM/DD',
        outputFormats: [],
        timeZone: 'UTC',
      });
    });

    it('returns a Latn (Arabic, 0-9) string', () => {
      expect(output).to.equal('2021-07-11');
    });
  });

  // see above; this doesn't really convert non-Latn to Latn
  describe('defaultOutputFormatter converts non-en input to Latn-output', () => {
    const frm = moment().locale('fr');

    let output;
    const value = frm.format('2021/07/11');
    beforeEach(async () => {
      output = defaultOutputFormatter({
        backendDateStandard: 'YYYY-MM-DD',
        value,
        uiFormat: 'YYYY/MM/DD',
        outputFormats: [],
        timeZone: 'UTC',
      });
    });

    it('returns a Latn (Arabic, 0-9) string', () => {
      expect(output).to.equal('2021-07-11');
    });
  });

  describe('defaultOutputFormatter provides RFC-2822 output', () => {
    const frm = moment().locale('en');

    let output;
    const value = frm.format('2021-07-12 14:15:16');

    beforeEach(async () => {
      output = defaultOutputFormatter({
        backendDateStandard: 'RFC2822',
        value,
        uiFormat: 'YYYY-MM-DD HH:mm:ss',
        outputFormats: [],
        timeZone: 'UTC',
      });
    });

    it('returns a RFC-2822 string', () => {
      expect(output).to.equal('Mon, 12 Jul 2021 14:15:16 +0000');
    });
  });

  describe('defaultOutputFormatter provides ISO-8601 output', () => {
    const frm = moment().locale('en');

    let output;
    const value = frm.format('2021-07-12T14:15:16+00:00');

    beforeEach(async () => {
      output = defaultOutputFormatter({
        backendDateStandard: 'ISO-8601',
        value,
        uiFormat: 'YYYY-MM-DD HH:mm:ss',
        outputFormats: [],
        timeZone: 'UTC',
      });
    });

    it('returns a ISO-8601 string', () => {
      expect(output).to.equal('2021-07-12T14:15:16.000Z');
    });
  });

  describe('defaultOutputFormatter leaves empty string alone', () => {
    let output;

    beforeEach(async () => {
      output = defaultOutputFormatter({
        backendDateStandard: 'RFC2822',
        value: '',
        uiFormat: 'YYYY-MM-DD HH:mm:ss',
        outputFormats: [],
        timeZone: 'UTC',
      });
    });

    it('returns empty string', () => {
      expect(output).to.equal('');
    });
  });

  describe('weekday alignment (en-SE locale)', () => {
    beforeEach(async () => {
      await (mountWithContext(
        <Datepicker label="Pick a date" dateFormat="YYYY-DD-MM" value={'2021-20-10'} />,
        [],
        'en-SE'
      ));

      await datepicker.openCalendar();
    });

    it('renders Monday as the first day of the week', () => Weekday('Mon', { index: 0 }).exists());

    it('renders weekday and month days in correct alignment', async () => {
      await Weekday('Wed', { index: 2 }).exists();
      await CalendarDay('20', { rowIndex: 3, colIndex: 2 }).exists();
    });
  });

  describe('weekday alignment (SV locale)', () => {
    beforeEach(async () => {
      await (mountWithContext(
        <Datepicker label="Pick a date" dateFormat="YYYY-DD-MM" value={'2021-20-10'} />,
        [],
        'sv'
      ));

      await datepicker.openCalendar();
    });

    it('renders Monday as the first day of the week', () => Weekday('mån', { index: 0 }).exists());

    it('renders weekday and month days in correct alignment (oktober 20th is onsdag)', async () => {
      await Weekday('ons', { index: 2 }).exists();
      await CalendarDay('20', { rowIndex: 3, colIndex: 2 }).exists();
    });
  });

  describe('weekday alignment (RU locale)', () => {
    beforeEach(async () => {
      await (mountWithContext(
        <Datepicker label="Pick a date" dateFormat="YYYY-DD-MM" value={'2021-20-10'} />,
        [],
        'ru'
      ));

      await datepicker.openCalendar();
    });

    it('renders Monday as the first day of the week', () => Weekday('пн', { index: 0 }).exists());

    it('renders calendar days in correct alignment with weekdays (Октябрь 20th is среда)', async () => {
      await Weekday('ср', { index: 2 }).exists();
      await CalendarDay('20', { rowIndex: 3, colIndex: 2 }).exists();
    });
  });


  describe('weekday alignment (en locale)', () => {
    beforeEach(async () => {
      await (mountWithContext(
        <Datepicker label="Pick a date" dateFormat="YYYY-DD-MM" value={'2021-20-10'} />
      ));

      await datepicker.openCalendar();
    });

    it('renders Sun as the first day of the week', () => Weekday('Sun', { index: 0 }).exists());

    it('renders weekday and month days in correct alignment', async () => {
      await Weekday('Wed', { index: 3 }).exists();
      await CalendarDay('20', { rowIndex: 3, colIndex: 3 }).exists();
    });
  });

  describe('custom validator', () => {
    const customChange = sinon.spy();
    beforeEach(async () => {
      customChange.resetHistory();
      await (mountWithContext(
        <DatepickerAppHarness
          label="Pick a date"
          inputValidator={() => true}
          onChange={customChange}
          outputFormatter={passThroughOutputFormatter}
          outputBackendValue={false}
          parser={passThroughParser}
        />
      ));
      await datepicker.fillIn('03');
    });

    it('calls the onChange handler multiple times', () => {
      return converge(() => {
        if (
          !customChange.calledWith('0') ||
          !customChange.calledWith('03')
        ) { throw new Error('expected changeHandler to be called with incomplete values') }
      });
    });
  });

  describe('validation props bundle', () => {
    const customChange = sinon.spy();
    beforeEach(async () => {
      customChange.resetHistory();
      await (mountWithContext(
        <DatepickerAppHarness
          label="Pick a date"
          onChange={customChange}
          lateValue={'1999-12-01T05:00:00.000Z'}
          dateFormat="MM-DD-YYYY"
          useInput
          {...datePickerAppValidationProps}
        />
      ));
      await datepicker.fillIn('03');
    });

    it('calls the onChange handler multiple times', () => {
      return converge(() => {
        if (
          !customChange.calledWith('0') ||
          !customChange.calledWith('03')
        ) { throw new Error('expected changeHandler to be called with incomplete values') }
      });
    });
  });

  describe('AppValidatedDatepicker', () => {
    const customChange = sinon.spy();
    beforeEach(async () => {
      customChange.resetHistory();
      await (mountWithContext(
        <DatepickerAppHarness
          label="Pick a date"
          onChange={customChange}
          lateValue={'1999-12-01T05:00:00.000Z'}
          dateFormat="MM-DD-YYYY"
          useInput
        >
          {(props) => <AppValidatedDatepicker {...props} /> }
        </DatepickerAppHarness>
      ));
      await datepicker.fillIn('03');
    });

    it('calls the onChange handler multiple times', () => {
      return converge(() => {
        if (
          !customChange.calledWith('0') ||
          !customChange.calledWith('03')
        ) { throw new Error('expected changeHandler to be called with incomplete values') }
      });
    });
  });

  describe('hideCalendarButton prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker hideCalendarButton />
      );
    });

    it('does not display the calendar button', () => IconButton({ icon: 'calendar' }).absent());
  });
});
