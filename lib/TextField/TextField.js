import React from 'react';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TextFieldIcon from './TextFieldIcon';
import css from './TextField.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../../util/omitProps';

const propTypes = {
  /**
   * Can be "text" or "number". Standard html attribute.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  type: PropTypes.string,
  /**
   * String of preset styles to apply to textfield. possible values: noBorder
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
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /**
   * Event handler for text input. Required if a value is supplied.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: PropTypes.func,

  /**
   * Render textfield as readonly, disable clear action.
   */
  readOnly: PropTypes.bool,

  /**
   * Apply CSS class on wrapper element on focus
   */
  focusedClass: PropTypes.string,

  inputClass: PropTypes.string,
  error: PropTypes.string,
  warning: PropTypes.string,
  id: PropTypes.string,
  meta: PropTypes.object,
  input: PropTypes.object,
  noBorder: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  clearFieldId: PropTypes.string,
  required: PropTypes.bool,
  validationEnabled: PropTypes.bool,
  validStylesEnabled: PropTypes.bool,
  hasClearIcon: PropTypes.bool,
  onClearField: PropTypes.func,
  autoFocus: PropTypes.bool,
};

const defaultProps = {
  type: 'text',
  validationEnabled: true,
  hasClearIcon: true,
};

class TextField extends React.Component {
  constructor(props) {
    super(props);

    this.input = null;
    this.startControl = null;
    this.endControl = null;

    this.calcPadding = this.calcPadding.bind(this);
    this.clearField = this.clearField.bind(this);

    this.state = {
      focused: false,
    };

    // if no id has been supplied, generate a unique one
    if (Object.prototype.hasOwnProperty.call(props, 'id')) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId('text-input-');
    }
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

    return classNames(
      classStringFromProps,
      sharedInputStylesHelper(this.props),
      this.props.inputClass,
    );
  }

  focusInput() {
    this.input.focus();
  }

  onFocus = () => {
    this.setState({
      focused: true,
    });
  }

  onBlur= () => {
    this.setState({
      focused: false,
    });
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

    const startWidth = this.startControl.getBoundingClientRect().width + 8;
    const endWidth = this.endControl.getBoundingClientRect().width + 8;

    const styleObject = {};
    styleObject[`padding-${start}`] = `${startWidth}px`;
    styleObject[`padding-${end}`] = `${endWidth}px`;

    return styleObject;
  }

  clearField() {
    const { onClearField, input } = this.props;
    this.input.value = '';
    if (input) {
      const event = new Event('input', { bubbles: true });
      this.input.dispatchEvent(event);
    }

    // Fire callback
    if (typeof onClearField === 'function') {
      onClearField();
    }

    // Set focus on input again
    setTimeout(() => { this.input.focus(); }, 5);
  }

  render() {
    let cleanedProps;
    let inputProps;
    let input;
    let rest;
    let inputAttr;
    let validationEnabled;

    if (this.props.input) {
      ({ input, validationEnabled, ...rest } = this.props);
      ({ ...inputAttr } = input);
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
    } else {
      cleanedProps = this.props;
      validationEnabled = this.props.validationEnabled;
      inputProps = null;
    }

    const { label, endControl, startControl, required, clearFieldId } = cleanedProps;

    // Use omitProps here instead of separateComponentProps because
    // redux-form needs the abililty to directly manage the props it passes
    // down to the fields it manages. separateComponentProps requires us to
    // know the names of all the props we want to pass along, but we don't
    // know them.
    // this still feels kinda clumsy, but at least it's not broken.
    const inputCustom = omitProps(cleanedProps, ['label', 'endControl', 'startControl', 'required', 'fullWidth', 'marginBottom0', 'noBorder', 'validationEnabled', 'meta', 'inputClass', 'hasClearIcon', 'ariaLabel', 'onClearField', 'clearFieldId', 'validStylesEnabled', 'focusedClass']);
    const component = (
      <input
        ref={(ref) => { this.input = ref; }}
        className={this.getInputStyle()}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...inputProps}
        {...inputCustom}
        aria-required={required}
        aria-label={this.props.ariaLabel}
        autoFocus={this.props.autoFocus}
      />
    );

    let validation = null;
    let clearField = null;

    if (this.props.meta) {
      if (this.props.hasClearIcon && this.props.meta.active && !this.props.meta.asyncValidating && this.props.input && this.props.input.value !== '') {
        clearField = <TextFieldIcon title="Clear this field" onMouseDown={this.clearField} tabIndex="-1" icon="clearX" id={clearFieldId || `clickable-${this.testId}-clear-field`} />;
      }

      if (validationEnabled && this.props.meta.asyncValidating) {
        validation = <TextFieldIcon iconClassName={css.successIcon} title="Validating.." iconSize="small" icon="spinner-ellipsis" />;
      }

      // If validStylesEnabled is enabled we add some styling if the field is valid
      // This is disabled by default because it's primarily used when something is
      // getting validated on the server - e.g. checking for an email or similar.
      if (this.props.validStylesEnabled && validationEnabled && this.props.meta.touched && this.props.meta.dirty && !this.props.meta.active && this.props.meta.valid && !this.props.meta.asyncValidating) {
        validation = <TextFieldIcon iconClassName={css.successIcon} title="Field is valid" icon="validation-check" id={`icon-${this.testId}-validation-success`} />;
      }

      if (this.props.meta.touched && !this.props.meta.active && !this.props.meta.valid && !this.props.meta.asyncValidating) {
        if (this.input && (this.input.value === '' || !this.input.value)) {
          validation = validationEnabled && <TextFieldIcon iconClassName={css.errorIcon} title="Field has error" icon="validation-error" id={`icon-${this.testId}-validation-error`} />;
        } else {
          validation = validationEnabled && <TextFieldIcon title="Field has error" onClick={this.clearField} iconClassName={css.errorIcon} icon="validation-error" id={`icon-${this.testId}-validation-error`} />;
          clearField = this.props.hasClearIcon && <TextFieldIcon title="Clear this field" onClick={this.clearField} icon="clearX" id={clearFieldId || `clickable-${this.testId}-clear-field`} />;
        }
      }
    }

    const endControlElement = <div className={css.endControls}><div className={css.controlGroup} ref={(ref) => { this.endControl = ref; }}>{!this.props.readOnly && clearField}{validation}{endControl}</div></div>;
    const startControlElement = <div className={css.startControls}><div className={css.controlGroup} ref={(ref) => { this.startControl = ref; }}>{startControl}</div></div>;

    let warningElement;
    let errorElement;
    if (this.props.meta) {
      const { error, warning, touched } = this.props.meta;
      warningElement = touched && warning ? <div className={formStyles.feedbackWarning}>{warning}</div> : null;
      errorElement = touched && error ? <div className={formStyles.feedbackError}>{error}</div> : null;
    }

    const wrapperStyles = classNames(
      css.textField,
      { [this.props.focusedClass]: this.state.focused && this.props.focusedClass },
    );

    return (
      <div className={wrapperStyles}>
        { label && <label htmlFor={this.props.id} className={formStyles.label}>{label}</label> }
        <div className={formStyles.inputGroup}>
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
