import React from 'react';

import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Button from '@folio/stripes-components/lib/Button';
import Layout from '@folio/stripes-components/lib/Layout';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Icon from '@folio/stripes-components/lib/Icon';

const propTypes = {
  addressObject: React.PropTypes.object,
  canEdit: React.PropTypes.bool,
  handleEdit: React.PropTypes.func,
  uiId: React.PropTypes.string,
  labelMap: React.PropTypes.object,
  visibleFields: React.PropTypes.array,
  headerFormatter: React.PropTypes.func,
  viewFormatters: React.PropTypes.object,
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
  labelMap: {
    addressLine1:'Address line 1',
    addressLine2:'Address line 2',
    stateRegion:'State/Province/Region',
    zipCode:'Zip/Postal Code'
  },
  headerFormatter: (address) => address.primary ?"Primary" : "Alternate",
};

function AddressView(props) {
  

  const { addressObject, canEdit, handleEdit, uiId, visibleFields, labelMap, headerFormatter } = props;
  
  let rowArray = [], groupArray=[];
  props.visibleFields.forEach((field, i) => {
 
    let fieldLabel = labelMap.hasOwnProperty(field) ? labelMap[field] : field;
    let fieldComponent = (<Col xs={4} key={`${fieldLabel}-${field}`} ><KeyValue label={fieldLabel} value={addressObject[field]} /></Col>);
    rowArray.push(fieldComponent);
   
   //3 fields per row...
    if(rowArray.length === 3 || i == visibleFields.length){
      groupArray.push(<Row key={i}>{rowArray}</Row>);
      rowArray = [];
    }
  }, this);
  
  return (
    <div className="AddressGroup" aria-label={addressObject.primary && "Primary address" || "Alternate address"} tabIndex="0" className="marginBottomHalf" data-group-id={uiId}>
      <Row>
      <Col xs={6}><h3 className="marginTop0">{headerFormatter(addressObject)}</h3></Col>
        <Col xs={6}>
          <Layout className="right" >
            {canEdit && <Button buttonStyle="secondary hollow" title="Edit this address" onClick={() => handleEdit(uiId)}><Icon icon="edit"/>Edit</Button>}
          </Layout>
        </Col>
      </Row>
      <Layout className="indent">
        {groupArray}
      </Layout>
    </div>
  );
};

AddressView.propTypes = propTypes;
AddressView.defaultProps = defaultProps;

export default AddressView;
