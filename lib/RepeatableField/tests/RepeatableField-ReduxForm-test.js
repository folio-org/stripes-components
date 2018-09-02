import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, FieldArray } from 'redux-form';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import RepeatableFieldInteractor from './interactor';

describe('RepeatableField with Redux Form', () => {
  const repeatableField = new RepeatableFieldInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <TestForm>
        <FieldArray
          addLabel="+ Add person"
          component={RepeatableField}
          emptyMessage="No Bluths."
          legend="Bluths"
          name="bananas"
          renderField={(field, index) => (
            <Field
              component={TextField}
              label="Name"
              name={`name[${index}]`}
            />
          )}
        />
      </TestForm>
    );
  });

  it('displays the legend', () => {
    expect(repeatableField.legend).to.equal('Bluths');
  });

  it('displays the empty message', () => {
    expect(repeatableField.emptyMessage).to.equal('No Bluths.');
  });

  it('displays an add button', () => {
    expect(repeatableField.hasAddButton).to.be.true;
  });

  it('does not have any items yet', () => {
    expect(repeatableField.items().length).to.equal(0);
  });

  describe('clicking the add button', () => {
    beforeEach(async () => {
      await repeatableField.clickAddButton();
    });

    it('has an item', () => {
      expect(repeatableField.items().length).to.equal(1);
    });

    describe('clicking the add button again', () => {
      beforeEach(async () => {
        await repeatableField.clickAddButton();
      });

      it('has two items', () => {
        expect(repeatableField.items().length).to.equal(2);
      });

      describe('clicking a remove button', () => {
        beforeEach(async () => {
          await repeatableField.items(1).clickRemoveButton();
        });

        it('has one item', () => {
          expect(repeatableField.items().length).to.equal(1);
        });
      });
    });

    describe('clicking a remove button', () => {
      beforeEach(async () => {
        await repeatableField.items(0).clickRemoveButton();
      });

      it('has no items', () => {
        expect(repeatableField.items().length).to.equal(0);
      });
    });
  });
});
