import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { mount, mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';

import Checkbox from '../Checkbox';
import CheckboxInteractor from './interactor';

describe('Checkbox', () => {
  const checkbox = new CheckboxInteractor();

  describe('with an id', () => {
    beforeEach(async () => {
      await mount(
        <Checkbox id="checkbox-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(checkbox.id).to.equal('checkbox-test');
    });
  });

  describe('with warning text', () => {
    beforeEach(async () => {
      await mount(
        <Checkbox warningText="That's not a great value." />
      );
    });

    it('displays the warning text', () => {
      expect(checkbox.feedbackText).to.equal('That\'s not a great value.');
    });

    it('applies a warning class', () => {
      expect(checkbox.hasWarningStyle).to.be.true;
    });
  });

  describe('with error text', () => {
    beforeEach(async () => {
      await mount(
        <Checkbox errorText="That's a bad value." />
      );
    });

    it('displays the error text', () => {
      expect(checkbox.feedbackText).to.equal('That\'s a bad value.');
    });

    it('applies an error class', () => {
      expect(checkbox.hasErrorStyle).to.be.true;
    });
  });

  describe('with a value', () => {
    let output;

    beforeEach(async () => {
      await mount(
        <Checkbox
          value="bananas"
          onChange={(event) => { output = event.target.value; }}
        />
      );
    });

    it('displays the input as unchecked', () => {
      expect(checkbox.isChecked).to.be.false;
    });

    describe('clicking the label', () => {
      beforeEach(async () => {
        await checkbox.clickLabel();
      });

      it('toggles the value', () => {
        expect(output).to.equal('bananas');
      });

      it('displays the input as checked', () => {
        expect(checkbox.isChecked).to.be.true;
      });
    });
  });

  describe('coupled to redux-form', () => {
    let output = false;

    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="bananas"
            component={Checkbox}
            onChange={(event, newValue) => {
              output = newValue;
            }}
            validate={value => (value ? undefined : 'Required')}
          />
        </TestForm>
      );
    });

    it('displays the input as unchecked', () => {
      expect(checkbox.isChecked).to.be.false;
    });

    describe('clicking the label', () => {
      beforeEach(async () => {
        await checkbox.clickLabel();
      });

      it('toggles the value', () => {
        expect(output).to.be.true;
      });

      it('displays the input as checked', () => {
        expect(checkbox.isChecked).to.be.true;
      });

      describe('toggling the checkbox back to off', () => {
        beforeEach(async () => {
          await checkbox.clickAndBlur();
        });

        it('displays the error text', () => {
          expect(checkbox.feedbackText).to.equal('Required');
        });

        it('applies an error class', () => {
          expect(checkbox.hasErrorStyle).to.be.true;
        });
      });
    });
  });
});
