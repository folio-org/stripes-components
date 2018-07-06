import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import DatepickerInteractor from './interactor';

/**
 * Commonly used props:
 *  - backendDateStandard
 *  - ignoreLocalOffset
 *  - required
 *  - timeZone
 *  - dateFormat
 *  - intl
 *  - locale
 * 
 * HTML Attributes
 *  - label
 *  - disabled
 *  - id
 *  - onChange
 *  - readOnly
 *  - required
 *  - value
 * 
 * Redux Integration
 *  - input
 *  - meta
 * 
 * Possible Deprecation
 *  - stripes
 *  - passThroughValue - when value matches specified value, just pass the value through
 * 
 * Unused Configurations
 * - useFocus (set to true, so it's always active although never passed)
 * - thether (has defaults but never used)
 * - screenReaderMessage 
 * - hideOnChoose (default true)
 * - onSetDate
 * - showCalendar
 */

describe.only('Datepicker', () => {
  const datepicker = new DatepickerInteractor();

  describe('render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );
    });
  
    it('does not have a value in the input', () => {
      expect(datepicker.inputValue).to.equal('');
    });
  
    it('has a placeholder in the input', () => {
      expect(datepicker.placeholder).to.equal('MM/DD/YYYY');
    });
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker id="datepicker-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(datepicker.id).to.equal('datepicker-test');
    });
  });

  describe('selecting a date', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
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

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
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

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('the calendar picker', () => {

    describe('without value', () => {
      beforeEach(async () => {
        await mountWithContext(
          <div>
            <Datepicker />
          </div>
        );
  
        await datepicker.focusInput();
      });
  
      it('opens on focus', () => {
        expect(datepicker.calendar.isVisible).to.be.true;
      });
  
      it('shows days', () => {
        expect(datepicker.calendar.days().length).to.equal(35);
      });
  
      describe('shifting the focus onBlur', () => {
        beforeEach(async () => {
          await datepicker.fillAndBlur('04/01/2018');
        });
  
        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isPresent).to.be.false;
        });
      });
    });

    describe('with value', () => {
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
        expect(datepicker.calendar.selected.text).to.equal("1");
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
        expect(datepicker.calendar.cursor.date).to.equal("04/01/2018");
      });
      
      describe('press up', () => {
        beforeEach(async () => datepicker.calendar.cursor.pressUp());

        it('takes user to previous month', () => {
          expect(datepicker.calendar.header).to.equal('March 2018');
        });

        it('changed cursor to March 25, 2018', () => {
          expect(datepicker.calendar.cursor.date).to.equal("03/25/2018");
        });
      });

      describe('press down', () => {
        beforeEach(async () => datepicker.calendar.cursor.pressDown());

        it('changed cursor to April 8, 2018', () => {
          expect(datepicker.calendar.cursor.date).to.equal("04/08/2018");
        });
      });

      describe('press left', () => {
        beforeEach(async () => datepicker.calendar.cursor.pressLeft());

        it('takes user to previous month', () => {
          expect(datepicker.calendar.header).to.equal('March 2018');
        });

        it('changed cursor to March 31, 2018', () => {
          expect(datepicker.calendar.cursor.date).to.equal("03/31/2018");
        });
      });

      describe('press right', () => {
        beforeEach(async () => datepicker.calendar.cursor.pressRight());

        it('changed cursor to April 2, 2018', () => {
          expect(datepicker.calendar.cursor.date).to.equal("04/02/2018");
        });
      });

    });

  });

  describe('coupled to redux form', () => {
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
  });
});
