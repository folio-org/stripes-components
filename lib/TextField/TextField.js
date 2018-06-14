import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import injectIntl from '../InjectIntl';
import TextFieldIcon from './TextFieldIcon';
import css from './TextField.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../../util/omitProps';

class TextField extends Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    clearFieldId: PropTypes.string,
    /**
     * Control or Icon to display at the end of the textfield.
     */
    endControl: PropTypes.element,
    error: PropTypes.string,
    /**
     * Apply CSS class on wrapper element on focus
     */
    focusedClass: PropTypes.string,
    fullWidth: PropTypes.bool,
    hasClearIcon: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    inputClass: PropTypes.string,
    /**
     * String of preset styles to apply to textfield. possible values: noBorder
     */
    inputStyle: PropTypes.string,
    intl: intlShape.isRequired,
    label: PropTypes.string,
    marginBottom0: PropTypes.bool,
    meta: PropTypes.object,
    noBorder: PropTypes.bool,
    /**
     * Event handler for text input. Required if a value is supplied.
     */
    onChange: PropTypes.func,
    onClearField: PropTypes.func,
    /**
     * Render textfield as readonly, disable clear action.
     */
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    /**
     * Control or Icon to display at the start of the textfield.
     */
    startControl: PropTypes.element,
    /**
     * Can be "text" or "number". Standard html attribute.
     */
    type: PropTypes.string,
    validationEnabled: PropTypes.bool,
    validStylesEnabled: PropTypes.bool,
    /**
     * String of text to display.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    warning: PropTypes.string,
  };

  static defaultProps = {
    hasClearIcon: true,
    type: 'text',
    validationEnabled: true,
  };

  constructor(props) {
    super(props);

    this.input = React.createRef();
    this.startControl = React.createRef();
    this.endControl = React.createRef();

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
        if (this.input.current) {
          const paddingObject = this.calcPadding();
          Object.assign(this.input.current.style, paddingObject);
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    let shouldUpdatePadding = false;
    if (prevProps.endControl !== this.props.endControl
      || prevProps.startControl !== this.props.startControl) {
      shouldUpdatePadding = true;
    }

    if (prevProps.meta) {
      if (prevProps.meta.asyncValidating !== this.props.meta.asyncValidating) {
        shouldUpdatePadding = true;
      }
    }

    if (shouldUpdatePadding) {
      requestAnimationFrame(() => {
        if (this.input.current) {
          const paddingObject = this.calcPadding();
          Object.assign(this.input.current.style, paddingObject);
        }
      });
    }
  }

  getInput() {
    return this.input.current;
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
    this.input.current.focus();
  }

  onFocus = () => {
    this.setState({
      focused: true,
    });
  }

  onBlur = () => {
    this.setState({
      focused: false,
    });
  }

  calcPadding() {
    let start;
    let end;

    if (this.input.current && window.getComputedStyle(this.input.current).direction === 'rtl') {
      start = 'right';
      end = 'left';
    } else {
      start = 'left';
      end = 'right';
    }

    const styleObject = {};
    let startWidth = 0;
    let endWidth = 0;

    if (this.startControl.current) {
      startWidth = this.startControl.current.getBoundingClientRect().width + 8;
    }

    if (this.endControl.current) {
      endWidth = this.endControl.current.getBoundingClientRect().width + 8;
    }

    styleObject[`padding-${start}`] = `${startWidth}px`;
    styleObject[`padding-${end}`] = `${endWidth}px`;

    return styleObject;
  }

  clearField() {
    const { onClearField, input } = this.props;
    this.input.current.value = '';
    if (input) {
      const event = new Event('input', { bubbles: true });
      this.input.current.dispatchEvent(event);
    }

    // Fire callback
    if (typeof onClearField === 'function') {
      onClearField();
    }

    // Set focus on input again
    setTimeout(() => { this.input.current.focus(); }, 5);
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

    const {
      label,
      endControl,
      startControl,
      required,
      clearFieldId
    } = cleanedProps;

    // Use omitProps here instead of separateComponentProps because
    // redux-form needs the abililty to directly manage the props it passes
    // down to the fields it manages. separateComponentProps requires us to
    // know the names of all the props we want to pass along, but we don't
    // know them.
    // this still feels kinda clumsy, but at least it's not broken.
    const inputCustom = omitProps(
      cleanedProps,
      [
        'label',
        'endControl',
        'startControl',
        'required',
        'fullWidth',
        'marginBottom0',
        'noBorder',
        'validationEnabled',
        'meta',
        'inputClass',
        'hasClearIcon',
        'ariaLabel',
        'onClearField',
        'clearFieldId',
        'validStylesEnabled',
        'focusedClass'
      ]
    );

    const component = (
      <input
        ref={this.input}
        className={this.getInputStyle()}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...inputProps}
        {...inputCustom}
        aria-required={required}
        aria-label={this.props.ariaLabel}
        autoComplete={this.props.autoComplete}
        autoFocus={this.props.autoFocus}
      />
    );

    let validation = null;
    let clearField = null;

    if (this.props.meta) {
      if (this.props.hasClearIcon
        && this.props.meta.active
        && !this.props.meta.asyncValidating
        && this.props.input
        && this.props.input.value !== '') {
        clearField = (
          <TextFieldIcon
            ariaLabel={this.props.intl.formatMessage({ id: 'stripes-components.clearThisField' })}
            onClick={this.clearField}
            tabIndex="-1"
            icon="clearX"
            id={clearFieldId || `clickable-${this.testId}-clear-field`}
          />
        );
      }

      if (validationEnabled && this.props.meta.asyncValidating) {
        validation = (
          <TextFieldIcon
            iconClassName={css.loadingIcon}
            ariaLabel={this.props.intl.formatMessage({ id: 'stripes-components.validatingInProcess' })}
            iconSize="small"
            icon="spinner-ellipsis"
          />
        );
      }

      // If validStylesEnabled is enabled we add some styling if the field is valid
      // This is disabled by default because it's primarily used when something is
      // getting validated on the server - e.g. checking for an email or similar.
      if (this.props.validStylesEnabled
        && validationEnabled
        && this.props.meta.touched
        && this.props.meta.dirty
        && !this.props.meta.active
        && this.props.meta.valid
        && !this.props.meta.asyncValidating) {
        validation = (
          <TextFieldIcon
            iconClassName={css.successIcon}
            ariaLabel={this.props.intl.formatMessage({ id: 'stripes-components.fieldIsValid' })}
            icon="validation-check"
            id={`icon-${this.testId}-validation-success`}
          />
        );
      }

      if (this.props.meta.touched
        && !this.props.meta.active
        && !this.props.meta.valid
        && !this.props.meta.asyncValidating) {
        if (this.input.current && (this.input.current.value === '' || !this.input.current.value)) {
          validation = validationEnabled && (
            <TextFieldIcon
              iconClassName={css.errorIcon}
              ariaLabel={this.props.intl.formatMessage({ id: 'stripes-components.fieldHasError' })}
              icon="validation-error"
              id={`icon-${this.testId}-validation-error`}
            />
          );
        } else {
          validation = validationEnabled && (
            <TextFieldIcon
              ariaLabel={this.props.intl.formatMessage({ id: 'stripes-components.fieldHasError' })}
              onClick={this.clearField}
              iconClassName={css.errorIcon}
              icon="validation-error"
              id={`icon-${this.testId}-validation-error`}
            />
          );
          clearField = this.props.hasClearIcon && (
            <TextFieldIcon
              ariaLabel={this.props.intl.formatMessage({ id: 'stripes-components.clearThisField' })}
              onClick={this.clearField}
              icon="clearX"
              id={clearFieldId || `clickable-${this.testId}-clear-field`}
            />
          );
        }
      }
    }

    const endControlElement = (
      <div className={css.endControls}>
        <div className={css.controlGroup} ref={this.endControl}>
          {!this.props.readOnly && clearField}{validation}{endControl}
        </div>
      </div>
    );

    const startControlElement = (
      <div className={css.startControls}>
        <div className={css.controlGroup} ref={this.startControl}>
          {startControl}
        </div>
      </div>
    );

    let warningElement;
    let errorElement;
    if (this.props.meta) {
      const { error, warning, touched } = this.props.meta;
      warningElement = touched && warning ? (
        <div className={formStyles.feedbackWarning}>{warning}</div>
      ) : null;
      errorElement = touched && error ? (
        <div className={formStyles.feedbackError}>{error}</div>
      ) : null;
    }

    const wrapperStyles = classNames(
      css.textField,
      { [this.props.focusedClass]: this.state.focused && this.props.focusedClass },
    );

    return (
      <div className={wrapperStyles}>
        { label && (
          <label
            htmlFor={this.props.id}
            className={formStyles.label}
          >
              {label}
          </label>
        )}
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

export default injectIntl(TextField, { withRef: true });
