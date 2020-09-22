import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Field } from 'redux-form';

import KeyValueInteractor from '../../KeyValue/tests/interactor';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import TextField from '../TextField';
import TextFieldInteractor from './interactor';

describe('TextField with ReduxForm', () => {
  const textfield = new TextFieldInteractor();
  const fieldNonInteractive = new KeyValueInteractor();

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

      it('should render the TextField normally', () => {
        expect(textfield.type).to.equal('text');
      });

      describe('changing the value', () => {
        beforeEach(async () => {
          await textfield.fillInput('anything')
            .focusInput();
        });

        it('applies a changed class', () => {
          expect(textfield.hasChangedStyle).to.be.true;
        });

        it('renders a clear button', () => {
          expect(textfield.hasClearButton).to.be.true;
        });

        describe('clicking the clear button', () => {
          beforeEach(async () => {
            await textfield
              .clickClearButton()
              .blurInput();
          });

          it('clears the field', () => {
            expect(textfield.val).to.equal('');
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
              name="testField"
              component={TextField}
              validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textfield.fillAndBlur('invalid');
      });

      it('renders an error message', () => {
        expect(textfield.inputError).to.be.true;
      });
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
        await textfield.fillAndBlur('valid');
      });

      it('applies a valid class', () => {
        expect(textfield.hasValidStyle).to.be.true;
      });

      describe('then removing the text', () => {
        beforeEach(async () => {
          await textfield.fillAndBlur('');
        });

        it('renders an error message', () => {
          expect(textfield.inputError).to.be.true;
        });
      });
    });

    describe('Non-interactive mode', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm initialValues={{ testField: 'test value' }}>
            <Field
              name="testField"
              component={TextField}
              label="test label"
              isNonInteractive
            />
          </TestForm>
        );
      });

      it('should render the TextField as KeyValue', () => {
        expect(fieldNonInteractive.label.text).to.equal('test label');
        expect(fieldNonInteractive.value.text).to.equal('test value');
      });
    });
  });
});
