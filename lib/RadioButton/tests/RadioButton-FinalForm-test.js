import React, { Fragment } from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, Form } from 'react-final-form';
import { mountWithContext } from '../../../tests/helpers';

import RadioButton from '../RadioButton';
import RadioButtonInteractor from './interactor';

describe('RadioButton with Final Form', () => {
  const radioButton1 = new RadioButtonInteractor('#radio-button-1');
  const radioButton2 = new RadioButtonInteractor('#radio-button-2');
  let output = false;

  beforeEach(async () => {
    await mountWithContext(
      <Form
        onSubmit={() => {}}
        render={() => (
          <Fragment>
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
              />
            </div>
          </Fragment>
        )}
      />
    );
  });

  it('displays the input as unchecked', () => {
    expect(radioButton1.isChecked).to.be.false;
  });

  describe('clicking the label', () => {
    beforeEach(async () => {
      await radioButton1.clickAndBlur();
    });

    it('toggles the value', () => {
      expect(output).to.be.true;
    });

    it('displays the input as checked', () => {
      expect(radioButton1.isChecked).to.be.true;
    });

    it('displays the error text', () => {
      expect(radioButton1.feedbackText).to.equal('Not ready to eat');
    });

    it('applies an error class', () => {
      expect(radioButton1.hasErrorStyle).to.be.true;
    });
  });
});
