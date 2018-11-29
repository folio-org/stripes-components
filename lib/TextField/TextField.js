import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import reduxFormField from '../ReduxFormField';
import TextFieldIcon from './TextFieldIcon';
import css from './TextField.css';
import formStyles from '../sharedStyles/form.css';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import omitProps from '../../util/omitProps';

class TextField extends Component {
  static propTypes = {
    /**
     * Apply an ARIA label.
     */
    ariaLabel: PropTypes.string,
    /**
     * Toggle browser autocomplete.
     */
    autoComplete: PropTypes.string,
    /**
     * Focus input on mount.
     */
    autoFocus: PropTypes.bool,
    /**
     * Apply class names to the root element
     */
    className: PropTypes.string,
    /**
     * Id to apply to clear field button.
     */
    clearFieldId: PropTypes.string,
    /**
     * TextField has changes.
     */
    dirty: PropTypes.bool,
    /**
     * Disabled TextField.
     */
    disabled: PropTypes.bool,
    /**
     * Control or Icon to display at the end of the textfield.
     */
    endControl: PropTypes.element,
    /**
     * Error string to display after input.
     */
    error: PropTypes.node,
    /**
     * Apply CSS class on wrapper element on focus.
     */
    focusedClass: PropTypes.string,
    /**
     * Should the input fill its container?
     */
    fullWidth: PropTypes.bool,
    /**
     * When set to false, will not show clear button.
     */
    hasClearIcon: PropTypes.bool,
    /**
     * ID of the input.
     */
    id: PropTypes.string,
    /**
     * Class applied to the input.
     */
    inputClass: PropTypes.string,
    /**
     * String of preset styles to apply to textfield. possible values: noBorder
     */
    inputStyle: PropTypes.string,
    /**
     * The content for the input's label.
     */
    label: PropTypes.node,
    /**
     * Applies a loading animation.
     */
    loading: PropTypes.bool,
    /**
     * Remove bottom margin.
     */
    marginBottom0: PropTypes.bool,
    /**
     * The name of the input.
     */
    name: PropTypes.string,
    /**
     * Remove input border.
     */
    noBorder: PropTypes.bool,
    /**
     * Callback fired when the input is blurred.
     */
    onBlur: PropTypes.func,
    /**
     * Event handler for text input. Required if a value is supplied.
     */
    onChange: PropTypes.func,
    /**
     * Callback fired when the input is cleared.
     */
    onClearField: PropTypes.func,
    /**
     * Callback fired when the input is focused.
     */
    onFocus: PropTypes.func,
    /**
     * Render textfield as readonly, disable clear action.
     */
    readOnly: PropTypes.bool,
    /**
     * Determines whether required attribute is set to true.
     */
    required: PropTypes.bool,
    /**
     * Control or Icon to display at the start of the textfield.
     */
    startControl: PropTypes.element,
    /**
     * Has the input been touched?
     */
    touched: PropTypes.bool,
    /**
     * Can be "text" or "number". Standard html attribute.
     */
    type: PropTypes.string,
    /**
     * Applies valid class to input.
     */
    valid: PropTypes.bool,
    /**
     * When set to false, will not show validation states.
     */
    validationEnabled: PropTypes.bool,
    /**
     * When set to true, will apply style for successfully validated input.
     */
    validStylesEnabled: PropTypes.bool,
    /**
     * String of text to display after input.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    /**
     * Warning string.
     */
    warning: PropTypes.node,
  };

  static defaultProps = {
    hasClearIcon: true,
    type: 'text',
    validationEnabled: true,
    value: ''
  };

  constructor(props) {
    super(props);

    this.input = React.createRef();
    this.startControl = React.createRef();
    this.endControl = React.createRef();

    this.clearField = this.clearField.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      focused: false,
      prevPropsValue: props.value, // eslint-disable-line react/no-unused-state
      value: props.value
    };

    // if no id has been supplied, generate a unique one
    if (Object.prototype.hasOwnProperty.call(props, 'id')) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId('text-input-');
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.prevPropsValue) {
      return {
        prevPropsValue: props.value,
        value: props.value
      };
    }
    return null;
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
    );
  }

  focusInput() {
    this.input.current.focus();
  }

  onFocus = event => {
    const { onFocus } = this.props;

    if (!this.state.focused) {
      this.setState({
        focused: true
      });

      if (typeof onFocus === 'function') {
        onFocus(event);
      }
    }
  }

  onBlur = event => {
    const { onBlur } = this.props;
    const { currentTarget, relatedTarget } = event;

    if (!(relatedTarget && currentTarget.contains(relatedTarget))) {
      this.setState({
        focused: false
      });

      if (typeof onBlur === 'function') {
        onBlur(event);
      }
    }
  }

  clearField() {
    const { onClearField } = this.props;

    this.setState({ value: '' }, () => {
      // Fire callback
      if (typeof onClearField === 'function') {
        onClearField();
      }

      // Set focus on input again
      this.focusInput();
    });
  }

  handleChange(event) {
    const { onChange } = this.props;
    this.setState({
      value: event.target.value
    });

    // Fire callback
    if (typeof onChange === 'function') {
      onChange(event);
    }
  }

  render() {
    const {
      clearFieldId,
      endControl,
      label,
      name,
      required,
      startControl,
      validationEnabled
    } = this.props;

    // Use omitProps here instead of separateComponentProps because
    // redux-form needs the abililty to directly manage the props it passes
    // down to the fields it manages. separateComponentProps requires us to
    // know the names of all the props we want to pass along, but we don't
    // know them.
    // this still feels kinda clumsy, but at least it's not broken.
    const inputCustom = omitProps(
      this.props,
      [
        'ariaLabel',
        'clearFieldId',
        'dirty',
        'endControl',
        'focusedClass',
        'fullWidth',
        'hasClearIcon',
        'inputClass',
        'label',
        'loading',
        'marginBottom0',
        'noBorder',
        'onClearField',
        'onFocus',
        'required',
        'startControl',
        'touched',
        'valid',
        'validationEnabled',
        'validStylesEnabled'
      ]
    );

    const component = (
      <input
        {...inputCustom}
        aria-label={this.props.ariaLabel}
        aria-required={required}
        aria-invalid={!!(this.props.error)}
        autoComplete={this.props.autoComplete}
        autoFocus={this.props.autoFocus}
        name={name}
        onChange={this.handleChange}
        ref={this.input}
        required={required}
        value={this.state.value}
        className={this.props.inputClass}
      />
    );

    let validation = null;
    let clearField = null;
    let startControlElement;
    let endControlElement;

    if (this.props.hasClearIcon
      && !this.props.loading
      && this.state.focused
      && this.state.value) {
      clearField = (
        <FormattedMessage id="stripes-components.clearThisField">
          {ariaLabel => (
            <TextFieldIcon
              ariaLabel={ariaLabel}
              icon="times-circle-solid"
              id={clearFieldId || `clickable-${this.testId}-clear-field`}
              onClick={this.clearField}
              tabIndex="-1"
            />
          )}
        </FormattedMessage>
      );
    }

    // If validStylesEnabled is enabled we add some styling if the field is valid
    // This is disabled by default because it's primarily used when something is
    // getting validated on the server - e.g. checking for an email or similar.
    if (this.props.validStylesEnabled
      && validationEnabled
      && this.props.valid) {
      validation = (
        <FormattedMessage id="stripes-components.fieldIsValid">
          {ariaLabel => (
            <TextFieldIcon
              ariaLabel={ariaLabel}
              icon="check-circle"
              iconClassName={css.successIcon}
              id={`icon-${this.testId}-validation-success`}
            />
          )}
        </FormattedMessage>
      );
    }

    if (validationEnabled && this.props.error) {
      validation = (
        <FormattedMessage id="stripes-components.fieldHasError">
          {ariaLabel => (
            <TextFieldIcon
              ariaLabel={ariaLabel}
              icon="exclamation-circle"
              iconClassName={css.errorIcon}
              id={`icon-${this.testId}-validation-error`}
            />
          )}
        </FormattedMessage>
      );
    }

    if (this.props.loading) {
      validation = (
        <FormattedMessage id="stripes-components.validatingInProcess">
          {ariaLabel => (
            <TextFieldIcon
              ariaLabel={ariaLabel}
              icon="spinner-ellipsis"
              iconClassName={css.loadingIcon}
              iconSize="small"
            />
          )}
        </FormattedMessage>
      );
    }

    if ((!this.props.readOnly && clearField) || validation || endControl) {
      endControlElement = (
        <div className={css.endControls}>
          <div className={css.controlGroup} ref={this.endControl}>
            {!this.props.readOnly && clearField}
            {validation}
            {endControl}
          </div>
        </div>
      );
    }

    if (startControl) {
      startControlElement = (
        <div className={css.startControls}>
          <div className={css.controlGroup} ref={this.startControl}>
            {startControl}
          </div>
        </div>
      );
    }

    const warningElement = this.props.warning ? (
      <div className={formStyles.feedbackWarning}>{this.props.warning}</div>
    ) : null;

    const errorElement = this.props.error ? (
      <div className={formStyles.feedbackError}>{this.props.error}</div>
    ) : null;

    const wrapperStyles = classNames(
      css.textField,
      { [this.props.focusedClass]: this.state.focused && this.props.focusedClass },
      this.props.className,
    );

    const inputGroupStyles = classNames(this.getInputStyle(), css.inputGroup, {
      [formStyles.isDisabled]: this.props.disabled,
      [formStyles.isFocused]: this.state.focused
    });

    return (
      <div className={wrapperStyles}>
        { label && (
          <label
            htmlFor={this.props.id}
            className={formStyles.label}
          >
              {label}
              { this.props.readOnly && <TextFieldIcon iconSize="small" icon="lock" /> }
          </label>
        )}
        <div
          className={inputGroupStyles}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {startControlElement}
          {component}
          {endControlElement}
        </div>
        <div role="alert">
          {warningElement}
          {errorElement}
        </div>
      </div>
    );
  }
}

export default reduxFormField(
  TextField,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    touched: meta.touched,
    valid: meta.valid,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
