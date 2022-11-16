import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Field } from 'redux-form';
import {
  Datepicker as Interactor,
  Calendar,
  // re-exported and importing Bigtest to differeniate between built-in interactors
  Bigtest,
  Keyboard,
} from '@folio/stripes-testing';
import TestForm from '../../../tests/TestForm';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';

describe('Datepicker with Redux Form integration', () => {
  const datepicker = Interactor();
  const calendar = Calendar();
  const year = calendar.find(Bigtest.TextField());

  const CalendarDays = Bigtest.HTML.extend('calendar days')
    .selector('[class^=calendar-] td')
    .locator((el) => el.textContent)
    .filters({
      selected: (el) => !!el.querySelector('div').className.match(/selected-/),
      dateSelected: (el) => el.getAttribute('data-date'),
      disabled: (el) => el.querySelector('div').hasAttribute('data-excluded'),
      month: (el) => el.getAttribute('data-date').split('/')[0],
      year: (el) => el.getAttribute('data-date').split('/')[2],
    });

  describe('validation', () => {
    beforeEach(async () => {
      const required = value => { return value ? undefined : 'Required'; };
      await mountWithContext(
        <TestForm>
          <Field
            name="calendar"
            component={Datepicker}
            dateFormat="MM-DD-YYYY"
            required
            validate={[required]}
          />
        </TestForm>
      );

      await datepicker.fillIn('');
      await datepicker.blur();
    });

    it('displays a validation error', () => datepicker.has({ error: true }));
  });

  describe('value remains after blur', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="enrolleddate"
            component={Datepicker}
            dateFormat="MM-DD-YYYY"
          />
        </TestForm>
      );

      await datepicker.fillIn('02-10-2009');
      await datepicker.blur();
    });

    it('has a value', () => datepicker.has({ inputValue: '02-10-2009' }));
  });

  describe('onChange', () => {
    let onChange;

    beforeEach(async () => {
      onChange = sinon.spy();

      await mountWithContext(
        <TestForm>
          <Field
            name="calendar"
            component={Datepicker}
            onChange={onChange}
          />
        </TestForm>
      );

      await datepicker.fillIn('04/01/2018');
    });

    it('returns an ISO 8601 datetime string at UTC', () => {
      expect(onChange.getCall(0).args[1]).to.contains('2018-04-01T0');
    });

    describe('clearing the input', () => {
      beforeEach(async () => datepicker.fillIn(''));
      it('called onChange', () => {
        expect(onChange.callCount).to.equal(2);
      });
      it('sends empty value to onChange', () => {
        expect(onChange.getCall(1).args[1]).to.equal('');
      });
    });
  });

  describe('clear button', () => {
    let onChange;
    beforeEach(async () => {
      onChange = sinon.spy();
      await mountWithContext(
        <TestForm initialValues={{ calendar: '04/01/2018' }}>
          <Field
            name="calendar"
            component={Datepicker}
            onChange={onChange}
          />
        </TestForm>
      );

      await datepicker.clear();
    });
    it('makes input value empty', () => datepicker.has({ inputValue: '' }));
    it('called onChange with empty value', () => {
      expect(onChange.getCall(0).args[1]).to.equal('');
    });
  });

  describe('Calendar', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm initialValues={{ calendar: '04/01/2018' }}>
          <Field name="calendar" component={Datepicker} />
        </TestForm>
      );

      await datepicker.openCalendar();
    });

    it('has April 2018 in calendar header', () => calendar.has({ month: 'April', year: '2018' }));

    it('shows days from April 2018', () => calendar.has({ days: [
      '1', '2', '3', '4', '5', '6', '7',
      '8', '9', '10', '11', '12', '13', '14',
      '15', '16', '17', '18', '19', '20', '21',
      '22', '23', '24', '25', '26', '27', '28',
      '29', '30', '_1_', '_2_', '_3_', '_4_', '_5_'
    ] }));

    it('has April 1st as selected', () => CalendarDays('1', { month: '04' }).is({ selected: true }));

    describe('going to previous month', () => {
      beforeEach(() => Keyboard.prevOption());

      it('changed calendar header to March 2018', () => calendar.has({ month: 'March', year: '2018' }));

      it('shows days from March 2018', () => calendar.has({ days: [
        '_25_', '_26_', '_27_', '_28_', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17',
        '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '31'
      ] }));

      it('does not have a selected day', () => calendar.has({ day: '' }));
    });

    describe('going to next month', () => {
      beforeEach(() => Keyboard.nextOption());

      it('changed calendar header to May 2018', () => calendar.has({ month: 'May', year: '2018' }));

      it('shows days from May 2018', () => calendar.has({ days: [
        '_29_', '_30_', '1', '2', '3', '4', '5',
        '6', '7', '8', '9', '10', '11', '12',
        '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26',
        '27', '28', '29', '30', '31', '_1_', '_2_'
      ] }));

      it('does not have a selected day', () => calendar.has({ day: '' }));
    });

    describe('going to previous year', () => {
      beforeEach(async () => {
        await year.focus();
        await Keyboard.decrementNumber();
      });

      it('changed calendar header to April 2017', () => calendar.has({ month: 'April', year: '2017' }));

      it('shows days from April 2017', () => calendar.has({ days: [
        '_26_', '_27_', '_28_', '_29_', '_30_', '_31_', '1',
        '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22',
        '23', '24', '25', '26', '27', '28', '29',
        '30', '_1_', '_2_', '_3_', '_4_', '_5_', '_6_'
      ] }));

      it('does not have a selected day', () => calendar.has({ day: '' }));
    });

    describe('going to next year', () => {
      beforeEach(async () => {
        await year.focus();
        await Keyboard.incrementNumber();
      });

      it('changed calendar header to April 2019', () => calendar.has({ month: 'April', year: '2019' }));

      it('shows days from April 2019', () => calendar.has({ days: [
        '_31_', '1', '2', '3', '4', '5', '6',
        '7', '8', '9', '10', '11', '12', '13',
        '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27',
        '28', '29', '30', '_1_', '_2_', '_3_', '_4_'
      ] }));

      it('does not have a selected day', () => calendar.has({ day: '' }));
    });

    describe('navigating within the calendar control', () => {
      beforeEach(async () => {
        await CalendarDays('1', { month: '04' }).focus();
      });

      describe('press up', () => {
        beforeEach(async () => Keyboard.arrowUp());

        it('takes user to previous month', () => calendar.has({ month: 'March', year: '2018' }));

        it('changed cursor to March 25, 2018', () => CalendarDays('25', { month: '03', year: '2018' }).is({ focused: true }));
      });

      describe('press down', () => {
        beforeEach(async () => Keyboard.arrowDown());

        it('changed cursor to April 8, 2018', () => CalendarDays('8', { month: '04', year: '2018' }).is({ focused: true }));
      });

      describe('press left', () => {
        beforeEach(async () => Keyboard.arrowLeft());

        it('takes user to previous month', () => calendar.has({ month: 'March', year: '2018' }));

        it('changed cursor to March 31, 2018', () => CalendarDays('31', { month: '03', year: '2018' }).is({ focused: true }));
      });

      describe('press right', () => {
        beforeEach(async () => Keyboard.arrowRight());

        it('changed cursor to April 2, 2018', () => CalendarDays('2', { month: '04', year: '2018' }).is({ focused: true }));
      });
    });

    describe('press page up', () => {
      beforeEach(async () => {
        await CalendarDays('1', { month: '04' }).focus();
        await Keyboard.pageUp();
      });

      it('takes user to previous month', () => calendar.has({ month: 'March', year: '2018' }));

      it('changed cursor to March 1, 2018', () => CalendarDays('1', { month: '03', year: '2018' }).is({ focused: true }));
    });

    describe('press page down', () => {
      beforeEach(async () => {
        await CalendarDays('1', { month: '04' }).focus();
        await Keyboard.pageDown();
      });

      it('takes user to next month', () => calendar.has({ month: 'May', year: '2018' }));

      it('changed cursor to May 1, 2018', () => CalendarDays('1', { month: '05' }).is({ focused: true }));
    });

    describe('press alt + page up', () => {
      beforeEach(async () => {
        await CalendarDays('1', { month: '04' }).focus();
        await Keyboard.pageUp({ altKey: true });
      });

      it('takes user to previous year', () => calendar.has({ month: 'April', year: '2017' }));

      it('changed cursor to April 1, 2017', () => CalendarDays('1', { month: '04', year: '2017' }).is({ focused: true }));
    });

    describe('press alt + page down', () => {
      beforeEach(async () => {
        await CalendarDays('1', { month: '04' }).focus();
        await Keyboard.pageDown({ altKey: true });
      });

      it('takes user to next year', () => calendar.has({ month: 'April', year: '2019' }));

      it('changed cursor to April 1, 2019', () => CalendarDays('1', { month: '04', year: '2019' }).is({ focused: true }));
    });

    describe('press escape to close', () => {
      beforeEach(async () => Keyboard.escape());

      it('closes the calendar', () => calendar.absent());
    });
  });

  describe('dateFormat prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm initialValues={{ calendar: '2018-18-04' }}>
          <Field
            name="calendar"
            dateFormat="YYYY-DD-MM"
            component={Datepicker}
          />
        </TestForm>
      );
    });

    it('placeholder is YYYY-DD-MM', () => datepicker.has({ placeholder: 'YYYY-DD-MM' }));

    describe('day selected in calendar', () => {
      beforeEach(async () => datepicker.openCalendar());

      it('has April 18 2018 selected', () => CalendarDays('18').has({ selected: true, dateSelected: '2018-18-04' }));
    });

    describe('fill in a new date', () => {
      beforeEach(async () => {
        await datepicker.fillIn('2016-10-02');
        await datepicker.openCalendar();
      });

      it('has February 10, 2016 selected', () => CalendarDays('10').has({ selected: true, dateSelected: '2016-10-02' }));
    });
  });

  describe('selecting a date with timeZone prop', () => {
    let onChange;

    beforeEach(async () => {
      onChange = sinon.spy();
      await mountWithContext(
        <TestForm>
          <Field
            name="calendar"
            component={Datepicker}
            onChange={onChange}
            timeZone="America/Los_Angeles"

          />
        </TestForm>
      );

      await datepicker.fillIn('04/01/2018');
    });

    it('renders the value correctly in the input', () => datepicker.has({ inputValue: '04/01/2018' }));
    it('returns an ISO 8601 datetime string for specific time zone', () => {
      expect(onChange.getCall(0).args[1]).to.contain('2018-04-01');
    });
  });

  describe('considering timeZone prop when provided a UTC value', () => {
    let onChange;

    beforeEach(async () => {
      onChange = sinon.spy();
      await mountWithContext(
        <TestForm initialValues={{ calendar: '2019-03-14T22:00:00.000+0000' }}>
          <Field
            name="calendar"
            component={Datepicker}
            onChange={onChange}
            timeZone="Europe/Kiev"
          />
        </TestForm>
      );
    });

    it('displays date localized to provided timezone.', () => datepicker.has({ inputValue: '03/15/2019' }));
  });

  describe('backendDateStandard prop', () => {
    describe('RFC2822', () => {
      let onChange;

      beforeEach(async () => {
        onChange = sinon.spy();

        await mountWithContext(
          <TestForm>
            <Field
              name="calendar"
              backendDateStandard="RFC2822"
              component={Datepicker}
              onChange={onChange}
              timeZone="America/Los_Angeles"

            />
          </TestForm>
        );

        await datepicker.fillIn('04/01/2018');
      });

      it('returns an RFC2822 datetime string for specific time zone', () => {
        expect(onChange.getCall(0).args[1]).to.contain('Sun, 01 Apr 2018');
      });
    });

    describe('arbitrary format', () => {
      let onChange;

      beforeEach(async () => {
        onChange = sinon.spy();

        await mountWithContext(
          <TestForm>
            <Field
              name="calendar"
              backendDateStandard="YYYY"
              component={Datepicker}
              onChange={onChange}
              timeZone="America/Los_Angeles"
            />
          </TestForm>
        );

        await datepicker.fillIn('04/01/2018');
      });

      it('returns an RFC2822 datetime string for specific time zone', () => {
        expect(onChange.getCall(0).args[1]).to.equal('2018');
      });
    });
  });

  describe('exclude prop', () => {
    describe('by default no day is excluded', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm initialValues={{ calendar: '04/01/2018' }}>
            <Field
              name="calendar"
              component={Datepicker}
            />
          </TestForm>
        );

        await datepicker.openCalendar();
      });

      it('has no excluded days', () => calendar.has({ excludedDays: [] }));
    });

    describe('multiple dates', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm initialValues={{ calendar: '04/05/2018' }}>
            <Field
              name="calendar"
              component={Datepicker}
              exclude={date => ['04/01/2018', '04/03/2018'].includes(date.format('MM/DD/YYYY'))}
            />
          </TestForm>
        );

        await datepicker.openCalendar();
      });

      it('excludes multiple dates', () => calendar.has({ excludedDays:['1', '3'] }));

      it('makes excluded days disabled', async () => {
        await CalendarDays('1', { month: '04' }).is({ disabled: true });
        await CalendarDays('3', { month: '04' }).is({ disabled: true });
      });
    });

    describe('selecting excluded date', () => {
      let onChange;

      beforeEach(async () => {
        onChange = sinon.spy();

        await mountWithContext(
          <TestForm initialValues={{ calendar: '04/03/2018' }}>
            <Field
              name="calendar"
              component={Datepicker}
              onChange={onChange}
              exclude={date => date.format('MM/DD/YYYY') === '04/03/2018'}
            />
          </TestForm>
        );

        await datepicker.openCalendar();
      });

      describe('click to select', () => {
        beforeEach(() => CalendarDays('3', { month: '04' }).click());
        it('did not call onChange', () => {
          expect(onChange.notCalled).to.be.true;
        });
      });

      describe('pressing enter', () => {
        beforeEach(async () => {
          await CalendarDays('3', { month: '04' }).focus();
          await Keyboard.enter();
        });
        it('did not call onChange', () => {
          expect(onChange.notCalled).to.be.true;
        });
      });

      describe.skip('navigation on excluded date', () => {
        beforeEach(async () => datepicker.calendar.cursor.pressLeft());
        it('changed cursor to April 2, 2018', () => {
          expect(datepicker.calendar.cursor.date).to.equal('04/02/2018');
        });
      });
    });
  });
});
