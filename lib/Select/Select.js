import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Select.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../../util/omitProps';
import Icon from '../Icon';

export default class Select extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    dataOptions: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    marginBottom0: PropTypes.bool,
    meta: PropTypes.object,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    selectClass: PropTypes.string,
    validationEnabled: PropTypes.bool,
    validStylesEnabled: PropTypes.bool,
    value: PropTypes.string,
  };

  static defaultProps = {
    autoFocus: false,
    meta: {},
    validationEnabled: true,
    validStylesEnabled: false,
  };

  getRootClass() {
    return classNames(
      css.select,
      formStyles.inputGroup,
      { [`${css.fullWidth}`]: this.props.fullWidth },
    );
  }

  getLabelClass() {
    return classNames(
      formStyles.label,
      { [`${css.required}`]: this.props.required },
    );
  }

  getSelectClass() {
    return classNames(
      css.selectControl,
      // placeholder styling
      {
        [`${css.placeholder}`]: this.props.input ?
          this.props.placeholder && !this.props.input.value :
          this.props.placeholder && !this.props.value,
      }, // end placeholder
      sharedInputStylesHelper(this.props),
      this.props.selectClass,
    );
  }

  render() {
    const { input, meta: { error, warning, touched }, ...rest } = this.props;
    const { ...selectAttr } = input;

    /* eslint-disable no-unused-vars */
    const {
      label,
      placeholder,
      dataOptions,
      children,
      fullWidth,
      marginBottom0,
      validationEnabled,
      validStylesEnabled,
      ...selectCustom
    } = rest;
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
            disabled={option.disabled}
          >
            {option.label}
          </option>
        );
      });
    }

    const component = (
      <select
        autoFocus={this.props.autoFocus}
        className={this.getSelectClass()}
        {...selectAttr}
        {...omitProps(selectCustom, ['selectClass'])}
      >
        {options}
        {children}
      </select>
    );

    const errorElem = touched && error ?
      <div className={formStyles.feedbackError}>{error}</div> : null;

    const warningElem = touched && warning ?
      <div className={formStyles.feedbackWarning}>{warning}</div> : null;

    return (
      <div className={this.getRootClass()}>
        { label ? (
          <label
            htmlFor={this.props.id}
            className={classNames(formStyles.label, this.getLabelClass())}
          >
            {label}
          </label>)
        : '' }
        <div className={css.selectWrap}>
          {component}
          <Icon icon="down-triangle" iconRootClass={css.selectIcon} />
        </div>
        {warningElem}
        {errorElem}
      </div>
    );
  }
}
