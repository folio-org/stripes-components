import _ from 'lodash';
import React from 'react';
import { FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';

import Button from '../../Button';
import EditableItem from './EditableItem';
import ItemEdit from './ItemEdit';

class EmbeddedListForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillMount() {
    const { itemTemplate, uniqueField } = this.props;
    this.visibleFields = Object.keys(itemTemplate)
      .filter(name => name != uniqueField);
  }

  toggleEdit(fields, index, editable) {
    const item = fields.get(index);
    fields.remove(index);
    item.editable = editable;
    fields.insert(index, item);
  }

  onAdd(fields) {
    const { uniqueField, itemTemplate } = this.props;
    const item = { editable: true };
    Object.keys(itemTemplate).forEach(key => item[key] = '');
    fields.unshift(item);
  }

  onCancel(fields, index) {
    const item = fields.get(index);
    if (item.id) {
      this.toggleEdit(fields, index, false);
    }
    else {
      fields.remove(index);
    }
  }

  onSave(fields, index) {
    const item = fields.get(index);
    this.toggleEdit(fields, index, false);
  }

  onEdit(fields, index) {
    this.toggleEdit(fields, index, true);
  }

  onDelete(fields, index) {
    fields.remove(index);
  }

  getVisibleFields() {
    const { itemTemplate, uniqueField } = this.props;
    return Object.keys(itemTemplate)
      .filter(name => name != uniqueField);
  }

  renderItems({ fields, itemTemplate, uniqueField, actionSuppression, label }) {
    return (
      <div>
        <Row between="xs">
          <Col xs><h3 style={{ marginTop: '0' }}>{label}</h3></Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button onClick={() => this.onAdd(fields)}>Add Item</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ul>
              {fields.map((field, index) => {
                return (
                  <li key={index}>
                    <EditableItem
                      field={field}
                      key={index}
                      item={fields.get(index)}
                      itemTemplate={itemTemplate}
                      uniqueField={uniqueField}
                      actionSuppression={actionSuppression}
                      visibleFields={this.visibleFields}
                      onCancel={() => this.onCancel(fields, index)}
                      onSave={() => this.onSave(fields, index)}
                      onEdit={() => this.onEdit(fields, index)}
                      onDelete={() => this.onDelete(fields, index)} />
                  </li>
                )
              })}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <FieldArray {...this.props} component={this.renderItems} />
    );
  }
}

EmbeddedListForm.propTypes = {
  initialValues: React.PropTypes.object,
  name: React.PropTypes.string,
};

EmbeddedListForm.defaultProps = {
  name: "items"
};

export default EmbeddedListForm;
