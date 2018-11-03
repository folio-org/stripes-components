import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, Form } from 'react-final-form';
import { mountWithContext } from '../../../tests/helpers';
import Select from '../Select';
import SelectInteractor from './interactor';

describe('Select with React Final Form', () => {
  const select = new SelectInteractor();

  describe('inputting a value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
              name="testField"
              component={Select}
              dataOptions={[
                { value: 'test0', label: 'Option 0' },
                { value: 'test1', label: 'Option 1' },
                { value: 'test2', label: 'Option 2' }
              ]}
            />
          )}
        />
      );
    });

    it('renders a select element', () => {
      expect(select.hasSelect).to.be.true;
    });

    describe('changing the value', () => {
      beforeEach(async () => {
        await select.selectOption('Option 2')
          .focusSelect();
      });

      it('applies a changed class', () => {
        expect(select.hasChangedStyle).to.be.true;
      });
    });
  });

  describe('selecting an invalid value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
              name="testField"
              component={Select}
              dataOptions={[
                { value: 'test0', label: 'Option 0' },
                { value: 'valid', label: 'Option 1' },
                { value: 'invalid', label: 'Option 2' }
              ]}
              validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
            />
          )}
        />
      );
    });

    beforeEach(async () => {
      await select.selectAndBlur('Option 2');
    });

    it('applies an error style', () => {
      expect(select.hasErrorStyle).to.be.true;
    });

    it('renders an error message', () => {
      expect(select.errorText).to.equal('testField is Invalid');
    });
  });

  describe('selecting a valid value with validStylesEnabled', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
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
          )}
        />
      );
    });

    beforeEach(async () => {
      await select.selectAndBlur('Option 1');
    });

    it('applies a valid class', () => {
      expect(select.hasValidStyle).to.be.true;
    });
  });
});
