import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { TextArea as Interactor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import TextArea from '../TextArea';

describe('TextArea with ReduxForm', () => {
  const textArea = Interactor();

  describe('inputting a value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="testField"
            component={TextArea}
          />
        </TestForm>
      );
    });

    describe('changing the value', () => {
      beforeEach(async () => {
        await textArea.fillIn('anything');
        await textArea.blur();
      });

      it('applies a changed class', async () => {
        await textArea.perform(el => expect(el.querySelector('[class*=isChanged-]')).to.exist);
      });
    });
  });

  describe('inputting an invalid value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="testField"
            component={TextArea}
            validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
          />
        </TestForm>
      );
    });

    beforeEach(async () => {
      await textArea.fillIn('invalid');
      await textArea.blur();
    });

    it('marks the field as invalid', () => textArea.is({ valid: false }));

    it('renders an error message', () => textArea.has({ error: 'testField is Invalid' }));
  });

  describe('inputting an valid value with validStylesEnabled', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="testField"
            component={TextArea}
            validStylesEnabled
            validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
          />
        </TestForm>
      );
    });

    beforeEach(async () => {
      await textArea.fillIn('valid');
      await textArea.blur();
    });

    it('applies a valid class', async () => {
      await textArea.perform(el => expect(el.querySelector('[class*=isValid-]')).to.exist);
    });

    it('marks the field as valid', () => textArea.is({ valid: true }));

    describe('then removing the text', () => {
      beforeEach(async () => {
        await textArea.fillIn('');
        await textArea.blur();
      });

      it('renders an error message', () => textArea.has({ error: 'testField cannot be blank' }));
    });
  });
});
