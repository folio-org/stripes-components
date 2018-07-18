import React from 'react';
import propTypes from 'prop-types';
import { describe, beforeEach, afterEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import mock from 'jest-mock';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import DatepickerInteractor from './interactor';

const { assign } = Object;

class State extends React.PureComponent {
  static propTypes = { children: propTypes.func }
  state = this.props;
  update = state => this.setState(assign({}, this.state, state));
  render = () => this.props.children(this.state, this.update);
}

describe('Datepicker with Redux Form integration', () => {
  const datepicker = new DatepickerInteractor();

  describe('onChange', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
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

  describe('Calendar', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <Datepicker input={{ value: '04/01/2018' }} />
        </div>
      );

      await datepicker.focusInput();
    });

    it('has April 2018 in calendar header', () => {
      expect(datepicker.calendar.header).to.equal('April 2018');
    });

    it('shows days from April 2018', () => {
      expect(datepicker.calendar.text).to.deep.equal([
        '1', '2', '3', '4', '5', '6', '7',
        '8', '9', '10', '11', '12', '13', '14',
        '15', '16', '17', '18', '19', '20', '21',
        '22', '23', '24', '25', '26', '27', '28',
        '29', '30', '_1_', '_2_', '_3_', '_4_', '_5_'
      ]);
    });

    it('has April 1st as selected', () => {
      expect(datepicker.calendar.selected.text).to.equal('1');
    });

    describe('going to previous month', () => {
      beforeEach(async () => datepicker.calendar.previousMonth());

      it('changed calendar header to March 2018', () => {
        expect(datepicker.calendar.header).to.equal('March 2018');
      });

      it('shows days from March 2018', () => {
        expect(datepicker.calendar.text).to.deep.equal([
          '_25_', '_26_', '_27_', '_28_', '1', '2', '3',
          '4', '5', '6', '7', '8', '9', '10',
          '11', '12', '13', '14', '15', '16', '17',
          '18', '19', '20', '21', '22', '23', '24',
          '25', '26', '27', '28', '29', '30', '31'
        ]);
      });

      it('does not have a selected day', () => {
        expect(datepicker.calendar.selected).to.be.undefined;
      });
    });

    describe('going to next month', () => {
      beforeEach(async () => datepicker.calendar.nextMonth());

      it('changed calendar header to May 2018', () => {
        expect(datepicker.calendar.header).to.equal('May 2018');
      });

      it('shows days from May 2018', () => {
        expect(datepicker.calendar.text).to.deep.equal([
          '_29_', '_30_', '1', '2', '3', '4', '5',
          '6', '7', '8', '9', '10', '11', '12',
          '13', '14', '15', '16', '17', '18', '19',
          '20', '21', '22', '23', '24', '25', '26',
          '27', '28', '29', '30', '31', '_1_', '_2_'
        ]);
      });

      it('does not have a selected day', () => {
        expect(datepicker.calendar.selected).to.be.undefined;
      });
    });

    describe('going to previous year', () => {
      beforeEach(async () => datepicker.calendar.previousYear());

      it('changed calendar header to April 2017', () => {
        expect(datepicker.calendar.header).to.equal('April 2017');
      });

      it('shows days from April 2017', () => {
        expect(datepicker.calendar.text).to.deep.equal([
          '_26_', '_27_', '_28_', '_29_', '_30_', '_31_', '1',
          '2', '3', '4', '5', '6', '7', '8',
          '9', '10', '11', '12', '13', '14', '15',
          '16', '17', '18', '19', '20', '21', '22',
          '23', '24', '25', '26', '27', '28', '29',
          '30', '_1_', '_2_', '_3_', '_4_', '_5_', '_6_'
        ]);
      });

      it('does not have a selected day', () => {
        expect(datepicker.calendar.selected).to.be.undefined;
      });
    });

    describe('going to next year', () => {
      beforeEach(async () => datepicker.calendar.nextYear());

      it('changed calendar header to April 2019', () => {
        expect(datepicker.calendar.header).to.equal('April 2019');
      });

      it('shows days from April 2019', () => {
        expect(datepicker.calendar.text).to.deep.equal([
          '_31_', '1', '2', '3', '4', '5', '6',
          '7', '8', '9', '10', '11', '12', '13',
          '14', '15', '16', '17', '18', '19', '20',
          '21', '22', '23', '24', '25', '26', '27',
          '28', '29', '30', '_1_', '_2_', '_3_', '_4_'
        ]);
      });

      it('does not have a selected day', () => {
        expect(datepicker.calendar.selected).to.be.undefined;
      });
    });

    it('has cursor on April 1, 2018', () => {
      expect(datepicker.calendar.cursor.date).to.equal('04/01/2018');
    });

    describe('press up', () => {
      beforeEach(async () => datepicker.calendar.cursor.pressUp());

      it('takes user to previous month', () => {
        expect(datepicker.calendar.header).to.equal('March 2018');
      });

      it('changed cursor to March 25, 2018', () => {
        expect(datepicker.calendar.cursor.date).to.equal('03/25/2018');
      });
    });

    describe('press down', () => {
      beforeEach(async () => datepicker.calendar.cursor.pressDown());

      it('changed cursor to April 8, 2018', () => {
        expect(datepicker.calendar.cursor.date).to.equal('04/08/2018');
      });
    });

    describe('press left', () => {
      beforeEach(async () => datepicker.calendar.cursor.pressLeft());

      it('takes user to previous month', () => {
        expect(datepicker.calendar.header).to.equal('March 2018');
      });

      it('changed cursor to March 31, 2018', () => {
        expect(datepicker.calendar.cursor.date).to.equal('03/31/2018');
      });
    });

    describe('press right', () => {
      beforeEach(async () => datepicker.calendar.cursor.pressRight());

      it('changed cursor to April 2, 2018', () => {
        expect(datepicker.calendar.cursor.date).to.equal('04/02/2018');
      });
    });

    describe('press page up', () => {
      beforeEach(async () => datepicker.calendar.cursor.pressPageUp());

      it('takes user to previous month', () => {
        expect(datepicker.calendar.header).to.equal('March 2018');
      });

      it('changed cursor to March 1, 2018', () => {
        expect(datepicker.calendar.cursor.date).to.equal('03/01/2018');
      });
    });

    describe('press page down', () => {
      beforeEach(async () => datepicker.calendar.cursor.pressPageDown());

      it('takes user to next month', () => {
        expect(datepicker.calendar.header).to.equal('May 2018');
      });

      it('changed cursor to May 1, 2018', () => {
        expect(datepicker.calendar.cursor.date).to.equal('05/01/2018');
      });
    });

    describe('press alt + page up', () => {
      beforeEach(async () => datepicker.calendar.cursor.altPageUp());

      it('takes user to previous year', () => {
        expect(datepicker.calendar.header).to.equal('April 2017');
      });

      it('changed cursor to April 1, 2017', () => {
        expect(datepicker.calendar.cursor.date).to.equal('04/01/2017');
      });
    });

    describe('press alt + page down', () => {
      beforeEach(async () => datepicker.calendar.cursor.altPageDown());

      it('takes user to next year', () => {
        expect(datepicker.calendar.header).to.equal('April 2019');
      });

      it('changed cursor to April 1, 2019', () => {
        expect(datepicker.calendar.cursor.date).to.equal('04/01/2019');
      });
    });
  });

  describe('dateFormat prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <State
          value="2018-18-04"
        >
          {({ value }, update) => (<Datepicker
            dateFormat="YYYY-DD-MM"
            input={{
                value,
                onChange: date => update({ value: date })
              }}
          />)}
        </State>
      );
    });

    it('placeholder is YYYY-DD-MM', () => {
      expect(datepicker.placeholder).to.equal('YYYY-DD-MM');
    });

    describe('day selected in calendar', () => {
      beforeEach(async () => datepicker.clickInput());

      it('has April 18 2018 selected', () => {
        expect(datepicker.calendar.selected.date).to.equal('2018-18-04');
      });
    });

    describe('fill in a new date', () => {
      beforeEach(async () => datepicker.clickInput().fillInput('2016-10-02'));

      it('has February 10, 2016 selected', () => {
        expect(datepicker.calendar.selected.date).to.equal('2016-10-02');
      });
    });
  });

  describe('selecting a date with timeZone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
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

  describe('backendDateStandard prop', () => {
    describe('RFC2822', () => {
      let onChange;

      beforeEach(async () => {
        onChange = mock.fn();

        await mountWithContext(
          <Datepicker
            backendDateStandard="RFC2822"
            input={{
              onChange
            }}
            timeZone="America/Los_Angeles"
          />
        );

        await datepicker.fillInput('04/01/2018');
      });

      it('returns an RFC2822 datetime string for specific time zone', () => {
        expect(onChange.mock.calls[0][0]).to.equal('Sun, 04 Apr 2018 00:00:00 -0700');
      });
    });

    describe('arbitrary format', () => {
      let onChange;

      beforeEach(async () => {
        onChange = mock.fn();

        await mountWithContext(
          <Datepicker
            backendDateStandard="YYYY"
            input={{
              onChange
            }}
            timeZone="America/Los_Angeles"
          />
        );

        await datepicker.fillInput('04/01/2018');
      });

      it('returns an RFC2822 datetime string for specific time zone', () => {
        expect(onChange.mock.calls[0][0]).to.equal('2018');
      });
    });
  });

  describe('excludeDates prop', () => {
    let error;

    beforeEach(async () => {
      error = console.error;
      console.error = mock.fn();

      await mountWithContext(
        <Datepicker
          input={{ value: '04/05/2018' }}
          excludeDates="04/01/2018"
        />
      );

      await datepicker.clickInput();
    });

    afterEach(() => { console.error = error; });

    it('logs a deprecation warning', () => {
      expect(console.error.mock.calls.length).to.equal(1);
      expect(console.error.mock.calls[0][0]).to.have.string('The prop `excludeDates` of `Datepicker` is deprecated.');
    });

    it('excludes the passed in date', () => {
      expect(datepicker.calendar.excludedDates).to.deep.equal(
        ['04/01/2018']
      );
    });

    it('makes excluded days disabled', () => {
      expect(datepicker.calendar.days(0).disabled).to.be.true;
    });
  });

  describe('ignoreLocalOffset deprecation', () => {
    let error;

    beforeEach(async () => {
      error = console.error;
      console.error = mock.fn();

      await mountWithContext(
        <Datepicker ignoreLocalOffset />
      );
    });

    afterEach(() => { console.error = error; });

    it('logs warning when used', () => {
      expect(console.error.mock.calls.length).to.equal(1);
      expect(console.error.mock.calls[0][0]).to.have.string('The prop `ignoreLocalOffset` of `Datepicker` is deprecated.');
    });
  });

  describe('exclude prop', () => {
    describe('by default no day is excluded', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Datepicker input={{ value: '04/01/2018' }} />
        );

        await datepicker.clickInput();
      });

      it('has no excluded days', () => {
        expect(datepicker.calendar.excludedDates).to.deep.equal([]);
      });
    });

    describe('multiple dates', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Datepicker
            input={{ value: '04/05/2018' }}
            exclude={date => ['04/01/2018', '04/03/2018'].includes(date.format('MM/DD/YYYY'))}
          />
        );

        await datepicker.clickInput();
      });

      it('excludes multipe dates', () => {
        expect(datepicker.calendar.excludedDates).to.deep.equal(
          ['04/01/2018', '04/03/2018']
        );
      });

      it('makes excluded days disabled', () => {
        expect(datepicker.calendar.days(0).disabled).to.be.true;
        expect(datepicker.calendar.days(2).disabled).to.be.true;
      });
    });

    describe('selecting excluded date', () => {
      let onChange;


      beforeEach(async () => {
        onChange = mock.fn();

        await mountWithContext(
          <Datepicker
            input={{ value: '04/03/2018', onChange }}
            exclude={date => date.format('MM/DD/YYYY') === '04/03/2018'}
          />
        );

        await datepicker.clickInput();
      });

      describe('click to select', () => {
        beforeEach(async () => datepicker.calendar.days(2).click());
        it('did not call onChange', () => {
          expect(onChange.mock.calls.length).to.equal(0);
        });
      });

      describe('pressing enter', () => {
        beforeEach(async () => datepicker.calendar.days(2).pressEnter());
        it('did not call onChange', () => {
          expect(onChange.mock.calls.length).to.equal(0);
        });
      });

      describe('navigation on exluded date', () => {
        beforeEach(async () => datepicker.calendar.cursor.pressLeft());
        it('changed cursor to April 2, 2018', () => {
          expect(datepicker.calendar.cursor.date).to.equal('04/02/2018');
        });
      });
    });
  });
});
