import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Select.css';
import formStyles from '../sharedStyles/form.css';

const propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  meta: PropTypes.object,
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
    const { meta: { warning, error, touched, asyncValidating, valid, dirty } } = this.props;
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
      { [`${formStyles.hasFeedback}`]: touched && (warning || error) },
      { [`${formStyles.feedbackError}`]: touched && (this.props.error || error) },
      { [`${formStyles.feedbackWarning}`]: touched && warning },
      { [`${formStyles.feedbackValid}`]: !asyncValidating && touched && valid && dirty },
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
      <select className={classNames(formStyles.input, this.getSelectClass())} {...selectAttr} {...selectCustom} >
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
        { label ? (<label htmlFor={this.props.id} className={classNames(formStyles.label, this.getLabelClass())}>{label}</label>) : '' }
        {component}
        {warningElem}
        {errorElem}
      </div>
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
