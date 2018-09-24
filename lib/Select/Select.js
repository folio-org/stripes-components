import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

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
    disabled: PropTypes.bool,
    error: PropTypes.string,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    loading: PropTypes.bool,
    marginBottom0: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
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
      readOnly,
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
            disabled={readOnly || option.disabled}
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
        id={this.id}
      >
        {options}
        {
          React.Children.map(children, (child) => {
            if (child.type === 'option') {
              return React.cloneElement(child, {
                disabled: readOnly || child.props.disabled, // Disable option if "readOnly" is set to true
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
        { label ? (
          <label
            htmlFor={this.id}
            className={classNames(formStyles.label, this.getLabelClass())}
          >
            {label}
            { readOnly && <Icon size="small" icon="lock" /> }
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
