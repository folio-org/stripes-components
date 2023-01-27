import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Form } from 'react-final-form';

import { Datepicker as DatepickerInteractor, Calendar } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';

import DateRangeWrapper from '../DateRangeWrapper';
import Datepicker from '../../Datepicker';

describe.only('DateRangeWrapper', () => {
  const startDatepicker = DatepickerInteractor({ id: 'StartDateInput' });
  const endDatepicker = DatepickerInteractor({ id: 'EndDateInput' });

  describe('Renders children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          initialValues={{
            startDate: '2018-07-10',
            endDate: '2018-07-25',
          }}
          render={() => (
            <DateRangeWrapper>
              {({
                endDateExclude,
                startDateExclude,
              }) => (
                <>
                  <div id="StartDate">
                    <Datepicker
                      id="StartDateInput"
                      name="startDate"
                      exclude={startDateExclude}
                      dateFormat="YYYY-MM-DD"
                      value="2018-07-10"
                    />
                  </div>
                  <div id="EndDate">
                    <Datepicker
                      id="EndDateInput"
                      name="endDate"
                      exclude={endDateExclude}
                      dateFormat="YYYY-MM-DD"
                      value="2018-07-25"
                    />
                  </div>
                </>
              )
              }
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

    describe('excluded days for start datepicker', () => {
      beforeEach(async () => {
        await startDatepicker.openCalendar();
      });

      it('should be after the end date', () => {
        const excludedDays = ['26', '27', '28', '29', '30', '31', '_1_', '_2_', '_3_', '_4_'];
        return Calendar().has({ excludedDays });
      });
    });

    describe('excluded days for end datepicker', () => {
      beforeEach(async () => {
        await endDatepicker.openCalendar();
      });

      it('should be before the start date', () => {
        const excludedDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return Calendar().has({ excludedDays });
      });
    });
  });
});
