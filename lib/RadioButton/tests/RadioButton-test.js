import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import RadioButton from '../RadioButton';
import { RadioButton as RadioButtonInteractor } from '@folio/stripes-testing';

describe('RadioButton', () => {
  const radioButton = new RadioButtonInteractor();

  describe('with an id', () => {
    const radioButtonId = new RadioButtonInteractor({ id: 'checkbox-test' });
    beforeEach(async () => {
      await mount(
        <RadioButton id="checkbox-test" />
      );
    });

    it('has an id on the input element', async () =>
      await radioButtonId.has({ id: 'checkbox-test' }));
  });

  describe('with warning text', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton warning="That's not a great value." />
      );
    });

    it('displays the warning text', async () =>
      await radioButton.has({ feedbackText: `That's not a great value.` }));

    it('applies a warning class', async () =>
      await radioButton.has({ hasWarning: true }));
  });

  describe('with error text', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton error="That's a bad value." />
      );
    });

    it('displays the error text', async () =>
      await radioButton.has({ feedbackText: `That's a bad value.` }));

    it('applies an error class', async () =>
      await radioButton.has({ hasError: true }));
  });

  describe('with a value', () => {
    let output;

    beforeEach(async () => {
      await mount(
        <RadioButton
          value="bananas"
          onChange={(event) => {
            output = event.target.value;
          }}
        />
      );
    });

    it('displays the input as unchecked', async () =>
      await radioButton.is({ checked: false }));

    describe('clicking the label', () => {
      beforeEach(async () => {
        await radioButton.click();
      });

      it('toggles the value', async () =>
        await radioButton.has({ value: 'bananas' }));

      it('fires the onChange callback', () =>
        expect(output).to.equal('bananas'));

      it('displays the input as checked', async () =>
        await radioButton.is({ checked: true }));
    });
  });
});
