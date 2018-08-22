import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import RadioButton from '../RadioButton';
import RadioButtonInteractor from './interactor';

describe('RadioButton', () => {
  const radioButton = new RadioButtonInteractor();

  describe('with an id', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton id="checkbox-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(radioButton.id).to.equal('checkbox-test');
    });
  });

  describe('with warning text', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton warning="That's not a great value." />
      );
    });

    it('displays the warning text', () => {
      expect(radioButton.feedbackText).to.equal('That\'s not a great value.');
    });

    it('applies a warning class', () => {
      expect(radioButton.hasWarningStyle).to.be.true;
    });
  });

  describe('with error text', () => {
    beforeEach(async () => {
      await mount(
        <RadioButton error="That's a bad value." />
      );
    });

    it('displays the error text', () => {
      expect(radioButton.feedbackText).to.equal('That\'s a bad value.');
    });

    it('applies an error class', () => {
      expect(radioButton.hasErrorStyle).to.be.true;
    });
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

    it('displays the input as unchecked', () => {
      expect(radioButton.isChecked).to.be.false;
    });

    describe('clicking the label', () => {
      beforeEach(async () => {
        await radioButton.clickLabel();
      });

      it('toggles the value', () => {
        expect(output).to.equal('bananas');
      });

      it('displays the input as checked', () => {
        expect(radioButton.isChecked).to.be.true;
      });
    });
  });
});
