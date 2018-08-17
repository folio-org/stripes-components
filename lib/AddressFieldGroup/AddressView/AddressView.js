import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { has } from 'lodash';

import injectIntl from '../../InjectIntl';
import KeyValue from '../../KeyValue';
import LayoutHeader from '../../LayoutHeader';
import { Row, Col } from '../../LayoutGrid';
import css from './AddressView.css';

const propTypes = {
  addressObject: PropTypes.object,
  canEdit: PropTypes.bool,
  handleEdit: PropTypes.func,
  headerField: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  headerFormatter: PropTypes.func,
  intl: intlShape.isRequired,
  labelMap: PropTypes.object,
  uiId: PropTypes.string,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  headerField: 'primaryAddress',
  headerFormatter: address => (address.primaryAddress ? 'Primary' : 'Alternate'),
  visibleFields: [
    'addressType',
    'addressLine1',
    'addressLine2',
    'city',
    'stateRegion',
    'zipCode',
    'country',
  ],
};

function AddressView(props) {
  const {
    addressObject,
    canEdit,
    handleEdit,
    uiId,
    visibleFields,
    headerFormatter,
    intl
  } = props;

  const defaultLabelMap = {
    addressLine1: intl.formatMessage({ id: 'stripes-components.addressLine1' }),
    addressLine2: intl.formatMessage({ id: 'stripes-components.addressLine2' }),
    stateRegion: intl.formatMessage({ id: 'stripes-components.stateProviceOrRegion' }),
    zipCode: intl.formatMessage({ id: 'stripes-components.zipOrPostalCode' }),
    addressType: intl.formatMessage({ id: 'stripes-components.addressType' }),
    city: intl.formatMessage({ id: 'stripes-components.city' }),
    country: intl.formatMessage({ id: 'stripes-components.country' }),
  };
  const labelMap = props.labelMap || defaultLabelMap;
  const groupArray = [];
  let rowArray = [];

  props.visibleFields.forEach((field, i) => {
    const fieldLabel = has(labelMap, field) ? labelMap[field] : field;
    const fieldComponent = (
      <Col xs={3} key={`${fieldLabel}-${field}`}>
        <KeyValue label={fieldLabel} value={addressObject[field]} />
      </Col>
    );
    rowArray.push(fieldComponent);

    // 3 fields per row...
    if (rowArray.length === 4 || i === visibleFields.length - 1) {
      groupArray.push(<Row key={i}>{rowArray}</Row>);
      rowArray = [];
    }
  }, this);

  const actions = [{
    title: intl.formatMessage({ id: 'stripes-components.editThisAddress' }),
    icon: 'edit',
    handler: () => handleEdit(uiId)
  }];
  const primaryAddressMsg = intl.formatMessage({ id: 'stripes-components.primaryAddress' });
  const alternateAddressMsg = intl.formatMessage({ id: 'stripes-components.alternateAddress' });

  return (
    <div
      className={css.addressItem}
      aria-label={(addressObject.primaryAddress && primaryAddressMsg) || alternateAddressMsg}
      tabIndex="0"
      role="tabpanel"
      data-group-id={uiId}
    >
      <LayoutHeader level={5} title={headerFormatter(addressObject)} actions={actions} noActions={!canEdit} />
      <div className={css.addressItemContent}>
        {groupArray}
      </div>
    </div>
  );
}

AddressView.propTypes = propTypes;
AddressView.defaultProps = defaultProps;

export default injectIntl(AddressView);
