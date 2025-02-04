import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import formField from '../FormField';
import css from './Select.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../util/omitProps';
import parseMeta from '../FormField/parseMeta';
import Icon from '../Icon';
import Label from '../Label';

class Select extends Component {
  static propTypes = {
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'autoFocus': PropTypes.bool,
    'children': PropTypes.node,
    'dataOptions': PropTypes.arrayOf(PropTypes.object),
    'dirty': PropTypes.bool,
    'disabled': PropTypes.bool,
    'error': PropTypes.node,
    'fullWidth': PropTypes.bool,
    'id': PropTypes.string,
    'inputRef': PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    'label': PropTypes.node,
    'loading': PropTypes.bool,
    'marginBottom0': PropTypes.bool,
    'multiple': PropTypes.bool,
    'name': PropTypes.string,
    'placeholder': PropTypes.string,
    'readOnly': PropTypes.bool,
    'required': PropTypes.bool,
    'selectClass': PropTypes.string,
    'valid': PropTypes.bool,
    'validationEnabled': PropTypes.bool,
    'validStylesEnabled': PropTypes.bool,
    'value': PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    'warning': PropTypes.node,
  };

  static defaultProps = {
    'autoFocus': false,
    'validationEnabled': true,
    'validStylesEnabled': false,
    'multiple': false,
  };

  constructor(props) {
    super(props);
    this.id = this.props.id || uniqueId('select-');
  }

  getRootClass() {
    return classNames(
      css.select,
      formStyles.inputGroup,
      { [`${css.fullWidth}`]: this.props.fullWidth },
    );
  }

  getSelectClass() {
    return classNames(
      css.selectControl,
      // placeholder styling
      {
        [`${css.placeholder}`]: this.props.placeholder && !this.props.value
      }, // end placeholder
      sharedInputStylesHelper(this.props),
      this.props.selectClass,
    );
  }

  getAriaLabelledBy() {
    const label = (this.props.label || this.props['aria-label']) && `${this.id}-label`;
    const readOnly = this.props.readOnly && `${this.id}-read-only-message`;

    const finalString = [label, this.props['aria-labelledby'], readOnly].filter(Boolean).join(' ');

    return finalString ?? undefined;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      autoFocus,
      dataOptions,
      dirty,
      children,
      error,
      fullWidth,
      label,
      loading,
      marginBottom0,
      name,
      placeholder,
      readOnly,
      required,
      valid,
      validationEnabled,
      validStylesEnabled,
      warning,
      inputRef,
      multiple,
      ...selectCustom
    } = this.props;
    /* eslint-enable no-unused-vars */

    const options = [];

    if (this.props.placeholder) {
      options.push(
        <option value="" key="x" disabled>{placeholder}</option>
      );
    }

    if (dataOptions) {
      dataOptions.forEach((option, i) => {
        options.push(
          <option
            value={option.value}
            key={option.id || `option-${i}`}
            disabled={option.disabled || (readOnly && option.value !== this.props.value)}
          >
            {option.label}
          </option>
        );
      });
    }

    const component = (
      <select
        autoFocus={autoFocus}
        className={this.getSelectClass()}
        name={name}
        {...omitProps(selectCustom, ['selectClass', 'aria-labelledby', 'aria-label'])}
        aria-labelledby={this.getAriaLabelledBy()}
        aria-invalid={!!this.props.error}
        aria-required={required}
        id={this.id}
        required={required}
        ref={inputRef}
        multiple={multiple}
      >
        {options}
        {
          React.Children.map(children, (child) => {
            if (child.type === 'option') {
              return React.cloneElement(child, {
                // Disable option if it's disabled
                // or <Select> is read-only and option is different from current value
                disabled: child.props.disabled || (readOnly && child.props.value !== this.props.value),
              });
            }

            return child;
          })
        }
      </select>
    );

    const errorElem = error ?
      <div className={formStyles.feedbackError}>{error}</div> : null;

    const warningElem = warning ?
      <div className={formStyles.feedbackWarning}>{warning}</div> : null;

    return (
      <div className={this.getRootClass()}>
        {(label || this.props['aria-label']) ? (
          <Label
            htmlFor={this.id}
            id={`${this.id}-label`}
            readOnly={readOnly}
            required={required}
            className={this.props['aria-label'] && 'sr-only'}
          >
            {this.props['aria-label'] || label}
          </Label>)
          : ''}
        <div className={css.selectWrap}>
          {component}
          {!multiple && <Icon icon="triangle-down" iconRootClass={css.selectIcon} />}
        </div>
        <div role="alert">
          {warningElem}
          {errorElem}
        </div>
      </div>
    );
  }
}

export default formField(
  Select,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
