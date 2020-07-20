import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import DateRangeWrapper from '../DateRangeWrapper';
import Datepicker from '../../Datepicker';
import DatepickerInteractor from '../../Datepicker/tests/interactor';

describe('DateRangeWrapper with Redux Form', () => {
  const startDatepicker = new DatepickerInteractor('#StartDate');
  const endDatepicker = new DatepickerInteractor('#EndDate');

  let startChanged = false;
  let endChanged = false;

  const handleChange = (e) => {
    return e.target.value;
  };

  // July 2018 is a sane month since the first is on the first day of the calendar
  // so we don't have to accont for days not within the month, just the 0-based index...

  const initialDates = {
    beginDate: '2018-07-10',
    endDate: '2018-07-25'
  };

  const startDayToSet = 8; // 9th
  const endDayToSet = 25; // 26th

  describe('renders children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm initialValues={initialDates}>
          <DateRangeWrapper
            initialStartDate={initialDates.beginDate}
            initialEndDate={initialDates.endDate}
            startValueGetter={handleChange}
            endValueGetter={handleChange}
          >
            {({
              getStartInputProps,
              getEndInputProps,
              endDateExclude,
              startDateExclude,
            }) => (
              <div>
                <div id="StartDate">
                  <Field
                    id="StartDateInput"
                    name="beginDate"
                    dateFormat="YYYY-MM-DD"
                    component={Datepicker}
                    exclude={startDateExclude}
                    {...getStartInputProps({
                      onChange: () => { startChanged = true; },
                    })}
                  />
                </div>
                <div id="EndDate">
                  <Field
                    id="EndDateInput"
                    name="endDate"
                    dateFormat="YYYY-MM-DD"
                    component={Datepicker}
                    exclude={endDateExclude}
                    {...getEndInputProps({
                      onChange: () => { endChanged = true; },
                    })}
                  />
                </div>
              </div>
            )}
          </DateRangeWrapper>
        </TestForm>
      );
    });

    it('renders children', () => {
      expect(startDatepicker.id).to.equal('StartDateInput');
      expect(endDatepicker.id).to.equal('EndDateInput');
    });

    describe('changing the end date picker', () => {
      beforeEach(async () => {
        endChanged = false;
        await endDatepicker.openCalendar();
        await endDatepicker.calendar.days(endDayToSet).click();
      });

      it('calls the provided onChange handler', () => {
        expect(endChanged).to.be.true;
      });
    });

    describe('changing the startDate picker', () => {
      beforeEach(async () => {
        startChanged = false;
        await startDatepicker.openCalendar();
        await startDatepicker.calendar.days(startDayToSet).click();
      });

      it('calls the supplied onChange function', () => {
        expect(startChanged).to.be.true;
      });
    });
    describe('excluded days for end datepicker', () => {
      beforeEach(async () => {
        await endDatepicker.openCalendar();
      });

      it('should be before the start date', () => {
        for (let i = startDayToSet - 1; i > -1; i--) {
          expect(endDatepicker.calendar.days(i).isExcluded).to.be.true;
        }
      });

      describe('excluded days for start datepicker', () => {
        beforeEach(async () => {
          await document.body.click();
          await startDatepicker.openCalendar();
        });

        it('should be after the end date', () => {
          const res = [];
          for (let i = endDayToSet + 2; i <= 34; i++) {
            res.push(startDatepicker.calendar.days(i).isExcluded);
          }
          expect(res.some(r => !r)).to.be.false;
        });
      });
    });
  });
});
