import React from 'react';
import _ from 'lodash';

import { Field, reduxForm } from 'redux-form';
import Button from '../../../Button';
import Layout from '../../../Layout';
import Checkbox from '../../../Checkbox';
import TextField from '../../../TextField';
import { Row, Col } from '../../../LayoutGrid';

const propTypes = {
  addressObject: React.PropTypes.object,
  canDelete: React.PropTypes.bool,
  handleDelete: React.PropTypes.func,
  handleCancel: React.PropTypes.func,
  handleSubmit: React.PropTypes.func,
  uiId: React.PropTypes.string,
  labelMap: React.PropTypes.object,
  visibleFields: React.PropTypes.array,
  fieldComponents: React.PropTypes.object,
  headerComponent: React.PropTypes.func,
};

const defaultProps = {
  visibleFields: [
    'country',
    'addressLine1',
    'addressLine2',
    'city',
    'stateRegion',
    'zipCode',
    'addressType',
  ],
  fieldComponents: {
    country: TextField,
    addressLine1: TextField,
    addressLine2: TextField,
    city: TextField,
    stateRegion: TextField,
    zipCode: TextField,
    addressType: TextField,
  },
  labelMap: {
    addressLine1: 'Address line 1',
    addressLine2: 'Address line 2',
    stateRegion: 'State/Province/Region',
    zipCode: 'Zip/Postal Code',
    addressType: 'Address Type',
  },
  headerComponent: address => (
    <Field
      label="Primary Address"
      name="primaryAddress"
      type="checkbox"
      id={`PrimaryAddress---${address.id}`}
      component={Checkbox}
    />
  ),
};

// example validation for a required country field
//
// const validate = values => {
//  const errors = {};
//  if (values.country == "") {
//    errors.country = 'Required';
//  }
//
//  return errors;
// };

const AddressEdit = (props) => {
  const { addressObject, canDelete, uiId, handleSubmit, handleDelete, handleCancel, labelMap, visibleFields, headerComponent, fieldComponents } = props;
  const mergedFieldComponents = Object.assign(defaultProps.fieldComponents, fieldComponents);
  const groupArray = [];
  let rowArray = [];

  visibleFields.forEach((field, i) => {
    const fieldLabel = _.has(labelMap, field) ? labelMap[field] : field;
    const componentData = mergedFieldComponents[field];
    let component = componentData;
    let compProps = {};

    if (componentData.component) {
      component = componentData.component;
    }

    if (componentData.props) {
      compProps = componentData.props;
    }

    const fieldComponent = (<Col key={`col-${i}`} xs={4}><Field label={fieldLabel} name={field} {...compProps} component={component} /></Col>);
    rowArray.push(fieldComponent);

   // 3 fields per row...
    if (rowArray.length === 3 || i === visibleFields.length - 1) {
      groupArray.push(<Row key={`row-${i}`}>{rowArray}</Row>);
      rowArray = [];
    }
  }, this);

  return (
    <div>
      <form onSubmit={handleSubmit} id={`addressEdit-${uiId}`}>
        <Row>
          <Col xs={6}>{headerComponent(addressObject)}</Col>
        </Row>
        {groupArray}
        <Row>
          <Col xs={6}>
            <Field type="hidden" name="id" component="input" />
            <Field type="hidden" name="guiid" component="input" />
          </Col>
          <Col xs={6}>
            <Layout className="right marginTopHalf">
              { canDelete && <Button buttonStyle="primary marginBottom0" onClick={() => handleDelete(uiId)}>Remove this address</Button> }
              <Button buttonStyle="primary marginBottom0" type="submit">Save</Button>
              <Button buttonStyle="primary marginBottom0" onClick={() => handleCancel(uiId)}>Cancel</Button>
            </Layout>
          </Col>
        </Row>
      </form>
    </div>
  );
};

AddressEdit.propTypes = propTypes;
AddressEdit.defaultProps = defaultProps;

export default reduxForm({
  form: 'addressForm',
  // validate
})(AddressEdit);
