import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { HTML, RepeatableField as Interactor, RepeatableFieldAddButton, runAxeTest } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import { Col, Row } from '../../LayoutGrid';
import Button from '../../Button';

const headingLabelInteractor = HTML.extend('heading labels')
  .selector('[data-test-repeatable-field-list-item-labels]');

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

  it('contains no axe errors - RepeatableField', runAxeTest);

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
    await RepeatableFieldAddButton().exists();
  });

  it('add button has an ID', async () => {
    await RepeatableFieldAddButton().has({ id: 'my-id-add-button' });
  });

  it('does not have any items yet', async () => {
    await repeatableField.has({ itemCount: 0 });
  });

  describe('clicking the add button', () => {
    beforeEach(async () => {
      await repeatableField.clickAdd();
    });

    it('contains no axe errors - RepeatableField: add item', runAxeTest);

    it('has an item', async () => {
      await repeatableField.has({ itemCount: 1 });
    });

    describe('clicking the add button again', () => {
      beforeEach(async () => {
        await repeatableField.clickAdd();
      });

      it('has two items', async () => {
        await repeatableField.has({ itemCount: 2 });
      });

      it('contains no axe errors - RepeatableField: add 2nd item', runAxeTest);

      describe('clicking a remove button', () => {
        beforeEach(async () => {
          await repeatableField.clickRemove(1);
        });

        it('has one item', async () => {
          await repeatableField.has({ itemCount: 1 });
        });
      });
    });

    describe('clicking a remove button', () => {
      beforeEach(async () => {
        await repeatableField.clickRemove(0);
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
      await repeatableField.clickAdd();
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
      await repeatableField.clickAdd();
    });

    it('should be rendered when headLabels prop is defined', async () => {
      await headingLabelInteractor().exists();
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
      await repeatableField.clickAdd();
    });

    it('should be rendered when headLabels prop is defined', async () => {
      await headingLabelInteractor().exists();
    });
  });
});
