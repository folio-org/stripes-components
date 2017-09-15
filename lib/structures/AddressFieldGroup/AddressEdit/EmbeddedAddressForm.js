import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form'; // eslint-disable-line

import Button from '../../../Button';
import Checkbox from '../../../Checkbox';
import TextField from '../../../TextField';
import Select from '../../../Select';
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
    fieldKey: PropTypes.number,
  }

  static defaultProps = {
    headerFields: ['primaryAddress'],
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
      country: { component: Select, props: { placeholder: 'Select Country' } },
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
      stateRegion: 'State/Prov./Region',
      zipCode: 'Zip/Postal Code',
      addressType: 'Address Type',
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

    const mergedFieldComponents = Object.assign(EmbeddedAddressForm.defaultProps.fieldComponents, fieldComponents);
    const staticFields = (
      <Row>
        <Col xs={12} sm={4}>
          <div style={{ paddingTop: '8px' }}>
            <Field
              label="Primary Address"
              name={`${addressFieldName}.primaryAddress`}
              id={`PrimaryAddress---${addressFieldName}`}
              component={Checkbox}
              type="checkbox"
              marginBottom0
            />
          </div>
        </Col>
      </Row>
    );

    const renderedFields = visibleFields.map((fieldName, i) => {
      const fieldLabel = Object.prototype.hasOwnProperty.call(labelMap, fieldName) ?
        labelMap[fieldName] : fieldName;

      let field;
      if (Object.prototype.hasOwnProperty.call(mergedFieldComponents, fieldName)) {
        if (typeof (mergedFieldComponents[fieldName]) === 'object') {
          field = (
            <Field
              name={`${addressFieldName}.${fieldName}`}
              label={fieldLabel}
              component={mergedFieldComponents[fieldName].component}
              {...mergedFieldComponents[fieldName].props}
            />
          );
        } else {
          field = (
            <Field
              name={`${addressFieldName}.${fieldName}`}
              label={fieldLabel}
              component={mergedFieldComponents[fieldName]}
            />
          );
        }
      }
      return (
        <Col xs={12} sm={4} key={`${fieldKey}-${i}`}>
          {field}
        </Col>
      );
    });

    return (
      <div style={{ marginBottom: '8px' }}>
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
        <Row>
          <Col xs={12}>
            <div style={{ textAlign: 'right' }}>
              {
                canDelete &&

                <Button
                  title={`remove address ${this.props.fieldKey + 1}`}
                  onClick={() => { this.props.handleDelete(fieldKey); }}
                >
                  Remove Address {this.props.fieldKey + 1}
                </Button>

              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EmbeddedAddressForm;
