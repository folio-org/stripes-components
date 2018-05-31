import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { has } from 'lodash';

import KeyValue from '../../KeyValue';
import LayoutHeader from '../../LayoutHeader';
import { Row, Col } from '../../LayoutGrid';
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
  headerFormatter: address => (address.primaryAddress ? 'Primary' : 'Alternate'),
};

const contextTypes = {
  intl: intlShape
};

function AddressView(props, context) {
  const { addressObject, canEdit, handleEdit, uiId, visibleFields, headerFormatter } = props;
  const formatMsg = context.intl.formatMessage;
  const defaultLabelMap = {
    addressLine1: formatMsg({ id: 'stripes-components.addressLine1' }),
    addressLine2: formatMsg({ id: 'stripes-components.addressLine2' }),
    stateRegion: formatMsg({ id: 'stripes-components.stateProviceOrRegion' }),
    zipCode: formatMsg({ id: 'stripes-components.zipOrPostalCode' }),
    addressType: formatMsg({ id: 'stripes-components.addressType' }),
    city: formatMsg({ id: 'stripes-components.city' }),
    country: formatMsg({ id: 'stripes-components.country' }),
  };
  const labelMap = props.labelMap || defaultLabelMap;
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

  const actions = [{ title: formatMsg({ id: 'stripes-components.editThisAddress' }), icon: 'edit', handler: () => handleEdit(uiId) }];
  const primaryAddressMsg = formatMsg({ id: 'stripes-components.primaryAddress' });
  const alternateAddressMsg = formatMsg({ id: 'stripes-components.alternateAddress' });

  return (
    <div className={css.addressItem} aria-label={(addressObject.primaryAddress && primaryAddressMsg) || alternateAddressMsg} tabIndex="0" role="tabpanel" data-group-id={uiId}>
      <LayoutHeader level={5} title={headerFormatter(addressObject)} actions={actions} noActions={!canEdit} />
      <div className={css.addressItemContent}>
        {groupArray}
      </div>
    </div>
  );
}

AddressView.propTypes = propTypes;
AddressView.defaultProps = defaultProps;
AddressView.contextTypes = contextTypes;

export default AddressView;
