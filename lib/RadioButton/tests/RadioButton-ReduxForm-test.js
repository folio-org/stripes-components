import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { RadioButton as Interactor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';

import RadioButton from '../RadioButton';

describe('RadioButton with Redux Form', () => {
  const radioButton1 = Interactor('green');
  const radioButton2 = Interactor('ripe');
  let output = false;

  beforeEach(async () => {
    await mountWithContext(
      <TestForm>
        <div id="radio-button-1">
          <Field
            component={RadioButton}
            label="green"
            name="bananas"
            onChange={(event) => {
              output = event.target.checked;
            }}
            type="radio"
            value="green"
          />
        </div>
        <div id="radio-button-2">
          <Field
            component={RadioButton}
            label="ripe"
            name="bananas"
            type="radio"
            validate={value => (value === 'green' ? 'Not ready to eat' : undefined)}
            value="ripe"
            warn={value => (value === 'ripe' ? 'Warning: may be mushy' : undefined)}
          />
        </div>
      </TestForm>
    );
  });

  it('displays the input as unchecked', () => radioButton1.is({ checked: false }));

  describe('clicking the label', () => {
    beforeEach(async () => {
      await radioButton1.click();
      await radioButton1.blur();
    });

    it('toggles the value', () => expect(output).to.be.true);

    it('displays the input as checked', () => radioButton1.is({ checked: true }));

    it('displays the error text', () => radioButton1.has({ feedbackText: 'Not ready to eat' }));

    it('applies an error class', () => radioButton1.has({ hasError: true }));

    describe('toggling to a different radio button', () => {
      beforeEach(async () => {
        await radioButton2.click();
        await radioButton2.blur();
      });

      it('displays warning text', () => radioButton2.has({ feedbackText: 'Warning: may be mushy' }));

      it('applies a warning class', () => radioButton2.has({ hasWarning: true }));
    });
  });
});
