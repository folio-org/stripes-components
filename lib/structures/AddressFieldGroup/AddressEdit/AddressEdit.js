import React from 'react';
import _ from 'lodash';
import { Field, reduxForm } from 'redux-form';
import { connect} from 'react-redux';
import { compose } from 'redux';

import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Button from '@folio/stripes-components/lib/Button';
import Layout from '@folio/stripes-components/lib/Layout';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import TextField from '@folio/stripes-components/lib/TextField';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';


const propTypes = {
  form: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  addressObject: React.PropTypes.object,
  canDelete: React.PropTypes.bool,
  handleDelete: React.PropTypes.func,
  handleCancel: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  uiId: React.PropTypes.string,
  labelMap: React.PropTypes.object,
  visibleFields: React.PropTypes.array,
  headerField: React.PropTypes.node,
  fieldComponents: React.PropTypes.object,
  headerComponent: React.PropTypes.func,
};

const defaultProps = {
  headerField: 'primary',
  visibleFields: [
    'country',
    'addressLine1',
    'addressLine2',
    'city',
    'stateRegion',
    'zipCode' 
  ],
  fieldComponents: {
    country: TextField,
    addressLine1: TextField,
    addressLine2: TextField,
    city: TextField,
    stateRegion: TextField,
    zipCode: TextField,
  },
  labelMap: {
    addressLine1:'Address line 1',
    addressLine2:'Address line 2',
    stateRegion:'State/Province/Region',
    zipCode:'Zip/Postal Code'
  },
  headerComponent: (address) => (
    <Field 
      label="Primary Address" 
      name="primary" 
      checked={address.primary} 
      labelStyle="labelSize1" 
      id={`PrimaryAddress---${address.id}`} 
      component={Checkbox}
    />
  ),
};

//example validation for a required country field
//
//const validate = values => {
//  const errors = {};
//  if (values.country == "") {
//    errors.country = 'Required';
//  } 
//  
//  return errors;
//};


let AddressEdit = (props) => {
  
  const { addressObject, canDelete, uiId, handleSubmit, handleDelete, handleCancel, labelMap, visibleFields, typeMap, headerField, headerComponent, fieldComponents } = props;
  
  const mergedFieldComponents = Object.assign(defaultProps.fieldComponents, fieldComponents);
  
  let rowArray = [], groupArray=[];
  visibleFields.forEach((field, i) => {
 
    let fieldLabel = labelMap.hasOwnProperty(field) ? labelMap[field] : field;
    let fieldComponent = (<Col xs={4}><Field label={fieldLabel} name={field} component={mergedFieldComponents[field]} /></Col>);
    rowArray.push(fieldComponent);
   
   //3 fields per row...
    if(rowArray.length === 3 || i == visibleFields.length){
      groupArray.push(<Row>{rowArray}</Row>);
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
}

AddressEdit.propTypes= propTypes;
AddressEdit.defaultProps = defaultProps;

AddressEdit = reduxForm({
  form: 'addressForm',
  //validate
})(AddressEdit);

export default AddressEdit;
