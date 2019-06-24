import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { FieldArray, Field } from 'redux-form';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import RepeatableFieldInteractor from './interactor';

describe('RepeatableField', () => {
  const repeatableField = new RepeatableFieldInteractor();

  class RepeatableFieldDemo extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: []
      };
    }

    handleAdd = () => {
      this.setState(({ fields }) => ({
        fields: fields.concat({})
      }));
    }

    handleRemove = (index) => {
      this.setState(({ fields }) => ({
        fields: [...fields.slice(0, index), ...fields.slice(index + 1)]
      }));
    }

    render() {
      const { fields } = this.state;
      return (
        <RepeatableField
          id="my-id"
          addLabel="+ Add person"
          emptyMessage="No Bluths."
          fields={fields}
          legend="Bluths"
          onAdd={this.handleAdd}
          onRemove={this.handleRemove}
          renderField={() => (
            <TextField
              label="Name"
            />
          )}
          {...this.props}
        />
      );
    }
  }

  beforeEach(async () => {
    await mountWithContext(
      <RepeatableFieldDemo />
    );
  });

  it('has an ID', () => {
    expect(repeatableField.id).to.equal('my-id');
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

  it('add button has an ID', () => {
    expect(repeatableField.addButtonId).to.equal('my-id-add-button');
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

  describe('Add button with canAdd=false property', () => {
    beforeEach(async () => {
      await mountWithContext(
        <RepeatableFieldDemo canAdd={false} />
      );
      await repeatableField.clickAddButton();
    });

    it('should be disabled', () => {
      expect(repeatableField.isAddDisabled).to.be.true;
      expect(repeatableField.items().length).to.equal(0);
    });
  });

  describe('Remove button with canRemove=false property', () => {
    beforeEach(async () => {
      await mountWithContext(
        <RepeatableFieldDemo canRemove={false} />
      );
      await repeatableField.clickAddButton();
      await repeatableField.items(0).clickRemoveButton();
    });

    it('should be disabled', () => {
      expect(repeatableField.items(0).isRemoveDisabled).to.be.true;
      expect(repeatableField.items().length).to.equal(1);
    });
  });

  /**
   * Redux
   */
  describe('when used within a redux-form', () => {
    const ReduxFormExample = (props) => (
      <TestForm>
        <FieldArray
          name="authors"
          addLabel="Add author"
          component={RepeatableField}
          renderField={() => (
            <Field
              name="author"
              component={TextField}
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

    describe('when the "add new" button is clicked', () => {
      beforeEach(async () => {
        await repeatableField.clickAddButton();
      });
      it('has one item', () => {
        expect(repeatableField.items().length).to.equal(1);
      });
    });

    describe('when the "remove" button is clicked', () => {
      beforeEach(async () => {
        await repeatableField.clickAddButton();
        await repeatableField.items(0).clickRemoveButton();
      });
      it('has zero items', () => {
        expect(repeatableField.items().length).to.equal(0);
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
});
