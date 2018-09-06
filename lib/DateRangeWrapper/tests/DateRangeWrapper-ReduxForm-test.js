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

  const handleChange = (e, value) => {
    return value;
  };

  const initialDates = {
    beginDate: '2018-10-10',
    endDate: '2018-10-25'
  };

  const startDayToSet = 11;
  const endDayToSet = 24;

  describe('renders children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm initialValues={initialDates}>
          <DateRangeWrapper
            initialStartDate="2018-10-10"
            initialEndDate="2018-10-26"
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
        await endDatepicker.clickInput();
        await endDatepicker.calendar.days(endDayToSet).click();
      });

      it('calls the provided onChange handler', () => {
        expect(endChanged).to.be.true;
      });

      describe('changing the startDate picker', () => {
        beforeEach(async () => {
          startChanged = false;
          await startDatepicker.clickInput();
          await startDatepicker.calendar.days(startDayToSet).click();
        });

        it('calls the supplied onChange function', () => {
          expect(startChanged).to.be.true;
        });

        describe('excluded days for end datepicker', () => {
          beforeEach(async () => {
            await endDatepicker.clickInput();
          });

          it('should be before the start date', () => {
            for (let i = startDayToSet - 1; i > -1; i--) {
              expect(startDatepicker.calendar.days(i).isExcluded).to.be.true;
            }
          });

          describe('excluded days for start datepicker', () => {
            beforeEach(async () => {
              await startDatepicker.clickInput();
            });

            it('should be after the end date', () => {
              for (let i = endDayToSet; i <= 34; i++) {
                expect(startDatepicker.calendar.days(i).isExcluded).to.be.true;
                console.log(  // eslint-disable-line
                  `${i} is ${startDatepicker.calendar.days(i).isExcluded ? 'excluded' : 'included'}`
                );
              }
            });
          });
        });
      });
    });
  });
});
