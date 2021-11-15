import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { Field } from 'redux-form';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';

import Selection from '../Selection';
import SelectionInteractor from './interactor';

describe('Selection', () => {
  const selection = new SelectionInteractor();

  describe('coupled to redux-form', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="testField"
            component={Selection}
            dataOptions={[
              { value: 'test', label: 'Hello World' }
            ]}
          />
        </TestForm>
      );
    });

    it('renders the control', () => {
      expect(selection.controlPresent).to.be.true;
    });
  });
});
