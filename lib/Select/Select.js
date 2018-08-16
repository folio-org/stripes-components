import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import reduxFormField from '../ReduxFormField';
import css from './Select.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../../util/omitProps';
import Icon from '../Icon';

class Select extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.node,
    dataOptions: PropTypes.arrayOf(PropTypes.object),
    dirty: PropTypes.bool,
    error: PropTypes.string,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    loading: PropTypes.bool,
    marginBottom0: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    selectClass: PropTypes.string,
    touched: PropTypes.bool,
    valid: PropTypes.bool,
    validationEnabled: PropTypes.bool,
    validStylesEnabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    warning: PropTypes.string,
  };

  static defaultProps = {
    autoFocus: false,
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
        [`${css.placeholder}`]: this.props.placeholder && !this.props.value
      }, // end placeholder
      sharedInputStylesHelper(this.props),
      this.props.selectClass,
    );
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
      touched,
      valid,
      validationEnabled,
      validStylesEnabled,
      warning,
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
            disabled={option.disabled}
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
        {...omitProps(selectCustom, ['selectClass'])}
      >
        {options}
        {children}
      </select>
    );

    const errorElem = error ?
      <div className={formStyles.feedbackError}>{error}</div> : null;

    const warningElem = warning ?
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

export default reduxFormField(
  Select,
  ({ input, meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    name: input.name,
    onBlur: input.onBlur,
    onChange: input.onChange,
    onFocus: input.onFocus,
    touched: meta.touched,
    valid: meta.valid,
    value: input.value,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
