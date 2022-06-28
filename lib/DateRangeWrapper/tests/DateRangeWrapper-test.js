import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Datepicker as DatepickerInteractor, converge, Calendar } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import DateRangeWrapper from '../DateRangeWrapper';
import Datepicker from '../../Datepicker';

describe('DateRangeWrapper', () => {
  const startDatepicker = DatepickerInteractor({ id: 'StartDateInput' });
  const endDatepicker = DatepickerInteractor({ id: 'EndDateInput' });

  let startChanged = false;
  let endChanged = false;

  const startDayToSet = '09';
  const endDayToSet = '25';

  describe('Renders children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DateRangeWrapper
          initialStartDate="2018-07-10"
          initialEndDate="2018-07-25"
        >
          {({
            getStartInputProps,
            getEndInputProps,
            endDateExclude,
            startDateExclude,
          }) => (
            <div>
              <div id="StartDate">
                <Datepicker
                  id="StartDateInput"
                  exclude={startDateExclude}
                  dateFormat="YYYY-MM-DD"
                  input={{
                    ...getStartInputProps(
                      {
                        onChange: () => { startChanged = true; },
                        value: '2018-07-10',
                      }
                    ),
                  }}
                />
              </div>
              <div id="EndDate">
                <Datepicker
                  id="EndDateInput"
                  exclude={endDateExclude}
                  dateFormat="YYYY-MM-DD"
                  input={
                    {
                      ...getEndInputProps(
                        {
                          onChange: () => { endChanged = true; },
                          value: '2018-07-25'
                        }
                      )
                    }
                  }
                />
              </div>
            </div>
          )
          }
        </DateRangeWrapper>
      );
    });

    it('renders children', () => {
      return Promise.all([
        startDatepicker.exists(),
        endDatepicker.exists()
      ]);
    });

    describe('changing the startDate picker', () => {
      beforeEach(async () => {
        startChanged = false;
        await startDatepicker.openCalendar();
        await Calendar().clickDay(startDayToSet);
      });

      it('calls the supplied onChange function', () => converge(() => startChanged));

      describe('changing the end date picker', () => {
        beforeEach(async () => {
          endChanged = false;
          await endDatepicker.openCalendar();
          await Calendar().clickDay(endDayToSet);
        });

        it('calls the provided onChange handler', () => converge(() => endChanged));

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
            const excludedDays = [];
            for (let i = parseInt(startDayToSet, 10) - 1; i > 0; i--) {
              excludedDays.unshift(i.toString());
            }
            return Calendar().has({ excludedDays });
          });
        });
      });
    });
  });
});
