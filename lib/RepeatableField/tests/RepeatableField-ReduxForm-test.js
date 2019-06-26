import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, FieldArray } from 'redux-form';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import RepeatableField from '../RepeatableField';
import Headline from '../../Headline';
import TextField from '../../TextField';
import RepeatableFieldInteractor from './interactor';

describe('RepeatableField with Redux Form', () => {
  const repeatableField = new RepeatableFieldInteractor();

  const ReduxFormExample = props => (
    <TestForm>
      <FieldArray
        addLabel="+ Add person"
        component={RepeatableField}
        emptyMessage="No Bluths."
        legend={<Headline size="large">Bluths</Headline>}
        name="bananas"
        renderField={(field, index) => (
          <Field
            component={TextField}
            label="Name"
            name={`name[${index}]`}
          />
        )}
        {...props}
      />
    </TestForm>
  );

  beforeEach(async () => {
    await mountWithContext(
      <ReduxFormExample />
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

  describe('when the "onRemove"-prop is false', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ReduxFormExample
          onRemove={false}
        />
      );
      await repeatableField.clickAddButton();
    });
    it('should not render a remove button', () => {
      expect(repeatableField.items(0).hasRemoveButton).to.be.false;
    });
  });

  describe('when custom "onRemove" and "onAdd" callbacks are passed', () => {
    let customOnRemove = false;
    let customOnAdd = false;
    beforeEach(async () => {
      await mountWithContext(
        <ReduxFormExample
          onAdd={(fields) => {
            fields.push('');
            customOnAdd = true;
          }}
          onRemove={() => {
            customOnRemove = true;
          }}
        />
      );
      await repeatableField.clickAddButton();
      await repeatableField.items(0).clickRemoveButton();
    });

    it('should call the custom "onAdd"-callback when the "add new" button is clicked', () => {
      expect(customOnAdd).to.be.true;
    });

    it('should call the custom "onRemove"-callback when the remove button is clicked', () => {
      expect(customOnRemove).to.be.true;
    });
  });
});
