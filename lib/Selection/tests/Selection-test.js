import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Field, Form } from 'react-final-form';

import { mountWithContext } from '../../../tests/helpers';

import Selection from '../Selection';
import SelectionInteractor from './interactor';

describe('Selection', () => {
  const selection = new SelectionInteractor();

  describe('coupled to react-final-form', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
              name="testField"
              component={Selection}
              dataOptions={[
                { value: 'test', label: 'Hello World' }
              ]}
            />
          )}
        />
      );
    });

    it('renders the control', () => {
      expect(selection.controlPresent).to.be.true;
    });
  });
});
