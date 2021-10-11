import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { Field } from 'redux-form';
import { Select as SelectInteractor, including } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import Select from '../Select';
// import SelectInteractor from './interactor';

describe('Select with ReduxForm', () => {
  const select = SelectInteractor('testField');

  describe('inputting a value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            label="testField"
            name="testField"
            component={Select}
            dataOptions={[
              { value: 'test0', label: 'Option 0' },
              { value: 'test1', label: 'Option 1' },
              { value: 'test2', label: 'Option 2' }
            ]}
          />
        </TestForm>
      );
    });

    it('renders a select element', () => {
      select.exists();
    });

    describe('changing the value', () => {
      beforeEach(async () => {
        await select.chooseAndBlur('Option 2');
      });

      it('applies a changed class', () => {
        select.has({ className: including('isChanged') });
      });
    });
  });

  describe('selecting an invalid value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            label="testField"
            name="testField"
            component={Select}
            dataOptions={[
              { value: 'test0', label: 'Option 0' },
              { value: 'valid', label: 'Option 1' },
              { value: 'invalid', label: 'Option 2' }
            ]}
            validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
          />
        </TestForm>
      );
    });

    beforeEach(async () => {
      await select.chooseAndBlur('Option 2');
    });

    it('applies an error style', () => {
      select.has({ className: including('error') });
    });

    it('renders an error message', () => {
      select.has({ error: 'testField is Invalid' });
    });
  });

  describe('selecting a valid value with validStylesEnabled', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            label="testField"
            name="testField"
            component={Select}
            validStylesEnabled
            dataOptions={[
              { value: 'test0', label: 'Option 0' },
              { value: 'valid', label: 'Option 1' },
              { value: 'invalid', label: 'Option 2' }
            ]}
            validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
          />
        </TestForm>
      );
    });

    beforeEach(async () => {
      await select.chooseAndBlur('Option 1');
    });

    it('applies a valid class', () => {
      select.has({ className: including('valid') });
    });
  });
});
