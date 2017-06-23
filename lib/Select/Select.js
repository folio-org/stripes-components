import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Select.css';

const propTypes = {
  dataOptions: React.PropTypes.arrayOf(React.PropTypes.object),
  meta: React.PropTypes.object,
  fullWidth: PropTypes.bool,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  id: PropTypes.string,
};

const defaultProps = {
  meta: {},
};

class Select extends React.Component {

  getRootClass() {
    return classNames(
      css.root,
      { [`${css.fullWidth}`]: this.props.fullWidth },
    );
  }

  getLabelClass() {
    return classNames(
      css.selectLabel,
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
      { [`${css.fullWidth}`]: this.props.fullWidth },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.error}`]: this.props.error },
    );
  }

  render() {
    const { input, meta: { error, warning, touched }, ...rest } = this.props;
    const { ...selectAttr } = input;
    const {
      label,
      placeholder,
      dataOptions,
      children,
      fullWidth, // eslint-disable-line no-unused-vars
      marginBottom0, // eslint-disable-line no-unused-vars
      ...selectCustom
    } = rest;

    const options = [];

    if (this.props.placeholder) options.push(<option value="" key="x" disabled>{placeholder}</option>);

    if (dataOptions) {
      dataOptions.forEach((option, i) => {
        options.push(<option value={option.value} key={option.id || `option-${i}`}>{option.label}</option>);
      });
    }

    const component = (
      <select className={this.getSelectClass()} {...selectAttr} {...selectCustom} >
        {options}
        {children}
      </select>
    );

    const errorElem = touched && error ?
      <div className={css.selectError}>{error}</div> : null;

    const warningElem = touched && warning ?
      <div className={css.selectWarning}>{warning}</div> : null;

    if (label) {
      return (
        <div className={this.getRootClass()}>
          <label htmlFor={this.props.id} className={this.getLabelClass()}>{label}</label>
          {component}
          {warningElem}
          {errorElem}
        </div>
      );
    }

    return component;
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
