import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Select.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../../util/omitProps';
import Icon from '../Icon';

const propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  meta: PropTypes.object,
  fullWidth: PropTypes.bool,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  validationEnabled: PropTypes.bool,
  validStylesEnabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  id: PropTypes.string,
  selectClass: PropTypes.string,
  autoFocus: PropTypes.bool,
};

const defaultProps = {
  meta: {},
  validationEnabled: true,
  validStylesEnabled: false,
  autoFocus: false,
};

class Select extends React.Component {
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
    const {
      label,
      placeholder,
      dataOptions,
      children,
      fullWidth, // eslint-disable-line no-unused-vars
      marginBottom0, // eslint-disable-line no-unused-vars
      validationEnabled, // eslint-disable-line no-unused-vars
      validStylesEnabled, // eslint-disable-line no-unused-vars
      ...selectCustom
    } = rest;

    const options = [];

    if (this.props.placeholder) options.push(<option value="" key="x" disabled>{placeholder}</option>);

    if (dataOptions) {
      dataOptions.forEach((option, i) => {
        options.push(<option value={option.value} key={option.id || `option-${i}`} disabled={option.disabled}>{option.label}</option>);
      });
    }

    const component = (
      <select autoFocus={this.props.autoFocus} className={this.getSelectClass()} {...selectAttr} {...omitProps(selectCustom, ['selectClass'])} >
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

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
