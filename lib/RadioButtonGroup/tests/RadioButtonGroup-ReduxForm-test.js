import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { Field } from 'redux-form';
import { RadioButtonGroup as RadioButtonGroupInteractor, RadioButton as RadioButtonInteractor } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../../RadioButton';
// import RadioButtonGroupInteractor from './interactor';

describe('RadioButtonGroup with Redux Form', () => {
  const radioButtonGroup = RadioButtonGroupInteractor('TestField');

  beforeEach(async () => {
    await mountWithContext(
      <TestForm>
        <RadioButtonGroup label="TestField">
          <p>Some help text</p>
          <Field
            component={RadioButton}
            name="bool"
            label="Yes"
            value="yes"
            type="radio"
            validate={value => (value === 'no' ? 'testField is invalid' : undefined)}
            warn={value => (value === 'yes' ? 'testField has a warning' : undefined)}
          />
          <Field
            component={RadioButton}
            name="bool"
            label="No"
            value="no"
            type="radio"
            validate={value => (value === 'no' ? 'testField is invalid' : undefined)}
            warn={value => (value === 'yes' ? 'testField has a warning' : undefined)}
          />
        </RadioButtonGroup>
      </TestForm>
    );
    await radioButtonGroup.focus('Yes');
  });

  it('no options are selected', () => {
    RadioButtonInteractor({ checked: true }).absent();
  });

  describe('selecting an option', () => {
    beforeEach(async () => {
      await radioButtonGroup.choose('Yes');
      await radioButtonGroup.blur();
    });

    it('displays the first option as selected', () => {
      radioButtonGroup.has({ checkedOption: 'Yes' });
    });

    it('displays a warning message', () => {
      radioButtonGroup.has({ feedbackText: 'testField has a warning' });
    });

    describe('selecting another option', () => {
      beforeEach(async () => {
        await radioButtonGroup.choose('No');
      });

      it('displays the first option as unselected, second option selected', () => {
        radioButtonGroup.has({ checkedOption: 'No' });
        RadioButtonGroupInteractor({ checkedOption: 'Yes' }).absent();
      });

      it('displays an error message', () => {
        radioButtonGroup.has({ feedbackText: 'testField is invalid' });
      });
    });
  });
});
