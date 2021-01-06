import React from 'react';

import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { Field } from 'redux-form';

import { TextField as Interactor, IconButton as IconButtonInteractor } from '@folio/stripes-testing';
import TextField from '../TextField';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';

describe('TextField with ReduxForm', () => {
  const textField = Interactor();

  describe('using with redux-form', () => {
    describe('inputting a value', () => {
      let fieldCleared = false;

      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              name="testField"
              component={TextField}
              clearFieldId="clearField"
              onClearField={() => { fieldCleared = true; }}
            />
          </TestForm>
        );
      });

      it('should render the TextField normally', () => textField.has({ type: 'text' }));

      describe('changing the value', () => {
        beforeEach(() => textField.fillIn('anything'));

        it('applies a changed class', () => {
          textField.perform(el => expect(el.querySelector('[class*=isChanged-]')).to.exist);
        });

        it('renders a clear button', async () => {
          await textField.find(IconButtonInteractor({ icon: 'times-circle-solid' })).exists();
        });

        describe('clicking the clear button', () => {
          beforeEach(() => textField.clear());

          it('clears the field', () => textField.has({ value: '' }));

          it('fires the onClearField event', () => expect(fieldCleared).to.be.true);
        });
      });
    });

    describe('inputting an invalid value', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              name="testField"
              component={TextField}
              validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textField.fillIn('invalid');
        await textField.blur();
      });

      it('marks the field as invalid', () => textField.is({ valid: false }));

      it('renders an error message', () => textField.has({ error: 'testField is Invalid' }));
    });

    describe('inputting an valid value with validStylesEnabled', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              name="testField"
              component={TextField}
              validStylesEnabled
              validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textField.fillIn('invalid');
        await textField.blur();
      });

      it('applies a valid class', async () => {
        await textField.perform(el => expect(el.querySelector('[class*=isValid-]')).to.exist);
      });

      it('marks the field as valid', () => textField.is({ valid: true }));

      it('has no error message', () => textField.has({ error: undefined }));

      describe('then removing the text', () => {
        beforeEach(async () => {
          await textField.fillIn('');
          await textField.blur();
        });

        it('renders an error message', () => textField.has({ error: 'testField cannot be blank' }));
      });
    });
  });
});
