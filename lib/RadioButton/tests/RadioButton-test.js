import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { RadioButton as Interactor } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import RadioButton from '../RadioButton';

describe('RadioButton', () => {
  const radioButton = new Interactor();

  describe('with an id', () => {
    const radioButtonId = new Interactor({ id: 'checkbox-test' });
    beforeEach(async () => {
      await mount(
        <RadioButton id="checkbox-test" />
      );
    });

    it('has an id on the input element', () => radioButtonId.has({ id: 'checkbox-test' }));
  });

  describe('with warning text', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton warning="That's not a great value." />
      );
    });

    it('displays the warning text', () => radioButton.has({ feedbackText: 'That\'s not a great value.' }));

    it('applies a warning class', () => radioButton.has({ hasWarning: true }));
  });

  describe('with error text', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton error="That's a bad value." />
      );
    });

    it('displays the error text', () => radioButton.has({ feedbackText: 'That\'s a bad value.' }));

    it('applies an error class', () => radioButton.has({ hasError: true }));
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

    it('displays the input as unchecked', () => radioButton.is({ checked: false }));

    describe('clicking the label', () => {
      beforeEach(async () => {
        await radioButton.click();
      });

      it('toggles the value', () => radioButton.has({ value: 'bananas' }));

      it('fires the onChange callback', () => expect(output).to.equal('bananas'));

      it('displays the input as checked', () => radioButton.is({ checked: true }));
    });
  });
});
