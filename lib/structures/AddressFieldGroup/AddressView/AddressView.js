import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import KeyValue from '../../../KeyValue';
import Button from '../../../Button';
import Layout from '../../../Layout';
import { Row, Col } from '../../../LayoutGrid';
import Icon from '../../../Icon';

const propTypes = {
  addressObject: PropTypes.object,
  canEdit: PropTypes.bool,
  handleEdit: PropTypes.func,
  uiId: PropTypes.string,
  labelMap: PropTypes.object,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  headerFormatter: PropTypes.func,
};

const defaultProps = {
  headerField: 'primaryAddress',
  visibleFields: [
    'addressType',
    'addressLine1',
    'addressLine2',
    'city',
    'stateRegion',
    'zipCode',
    'country',
  ],
  labelMap: {
    addressLine1: 'Address line 1',
    addressLine2: 'Address line 2',
    stateRegion: 'State/Province/Region',
    zipCode: 'Zip/Postal Code',
    addressType: 'Address Type',
  },
  headerFormatter: address => (address.primaryAddress ? 'Primary' : 'Alternate'),
};

function AddressView(props) {
  const { addressObject, canEdit, handleEdit, uiId, visibleFields, labelMap, headerFormatter } = props;
  const groupArray = [];
  let rowArray = [];

  props.visibleFields.forEach((field, i) => {
    const fieldLabel = _.has(labelMap, field) ? labelMap[field] : field;
    const fieldComponent = (<Col xs={3} key={`${fieldLabel}-${field}`} ><KeyValue label={fieldLabel} value={addressObject[field]} /></Col>);
    rowArray.push(fieldComponent);

    // 3 fields per row...
    if (rowArray.length === 4 || i === visibleFields.length - 1) {
      groupArray.push(<Row key={i}>{rowArray}</Row>);
      rowArray = [];
    }
  }, this);

  return (
    <div className="AddressGroup marginBottomHalf" aria-label={(addressObject.primaryAddress && 'Primary address') || 'Alternate address'} tabIndex="0" role="tabpanel" data-group-id={uiId}>
      <Row>
        <Col xs={6}><h3 className="marginTop0">{headerFormatter(addressObject)}</h3></Col>
        <Col xs={6}>
          <Layout className="right">
            {canEdit && <Button buttonStyle="secondary hollow" title="Edit this address" onClick={() => handleEdit(uiId)}><Icon icon="edit" />Edit</Button>}
          </Layout>
        </Col>
      </Row>
      <Layout className="indent">
        {groupArray}
      </Layout>
    </div>
  );
}

AddressView.propTypes = propTypes;
AddressView.defaultProps = defaultProps;

export default AddressView;
