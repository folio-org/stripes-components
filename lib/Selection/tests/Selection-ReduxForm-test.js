import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Field } from 'redux-form';
import { Selection as SelectionInteractor } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';

import Selection from '../Selection';

describe('Selection', () => {
  const selection = SelectionInteractor('testSelection');

  describe('coupled to redux-form', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            label="testSelection"
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
      selection.exists();
    });
  });
});
