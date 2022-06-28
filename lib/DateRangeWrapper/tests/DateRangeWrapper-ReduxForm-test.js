import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Field } from 'redux-form';
import { Datepicker as DatepickerInteractor, Calendar, converge } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import DateRangeWrapper from '../DateRangeWrapper';
import Datepicker from '../../Datepicker';


describe('DateRangeWrapper with Redux Form', () => {
  const startDatepicker = DatepickerInteractor({ id: 'StartDateInput' });
  const endDatepicker = DatepickerInteractor({ id: 'EndDateInput' });

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

  const startDayToSet = '09';
  const endDayToSet = '26';

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
      return Promise.all([
        startDatepicker.exists(),
        endDatepicker.exists()
      ]);
    });

    describe('changing the end date picker', () => {
      beforeEach(async () => {
        endChanged = false;
        await endDatepicker.openCalendar();
        await Calendar().clickDay(endDayToSet);
      });

      it('calls the provided onChange handler', () => converge(() => endChanged));
    });

    describe('changing the startDate picker', () => {
      beforeEach(async () => {
        startChanged = false;
        await startDatepicker.openCalendar();
        await Calendar().clickDay(startDayToSet);
      });

      it('calls the supplied onChange function', () => converge(() => startChanged));
    });

    describe('excluded days for end datepicker', () => {
      beforeEach(async () => {
        await endDatepicker.openCalendar();
      });

      it('should be before the start date', () => {
        const excludedDays = [];
        for (let i = parseInt(startDayToSet, 10); i > 0; i--) {
          excludedDays.unshift(i.toString());
        }
        return Calendar().has({ excludedDays });
      });

      describe('excluded days for start datepicker', () => {
        beforeEach(async () => {
          await document.body.click();
          await startDatepicker.openCalendar();
        });

        it('should be after the end date', () => {
          const excludedDays = ['26', '27', '28', '29', '30', '31', '_1_', '_2_', '_3_', '_4_'];
          return Calendar({ excludedDays }).exists();
        });
      });
    });
  });
});
