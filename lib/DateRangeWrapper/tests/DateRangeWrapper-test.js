import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import DateRangeWrapper from '../DateRangeWrapper';
import Datepicker from '../../Datepicker';
import DatepickerInteractor from '../../Datepicker/tests/interactor';

describe('DateRangeWrapper', () => {
  const startDatepicker = new DatepickerInteractor('#StartDate');
  const endDatepicker = new DatepickerInteractor('#EndDate');

  let startChanged = false;
  let endChanged = false;

  const startDayToSet = 8;
  const endDayToSet = 25;

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
      expect(startDatepicker.id).to.equal('StartDateInput');
      expect(endDatepicker.id).to.equal('EndDateInput');
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

      describe('changing the end date picker', () => {
        beforeEach(async () => {
          endChanged = false;
          await endDatepicker.openCalendar();
          await endDatepicker.calendar.days(endDayToSet).click();
        });

        it('calls the provided onChange handler', () => {
          expect(endChanged).to.be.true;
        });

        describe('excluded days for start datepicker', () => {
          beforeEach(async () => {
            await startDatepicker.openCalendar();
          });

          it('should be after the end date', () => {
            for (let i = endDayToSet + 1; i <= 34; i++) {
              expect(startDatepicker.calendar.days(i).isExcluded).to.be.true;
            }
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
        });
      });
    });
  });
});
