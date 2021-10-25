import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, FieldArray } from 'redux-form';
import { RepeatableField as RepeatableFieldInteractor, RepeatableFieldAddButton, RepeatableFieldRemoveButton } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import RepeatableField from '../RepeatableField';
import Headline from '../../Headline';
import TextField from '../../TextField';

describe('RepeatableField with Redux Form', () => {
  const repeatableField = RepeatableFieldInteractor('Bluths');

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
    repeatableField.exists();
  });

  it('displays the empty message', () => {
    repeatableField.has({ emptyMessage: 'No Bluths' });
  });

  it('displays an add button', () => {
    RepeatableFieldAddButton().exists();
  });

  it('does not have any items yet', () => {
    repeatableField.has({ itemCount: 0 });
  });

  describe('clicking the add button', () => {
    beforeEach(async () => {
      await repeatableField.clickAdd();
    });

    it('has an item', () => {
      repeatableField.has({ itemCount: 1 });
    });

    describe('clicking the add button again', () => {
      beforeEach(async () => {
        await repeatableField.clickAdd();
      });

      it('has two items', () => {
        repeatableField.has({ itemCount: 2 });
      });

      describe('clicking a remove button', () => {
        beforeEach(async () => {
          await repeatableField.clickRemove(1);
        });

        it('has one item', () => {
          repeatableField.has({ itemCount: 1 });
        });
      });
    });

    describe('clicking a remove button', () => {
      beforeEach(async () => {
        await repeatableField.clickRemove(0);
      });

      it('has no items', () => {
        repeatableField.has({ itemCount: 0 });
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
      await repeatableField.clickAdd();
    });
    it('should not render a remove button', () => {
      RepeatableFieldRemoveButton().absent();
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
      await repeatableField.clickAdd();
      await repeatableField.clickRemove(0);
    });

    it('should call the custom "onAdd"-callback when the "add new" button is clicked', () => {
      expect(customOnAdd).to.be.true;
    });

    it('should call the custom "onRemove"-callback when the remove button is clicked', () => {
      expect(customOnRemove).to.be.true;
    });
  });
});
