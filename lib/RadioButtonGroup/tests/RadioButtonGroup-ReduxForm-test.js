import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../../RadioButton';
import RadioButtonGroupInteractor from './interactor';

describe('RadioButtonGroup with Redux Form', () => {
  const radioButtonGroup = new RadioButtonGroupInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <TestForm>
        <Field
          name="testField"
          component={RadioButtonGroup}
          validate={value => (value === 'no' ? 'testField is invalid' : undefined)}
          warn={value => (value === 'yes' ? 'testField has a warning' : undefined)}
        >
          <p>Some help text</p>
          <RadioButton label="Yes" value="yes" />
          <RadioButton label="No" value="no" />
        </Field>
      </TestForm>
    );
  });

  it('displays the first option as unselected', () => {
    expect(radioButtonGroup.options(0).isChecked).to.be.false;
  });

  it('displays the second option as unselected', () => {
    expect(radioButtonGroup.options(1).isChecked).to.be.false;
  });

  describe('selecting an option', () => {
    beforeEach(async () => {
      await radioButtonGroup.options(0).clickAndBlur();
    });

    it('displays the first option as selected', () => {
      expect(radioButtonGroup.options(0).isChecked).to.be.true;
    });

    it('displays the second option as unselected', () => {
      expect(radioButtonGroup.options(1).isChecked).to.be.false;
    });

    it.skip('displays a warning message', () => {
      expect(radioButtonGroup.feedbackText).to.equal('testField has a warning');
    });

    describe('selecting another option', () => {
      beforeEach(async () => {
        await radioButtonGroup.options(1).clickAndBlur();
      });

      it('displays the first option as unselected', () => {
        expect(radioButtonGroup.options(0).isChecked).to.be.false;
      });

      it('displays the second option as selected', () => {
        expect(radioButtonGroup.options(1).isChecked).to.be.true;
      });

      it('displays an error message', () => {
        expect(radioButtonGroup.feedbackText).to.equal('testField is invalid');
      });
    });
  });
});
