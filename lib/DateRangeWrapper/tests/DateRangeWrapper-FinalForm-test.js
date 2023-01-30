import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Form, Field } from 'react-final-form';
import { Datepicker as DatepickerInteractor, Calendar } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import DateRangeWrapper from '../DateRangeWrapper';
import Datepicker from '../../Datepicker';


describe('DateRangeWrapper with Final Form', () => {
  const startDatepicker = DatepickerInteractor({ id: 'StartDateInput' });
  const endDatepicker = DatepickerInteractor({ id: 'EndDateInput' });

  // July 2018 is a sane month since the first is on the first day of the calendar
  // so we don't have to accont for days not within the month, just the 0-based index...

  const initialDates = {
    beginDate: '2018-07-10',
    endDate: '2018-07-25'
  };

  const getStartValue = () => initialDates.beginDate;
  const getEndValue = () => initialDates.endDate;

  describe('renders children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          initialValues={initialDates}
          onSubmit={() => {}}
          render={() => (
            <DateRangeWrapper
              startValueGetter={getStartValue}
              endValueGetter={getEndValue}
            >
              {({
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
                    />
                  </div>
                  <div id="EndDate">
                    <Field
                      id="EndDateInput"
                      name="endDate"
                      dateFormat="YYYY-MM-DD"
                      component={Datepicker}
                      exclude={endDateExclude}
                    />
                  </div>
                </div>
              )}
            </DateRangeWrapper>
          )}
        />
      );
    });

    it('renders children', () => {
      return Promise.all([
        startDatepicker.exists(),
        endDatepicker.exists()
      ]);
    });

    describe('excluded days for end datepicker', () => {
      beforeEach(async () => {
        await endDatepicker.openCalendar();
      });

      it('should be before the start date', () => {
        const excludedDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
