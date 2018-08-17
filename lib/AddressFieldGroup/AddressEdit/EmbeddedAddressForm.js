import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import Button from '../../Button';
import TextField from '../../TextField';
import Select from '../../Select';
import Selection from '../../Selection';
import Icon from '../../Icon';
import { Row, Col } from '../../LayoutGrid';
import { countriesOptions } from '../data/countries';
import css from './AddressEdit.css';

const omitUsedOptions = (list, usedValues, key, id) => {
  const unUsedValues = cloneDeep(list);
  usedValues.forEach((item, i) => {
    if (id !== i) {
      const usedValueIndex = findIndex(unUsedValues, v => v.value === item[key]);
      if (usedValueIndex !== -1) {
        unUsedValues.splice(usedValueIndex, 1);
      }
    }
  });
  return unUsedValues;
};

class EmbeddedAddressForm extends React.Component {
  static propTypes = {
    addressFieldName: PropTypes.string,
    // addressObject: PropTypes.object,
    canDelete: PropTypes.bool,
    fieldComponents: PropTypes.object,
    fieldKey: PropTypes.number,
    handleDelete: PropTypes.func,
    // headerComponent: PropTypes.func,
    // headerField: PropTypes.node,
    headerFields: PropTypes.arrayOf(PropTypes.string),
    labelMap: PropTypes.object,
    primary: PropTypes.func,
    visibleFields: PropTypes.arrayOf(PropTypes.string),
  }

  static contextTypes = {
    _reduxForm: PropTypes.object,
  }

  static defaultProps = {
    fieldComponents: {
      addressType: Select,
      addressLine1: TextField,
      addressLine2: TextField,
      city: TextField,
      stateRegion: TextField,
      zipCode: TextField,
      country: { component: Selection, props: { placeholder: 'Select Country', dataOptions: countriesOptions } },
    },
    headerFields: ['primaryAddress'],
    labelMap: {
      addressType: 'Address Type',
      addressLine1: 'Address line 1',
      addressLine2: 'Address line 2',
      stateRegion: 'State/Prov./Region',
      zipCode: 'Zip/Postal Code',
      country: 'Country',
      city: 'City',
    },
    visibleFields: [
      'addressType',
      'addressLine1',
      'addressLine2',
      'city',
      'stateRegion',
      'zipCode',
      'country',
    ],
  }

  constructor(props) {
    super(props);
    this.singlePrimary = this.singlePrimary.bind(this);
  }

  singlePrimary(id) {
    const { values, dispatch, change } = this.context._reduxForm;
    values.personal.addresses.forEach((a, i) => {
      if (i === id) {
        dispatch(change(`personal.addresses[${i}].primaryAddress`, true));
        dispatch(change(`personal.addresses[${i}].primary`, true));
      } else {
        dispatch(change(`personal.addresses[${i}].primaryAddress`, false));
        dispatch(change(`personal.addresses[${i}].primary`, false));
      }
    });
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

    const {
      values,
    } = this.context._reduxForm;

    const PrimaryRadio = ({ input, ...props }) => (
      <label className={css.primaryToggle} htmlFor={props.id}>
        <input
          type="radio"
          checked={input.value}
          id={props.id}
          onChange={() => { this.singlePrimary(fieldKey); }}
          name="primary"
          aria-labelledby={`Use address ${fieldKey + 1} as primary address`}
        />
        Use as primary address
      </label>
    );

    const mergedFieldComponents = Object.assign(EmbeddedAddressForm.defaultProps.fieldComponents, fieldComponents);

    const renderedFields = visibleFields.map((fieldName, i) => {
      const fieldLabel = Object.prototype.hasOwnProperty.call(labelMap, fieldName) ?
        labelMap[fieldName] : fieldName;

      let field;
      if (Object.prototype.hasOwnProperty.call(mergedFieldComponents, fieldName)) {
        if (typeof (mergedFieldComponents[fieldName]) === 'object' && mergedFieldComponents[fieldName].component) {
          if (fieldName === 'addressType') {
            const list = omitUsedOptions(
              mergedFieldComponents[fieldName].props.dataOptions,
              values.personal.addresses,
              'addressType',
              fieldKey,
            );
            field = (
              <Field
                name={`${addressFieldName}.${fieldName}`}
                label={fieldLabel}
                component={mergedFieldComponents[fieldName].component}
                {...mergedFieldComponents[fieldName].props}
                dataOptions={list}
              />
            );
          } else {
            field = (
              <Field
                name={`${addressFieldName}.${fieldName}`}
                label={fieldLabel}
                component={mergedFieldComponents[fieldName].component}
                {...mergedFieldComponents[fieldName].props}
              />
            );
          }
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
        <Col xs={12} sm={3} key={`${fieldKey}-${i}`}>
          {field}
        </Col>
      );
    });

    return (
      <div className={css.addressForm}>
        <div className={css.addressFormHeader} start="xs">
          <div className={css.addressLabel}>
Address
            {this.props.fieldKey + 1}
          </div>
          <div>
            <Field
              component={PrimaryRadio}
              name={`${addressFieldName}.primary`}
              id={`PrimaryAddress---${addressFieldName}`}
              fieldKey={this.props.fieldKey}
            />
          </div>
          <div className={css.addressHeaderActions}>
            {
              canDelete &&
              <Button
                buttonStyle="link slim"
                style={{ margin: 0, padding: 0 }}
                title={`remove address ${this.props.fieldKey + 1}`}
                onClick={() => { this.props.handleDelete(fieldKey); }}
              >
                <Icon icon="trashBin" width="24px" height="24px" />
                <span className="sr-only">
Remove Address
                  {this.props.fieldKey + 1}
                </span>
              </Button>
            }
          </div>
        </div>
        <div className={css.addressFormBody}>
          <Row key={fieldKey}>
            {renderedFields}
          </Row>
        </div>
      </div>
    );
  }
}

export default EmbeddedAddressForm;
