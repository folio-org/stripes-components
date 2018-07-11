import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import jest from 'jest-mock';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import DatepickerInteractor from './interactor';

/*
 * Commonly used props:
 *  - [] backendDateStandard
 *  - [] timeZone
 *  - [] dateFormat
 *  - [] intl
 *  - [] locale
 *  - [] excludeDates
 *
 * HTML Attributes
 *  - [x] disabled
 *  - [x] label
 *  - [x] id
 *  - [] onChange
 *  - [] readOnly
 *  - [] required
 *
 * Redux Integration
 *  - input
 *    - [x] value
 *  - meta
 *
 * Possible Deprecation
 *  - [?] passThroughValue - when value matches specified value, just pass the value through
 *  - stripes
 *  - [] ignoreLocalOffset
 */

describe('Datepicker with Redux Form integration', () => {
  const datepicker = new DatepickerInteractor();

  describe('selecting a date', () => {
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

  describe.skip('clear button', () => {
    beforeEach(async () => mountWithContext(<Datepicker />));
    it('does not show clear button', () => {
      expect(datepicker.clearButton.isVisible).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker label="Pick a date" required />
      );
    });

    it('adds required attribute to input field', () => {
      expect(datepicker.required).to.be.true;
    });
  });
});
