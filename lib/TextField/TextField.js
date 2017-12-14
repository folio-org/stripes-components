import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Button from '../Button';
import css from './TextField.css';
import omitProps from '../../util/omitProps';

const propTypes = {
  /**
   * Can be "type" or "number". Standard html attribute.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  type: PropTypes.string,
  /**
   * String of preset styles to apply to textfield. possible values: noBorder, rounded
   */
  inputStyle: PropTypes.string,
  /**
   * Control or Icon to display at the start of the textfield.
   */
  startControl: PropTypes.element,
  /**
   * Control or Icon to display at the end of the textfield.
   */
  endControl: PropTypes.element,
  /**
   * String of text to display.
   */
  value: PropTypes.string,
  /**
   * Event handler for text input. Required if a value is supplied.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: PropTypes.func,

  /**
   * Render textfield as readonly, disable clear action.
   */
  readOnly: PropTypes.bool,
  asyncValidating: PropTypes.string,

  error: PropTypes.string,
  warning: PropTypes.string,
  id: PropTypes.string,
  meta: PropTypes.object,
  input: PropTypes.object,
  noBorder: PropTypes.bool,
  rounded: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  required: PropTypes.bool,
  validationEnabled: PropTypes.bool,
};

const defaultProps = {
  type: 'text',
  validationEnabled: true,
  rounded: true,
};

class TextField extends React.Component {
  constructor(props) {
    super(props);

    this.input = null;
    this.startControl = null;
    this.endControl = null;

    this.calcPadding = this.calcPadding.bind(this);
    this.clearField = this.clearField.bind(this);
  }

  componentDidMount() {
    // calculate padding only if endControl or startControl are in use.
    if (this.props.endControl || this.props.startControl) {
      requestAnimationFrame(() => {
        if (this.input) {
          const paddingObject = this.calcPadding();
          Object.assign(this.input.style, paddingObject);
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    let shouldUpdatePadding = false;
    if (prevProps.endControl !== this.props.endControl || prevProps.startControl !== this.props.startControl) {
      shouldUpdatePadding = true;
    }

    if (prevProps.meta) {
      if (prevProps.meta.asyncValidating !== this.props.meta.asyncValidating) {
        shouldUpdatePadding = true;
      }
    }

    if (shouldUpdatePadding) {
      requestAnimationFrame(() => {
        if (this.input) {
          const paddingObject = this.calcPadding();
          Object.assign(this.input.style, paddingObject);
        }
      });
    }
  }

  getInput() {
    return this.input;
  }

  getInputStyle() {
    let classStringFromProps;
    if (/\s/.test(this.props.inputStyle)) {
      const tempClasses = this.props.inputStyle.split(/\s+/);
      const csslist = [];
      tempClasses.forEach(classname => csslist.push(`${css[classname]}`));
      classStringFromProps = csslist.join(' ');
    }

    let validationClasses;
    if (this.props.meta) {
      validationClasses = classNames(
        { [`${css.textFieldHasFeedback}`]: this.props.meta.error || this.props.meta.warning },
        { [`${css.textFieldError}`]: this.props.meta.touched && this.props.meta.error },
        { [`${css.textFieldValid}`]: this.props.meta.touched && !this.props.meta.asyncValidating && this.props.meta.valid && this.props.meta.dirty },
      );
    }

    return classNames(
      css.input,
      classStringFromProps,
      { [`${css.rounded}`]: this.props.rounded },
      { [`${css.noBorder}`]: this.props.noBorder },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      validationClasses,
    );
  }

  focusInput() {
    this.input.focus();
  }

  calcPadding() {
    let start;
    let end;
    if (window.getComputedStyle(this.input).direction === 'rtl') {
      start = 'right';
      end = 'left';
    } else {
      start = 'left';
      end = 'right';
    }

    const startWidth = this.startControl.getBoundingClientRect().width + 4;
    const endWidth = this.endControl.getBoundingClientRect().width + 4;

    const styleObject = {};
    styleObject[`padding-${start}`] = `${startWidth}px`;
    styleObject[`padding-${end}`] = `${endWidth}px`;

    return styleObject;
  }

  clearField() {
    this.input.value = '';
    if (this.props.input) {
      const event = new Event('input', { bubbles: true });
      this.input.dispatchEvent(event);
    }
    setTimeout(() => { this.input.focus(); }, 5);
  }

  render() {
    let cleanedProps;
    let inputProps;
    let error;
    let warning;
    let touched;
    let input;
    let rest;
    let inputAttr;
    let validationEnabled;
console.warn('input props', this.props);
    if (this.props.input) {
      ({ input, validationEnabled, meta: { error, warning, touched }, ...rest } = this.props);
      ({ ...inputAttr } = input);
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
    } else {
      cleanedProps = this.props;
      validationEnabled = this.props.validationEnabled;
      inputProps = null;
    }

    const { label, endControl, startControl, required } = cleanedProps;

    // Use omitProps here instead of separateComponentProps because
    // redux-form needs the abililty to directly manage the props it passes
    // down to the fields it manages. separateComponentProps requires us to
    // know the names of all the props we want to pass along, but we don't
    // know them.
    // this still feels kinda clumsy, but at least it's not broken.
    const inputCustom = omitProps(cleanedProps, ['label', 'endControl', 'startControl', 'rounded', 'required', 'fullWidth', 'marginBottom0', 'noBorder', 'validationEnabled']);
    const component = (
      <input
        ref={(ref) => { this.input = ref; }}
        className={this.getInputStyle()}
        {...inputProps}
        {...inputCustom}
        aria-required={required}
      />
    );

    let validation = null;
    let clearField = null;

    if (this.props.meta) {
      if (validationEnabled && this.props.meta.asyncValidating && !this.props.meta.active) {
        validation = <div style={{ marginTop: '5px' }}><Icon title="validating" width="30px" icon="spinner-ellipsis" /></div>;
      }

      if (validationEnabled && this.props.meta.touched && this.props.meta.dirty && !this.props.meta.active && this.props.meta.valid && !this.props.meta.asyncValidating) {
        validation = <Icon title="Field is valid" icon="validation-check" />;
      }
      if (this.props.meta.touched && !this.props.meta.active && !this.props.meta.valid && !this.props.meta.asyncValidating) {
        if (this.input && this.input.value === '' || this.input && !this.input.value) {
          validation = validationEnabled && <Icon title="Field has error" icon="validation-error" />;
        } else {
          validation = validationEnabled && <div style={{ display: 'flex', alignItems: 'center' }}><Icon title="Field has error" icon="validation-error" /></div>;
          clearField = <div style={{ display: 'flex', alignItems: 'center' }}><Button title="Clear this field" buttonStyle="fieldControl" onClick={this.clearField}><Icon icon="closeX" /></Button></div>;
        }
      }
      if (this.props.meta.active && this.props.input.value !== '') {
        clearField = <div style={{ display: 'flex', alignItems: 'center' }}><Button title="Clear this field" buttonStyle="fieldControl" onMouseDown={this.clearField} tabIndex="-1"><Icon icon="closeX" /></Button></div>;
      }
    }

    const endControlElement = <div className={css.endControls}><div className={css.controlGroup} ref={(ref) => { this.endControl = ref; }}>{!this.props.readOnly && clearField}{validation}{endControl}</div></div>;
    const startControlElement = <div className={css.startControls}><div className={css.controlGroup} ref={(ref) => { this.startControl = ref; }}>{startControl}</div></div>;

    let warningElement;
    let errorElement;
    if (this.props.meta) {
      warningElement = touched && warning ? <div className={css.textfieldWarning}>{warning}</div> : null;
      errorElement = touched && error ? <div className={css.textfieldError}>{error}</div> : null;
    }

    return (
      <div className={css.root}>
        { label && <label htmlFor={this.props.id} className={css.label}>{label}</label> }
        <div className={css.inputGroup}>
          {startControlElement}
          {component}
          {endControlElement}
        </div>
        {warningElement}
        {errorElement}
      </div>
    );
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
