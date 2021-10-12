import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { TextField as TextFieldInteractor, including } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import TextField from '../TextField';


describe('TextField with ReduxForm', () => {
  const textfield = TextFieldInteractor('testField');

  describe('using with redux-form', () => {
    describe('inputting a value', () => {
      let fieldCleared = false;

      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              label="testField"
              name="testField"
              component={TextField}
              clearFieldId="clearField"
              onClearField={() => { fieldCleared = true; }}
            />
          </TestForm>
        );
      });

      describe('changing the value', () => {
        beforeEach(async () => {
          await textfield.fillIn('anything');
          textfield.focus();
        });

        it('applies a changed class', () => {
          textfield.has({ className: including('changed') });
        });

        it('renders a clear button', () => {
          textfield.has({ clearButton: true });
        });

        describe('clicking the clear button', () => {
          beforeEach(async () => {
            await textfield.clear();
            textfield.blur();
          });

          it('clears the field', () => {
            textfield.has({ value: '' });
          });

          it('fires the onClearField event', () => {
            expect(fieldCleared).to.be.true;
          });
        });
      });
    });

    describe('inputting an invalid value', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              label="testField"
              name="testField"
              component={TextField}
              validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textfield.fillIn('invalid');
      });

      it('renders an error message', () => {
        textfield.has({ error: 'testField is Invalid' });
      });
    });

    describe('inputting a valid value with validStylesEnabled', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              label="testField"
              name="testField"
              component={TextField}
              validStylesEnabled
              validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textfield.fillIn('valid');
      });

      it('applies a valid class', () => {
        textfield.has({ className: including('valid') });
      });

      describe('then removing the text', () => {
        beforeEach(async () => {
          await textfield.fillIn('');
        });

        it('renders an error message', () => {
          textfield.has({ error: 'testField cannot be blank' });
        });
      });
    });
  });
});
