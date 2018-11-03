import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, Form } from 'react-final-form';
import { mountWithContext } from '../../../tests/helpers';
import TextField from '../TextField';
import TextFieldInteractor from './interactor';

describe('TextField with Final Form', () => {
  const textfield = new TextFieldInteractor();

  describe('using with final-form', () => {
    describe('inputting a value', () => {
      let fieldCleared = false;

      beforeEach(async () => {
        await mountWithContext(
          <Form
            onSubmit={() => {}}
            render={() => (
              <Field
                name="testField"
                component={TextField}
                clearFieldId="clearField"
                onClearField={() => { fieldCleared = true; }}
              />
            )}
          />
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
          <Form
            onSubmit={() => {}}
            render={() => (
              <Field
                name="testField"
                component={TextField}
                validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
              />
            )}
          />
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
          <Form
            onSubmit={() => {}}
            render={() => (
              <Field
                name="testField"
                component={TextField}
                validStylesEnabled
                validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
              />
            )}
          />
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
  });
});
