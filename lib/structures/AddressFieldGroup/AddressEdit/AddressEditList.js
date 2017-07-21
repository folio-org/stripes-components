/*
*   Component for editing a list of addresses in the midst of a form.
*/
import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form'; // eslint-disable-line
import { Row, Col } from 'react-flexbox-grid';
import EmbeddedAddressForm from './EmbeddedAddressForm';
import css from './AddressEdit.css';
import Button from '../../../Button';


const propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

const defaultProps = {
  label: 'Addresses',
};

class AddressEditList extends React.Component {
  constructor(props) {
    super(props);

    this.renderFieldGroups = this.renderFieldGroups.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onAdd(fields) {
    fields.push({});
    if (this.props.onAdd) {
      this.props.onAdd(fields.length - 1);
    }
  }

  onDelete(fields, index) {
    fields.remove(index);
    if (this.props.onDelete) {
      this.props.onDelete(index);
    }
  }

  renderFieldGroups({ fields }) {
    return (
      <div className={css.root}>
        <Row>
          <Col xs={8} sm={8}>
            <div className={css.legend}>{this.props.label}</div>
          </Col>
          <Col xs={4} sm={4}>
            <Button type="button" buttonStyle="fullWidth secondary" onClick={() => { this.onAdd(fields); }}>+ Add another address</Button>
          </Col>
        </Row>
        {fields.length === 0 &&
          <div><em>- No addresses stored -</em></div>
        }
        {fields.map((fieldName, i) =>
          <div key={i} className={css.addressSlab} style={{ width: '100%' }}>
            <EmbeddedAddressForm fieldKey={i} addressFieldName={fieldName} handleDelete={(index) => { this.onDelete(fields, index); }} {...this.props} />
          </div>,
        )}
      </div>
    );
  }

  render() {
    console.log('!!!!!!!!!!!', this.props.name, this.props);
    return (
      <FieldArray name={this.props.name} component={this.renderFieldGroups} />
    );
  }
}

AddressEditList.propTypes = propTypes;
AddressEditList.defaultProps = defaultProps;

export default AddressEditList;
