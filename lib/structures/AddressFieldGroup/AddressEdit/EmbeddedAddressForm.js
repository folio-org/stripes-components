import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form'; // eslint-disable-line

import Button from '../../../Button';
import Checkbox from '../../../Checkbox';
import TextField from '../../../TextField';
import Select from '../../../Select';
import Icon from '../../../Icon';
import { Row, Col } from '../../../LayoutGrid';
import css from './AddressEdit.css';

class EmbeddedAddressForm extends React.Component {

  static propTypes = {
    // addressObject: PropTypes.object,
    addressFieldName: PropTypes.string,
    canDelete: PropTypes.bool,
    handleDelete: PropTypes.func,
    labelMap: PropTypes.object,
    visibleFields: PropTypes.arrayOf(PropTypes.string),
    // headerField: PropTypes.node,
    fieldComponents: PropTypes.object,
    // headerComponent: PropTypes.func,
    fieldKey: PropTypes.string,
    fieldSizes: PropTypes.object,
  }

  static defaultProps = {
    headerFields: ['primary', 'addressType'],
    visibleFields: [
      'addressLine1',
      'addressLine2',
      'city',
      'stateRegion',
      'zipCode',
    ],
    fieldComponents: {
      country: { component: Select, props: { placeholder: 'Select Country' } },
      addressLine1: TextField,
      addressLine2: TextField,
      city: TextField,
      stateRegion: TextField,
      zipCode: TextField,
    },
    labelMap: {
      addressLine1: 'Address line 1',
      addressLine2: 'Address line 2',
      stateRegion: 'State/Prov./Region',
      zipCode: 'Zip/Postal Code',
    },
    fieldSizes: {
      country: { xs: 12 },
      addressLine1: { xs: 12, md: 6 },
      addressLine2: { xs: 12, md: 6 },
      city: { xs: 12, md: 6 },
      stateRegion: { xs: 6, md: 3 },
      zipCode: { xs: 6, md: 3 },
    },

  }

  render() {
    const {
      addressFieldName,
      fieldKey,
      labelMap,
      canDelete,
      fieldComponents,
      visibleFields,
    } = this.props;

    const staticFields = (
      <Row>

        <Col xs={4}>
          <div style={{ paddingTop: '8px' }}>
            <Field
              label="Primary Address"
              name={`${addressFieldName}.primaryAddress`}
              labelStyle="formLabel"
              id={`PrimaryAddress---${addressFieldName}`}
              component={Checkbox}
              marginBottom0
            />
          </div>
        </Col>
        <Col xs={8}>
          <Field
            name={`${addressFieldName}.addressType`}
            label="address type"
            id={`${addressFieldName}-addressType`}
            dataOptions={[]}
            fullWidth
            marginBottom0
            component={Select}
          />
        </Col>
      </Row>
    );

    const renderedFields = visibleFields.map((fieldName, i) => {
      const fieldLabel = Object.prototype.hasOwnProperty.call(labelMap, fieldName) ?
       labelMap[fieldName] : fieldName;
      let field;
      if (Object.prototype.hasOwnProperty.call(fieldComponents, fieldName)) {
        if (typeof (fieldComponents[fieldName]) === 'object') {
          field = (
            <Field
              name={`${addressFieldName}.${fieldName}`}
              label={fieldLabel}
              component={fieldComponents[fieldName].component}
              {...fieldComponents[fieldName].props}
            />
          );
        } else {
          field = (
            <Field
              name={`${addressFieldName}.${fieldName}`}
              label={fieldLabel}
              component={fieldComponents[fieldName]}
            />
          );
        }
      }
      return (
        <Col {...this.props.fieldSizes[fieldName]} key={`${fieldKey}-${i}`}>
          {field}
        </Col>
      );
    });

    return (
      <div style={{ marginBottom: '8px', position: 'relative' }}>
        <Row>
          <Col xs={11}>
            <div className={css.subLegend}>Address {this.props.fieldKey + 1}</div>
          </Col>
        </Row>
        <div className={css.indent}>
          {staticFields}
          <Row key={fieldKey}>
            {renderedFields}
          </Row>
        </div>
        { canDelete &&
          <div style={{ position: 'absolute', top: '-2px', right: '-6px' }}>
            <Button
              className={css.removeAddress}
              title={`remove address ${this.props.fieldKey + 1}`}
              onClick={() => { this.props.handleDelete(); }}
            >
              <Icon icon="trashBin" width="30" height="30" />
            </Button>
          </div>
        }
      </div>
    );
  }
}

export default EmbeddedAddressForm;
