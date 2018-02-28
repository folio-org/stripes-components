import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';

import KeyValue from '../../../KeyValue';
import LayoutHeader from '../../../LayoutHeader';
import { Row, Col } from '../../../LayoutGrid';
import css from './AddressView.css';

const propTypes = {
  addressObject: PropTypes.object,
  canEdit: PropTypes.bool,
  handleEdit: PropTypes.func,
  uiId: PropTypes.string,
  labelMap: PropTypes.object,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  headerFormatter: PropTypes.func,
  headerField: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
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
    stateRegion: 'State/Prov./Region',
    zipCode: 'Zip/Postal Code',
    addressType: 'Address Type',
    city: 'City',
    country: 'Country',
  },
  headerFormatter: address => (address.primaryAddress ? 'Primary' : 'Alternate'),
};

function AddressView(props) {
  const { addressObject, canEdit, handleEdit, uiId, visibleFields, labelMap, headerFormatter } = props;
  const groupArray = [];
  let rowArray = [];

  props.visibleFields.forEach((field, i) => {
    const fieldLabel = has(labelMap, field) ? labelMap[field] : field;
    const fieldComponent = (<Col xs={3} key={`${fieldLabel}-${field}`} ><KeyValue label={fieldLabel} value={addressObject[field]} /></Col>);
    rowArray.push(fieldComponent);

    // 3 fields per row...
    if (rowArray.length === 4 || i === visibleFields.length - 1) {
      groupArray.push(<Row key={i}>{rowArray}</Row>);
      rowArray = [];
    }
  }, this);

  const actions = [{ title: 'Edit this address', icon: 'edit', handler: () => handleEdit(uiId) }];

  return (
    <div className={css.addressItem} aria-label={(addressObject.primaryAddress && 'Primary address') || 'Alternate address'} tabIndex="0" role="tabpanel" data-group-id={uiId}>
      <LayoutHeader level={5} title={headerFormatter(addressObject)} actions={actions} noActions={!canEdit} />
      <div className={css.addressItemContent}>
        {groupArray}
      </div>
    </div>
  );
}

AddressView.propTypes = propTypes;
AddressView.defaultProps = defaultProps;

export default AddressView;
