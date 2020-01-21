import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mountWithContext } from '../../../tests/helpers';
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

  describe('heading field labels', () => {
    beforeEach(async () => {
      const headLabels = <div>heading field labels</div>;

      await mountWithContext(
        <RepeatableFieldDemo headLabels={headLabels} />
      );
      await repeatableField.clickAddButton();
    });

    it('should be rendered when headLabels prop is defined', () => {
      expect(repeatableField.isHeadLabelsPresent).to.be.true;
    });
  });
});
