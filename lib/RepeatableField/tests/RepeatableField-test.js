import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { RepeatableField as Interactor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import { Col, Row } from '../../LayoutGrid';
import Button from '../../Button';

describe('RepeatableField', () => {
  const repeatableField = Interactor('Bluths');

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

  it('has an ID', async () => {
    await repeatableField.has({ id: 'my-id' });
  });

  it('displays the legend', async () => {
    await repeatableField.exists();
  });

  it('displays the empty message', async () => {
    await repeatableField.has({ emptyMessage: 'No Bluths.' });
  });

  it('displays an add button', async () => {
    await repeatableField.has({ addButton: true });
  });

  it('add button has an ID', async () => {
    await repeatableField.has({ addButtonId: 'my-id-add-button' });
  });

  it('does not have any items yet', async () => {
    await repeatableField.has({ itemCount: 0 });
  });

  describe('clicking the add button', () => {
    beforeEach(async () => {
      await repeatableField.clickAddButton();
    });

    it('has an item', async () => {
      await repeatableField.has({ itemCount: 1 });
    });

    describe('clicking the add button again', () => {
      beforeEach(async () => {
        await repeatableField.clickAddButton();
      });

      it('has two items', async () => {
        await repeatableField.has({ itemCount: 2 });
      });

      describe('clicking a remove button', () => {
        beforeEach(async () => {
          await repeatableField.clickRemoveButton(1);
        });

        it('has one item', async () => {
          await repeatableField.has({ itemCount: 1 });
        });
      });
    });

    describe('clicking a remove button', () => {
      beforeEach(async () => {
        await repeatableField.clickRemoveButton(0);
      });

      it('has no items', async () => {
        await repeatableField.has({ itemCount: 0 });
      });
    });
  });

  describe('Add button with canAdd=false property', () => {
    beforeEach(async () => {
      await mountWithContext(
        <RepeatableFieldDemo canAdd={false} />
      );
    });

    it('should be disabled', async () => {
      await repeatableField.has({ addDisabled: true });
    });
  });

  describe('Remove button with canRemove=false property', async () => {
    beforeEach(async () => {
      await mountWithContext(
        <RepeatableFieldDemo canRemove={false} />
      );
      await repeatableField.clickAddButton();
    });

    it('should be disabled', async () => {
      await repeatableField.has({ removeDisabled: true });
      await repeatableField.has({ itemCount: 1 });
    });
  });

  describe('heading field labels', async () => {
    beforeEach(async () => {
      const headLabels = <div>heading field labels</div>;

      await mountWithContext(
        <RepeatableFieldDemo headLabels={headLabels} />
      );
      await repeatableField.clickAddButton();
    });

    it('should be rendered when headLabels prop is defined', async () => {
      await repeatableField.has({ headLabels: true });
    });
  });

  describe('heading field labels with custom delete button', () => {
    beforeEach(async () => {
      const headLabels = (
        <Row>
          <Col xs>
            colname1
          </Col>
          <Col xs>
            colname2
          </Col>
          <Col xs />
        </Row>
      );

      await mountWithContext(
        <RepeatableFieldDemo
          headLabels={headLabels}
          onRemove={() => {}}
          renderField={() => (
            <Row>
              <Col xs>
                <TextField
                  label="Name"
                />
              </Col>
              <Col xs>
                <TextField
                  label="Name 2"
                  value="test"
                />
              </Col>
              <Col xs>
                <Button>
                  remove
                </Button>
              </Col>
            </Row>
          )}
        />
      );
      await repeatableField.clickAddButton();
    });

    it('should be rendered when headLabels prop is defined', async () => {
      await repeatableField.has({ headLabels: true });
    });
  });
});
