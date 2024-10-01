import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Field } from 'redux-form';
import {
  Selection as SelectionInteractor,
  Button,
  TextInput,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';

import Selection from '../Selection';

describe('Selection', () => {
  const selection = SelectionInteractor('testSelection');
  describe('coupled to redux-form', () => {
    beforeEach(async () => {
      const validate = () => 'there\'s a problem!'
      await mountWithContext(
        <TestForm>
          <Field
            label="testSelection"
            name="testField"
            component={Selection}
            dataOptions={[
              { value: 'test', label: 'Hello World' },
              { value: 'test2', label: 'Hello World2' }
            ]}
            validate={validate}
          />
          <Field component="input" name="testText" />
        </TestForm>
      );
      await selection.focus();
    });

    it('renders the control', () => selection.exists());

    it('renders the name attribute', () => selection.has({ name: 'testField' }));

    it('focuses the button', () => Button({ focused: true }).exists());

    describe('using the control', () => {
      beforeEach(async () => {
        await selection.choose('Hello World');
      });

      it('sets the chosen label in the control field', () => selection.has({ singleValue: 'Hello World' }));

      describe('after using the control', () => {
        beforeEach(async () => {
          await TextInput().focus();
        });

        it('displays redux-form validation', () => selection.has({ error: 'there\'s a problem!' }));

        it('retains the selected value in the field', () => selection.has({ singleValue: 'Hello World' }));
      });
    });
  });
});
