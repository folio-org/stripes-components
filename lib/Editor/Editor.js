import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import merge from 'lodash/merge';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!react-quill/dist/quill.snow.css';

import formField from '../FormField';
import css from './Editor.css';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formStyles from '../sharedStyles/form.css';
import parseMeta from '../FormField/parseMeta';
import Label from '../Label';

const defaultModulesConfig = {
  clipboard: {
    matchVisual: false,
  },
};

// this default config allows <a> tags with target and rel attributes,
// which the editor itself generates.
const baseSanitizeConfig = {
  ADD_ATTR: ['target', 'rel'],
};

const sanitize = (value, config = baseSanitizeConfig) => {
  let resultValue = DOMPurify.sanitize(value, config);

  if (value !== resultValue) {
    // Preserve original HTML when DOMPurify reports no actual removals.
    // This addresses cases where DOMPurify may have reversed the order of attributes.
    // If the editor picks up a change in its value, it will shift the cursor to the beginning of the text.
    if (DOMPurify.removed.length === 0) {
      resultValue = value;
    }
  }

  return resultValue;
};

class Editor extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    dirty: PropTypes.bool,
    disableEditorTab: PropTypes.bool,
    editorClassName: PropTypes.string,
    editorRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object
    ]),
    error: PropTypes.node,
    formats: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    label: PropTypes.node,
    modules: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    placeholder: PropTypes.string,
    preserveWhitespace: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    sanitizeConfig: PropTypes.object,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    valid: PropTypes.bool,
    validationEnabled: PropTypes.bool,
    validStylesEnabled: PropTypes.bool,
    value: PropTypes.string,
    warning: PropTypes.node,
  };

  static defaultProps = {
    validationEnabled: true,
    validStylesEnabled: false,
    required: false,
    readOnly: false,
    disableEditorTab: true,
    modules: {},
    sanitizeConfig: {},
  };

  constructor(props) {
    super(props);

    this.modules = merge({}, defaultModulesConfig, props.modules);

    if (props.disableEditorTab) {
      const tabBinding = {
        keyboard: {
          bindings: {
            tab: {
              key: 9,
              handler: () => true,
            }
          },
        },
      };
      this.modules = merge({}, this.modules, tabBinding);
    }
  }

  getRootStyle() {
    return className(
      formStyles.inputGroup,
      this.props.className,
    );
  }

  getEditorStyle() {
    return className(
      sharedInputStylesHelper(this.props),
      css.editor,
      this.props.editorClassName,
    );
  }

  getSanitizeConfig() {
    const { sanitizeConfig } = this.props;
    const customAttrs = sanitizeConfig && Array.isArray(sanitizeConfig?.ADD_ATTR)
      ? sanitizeConfig.ADD_ATTR
      : [];

    return {
      ...baseSanitizeConfig,
      ...sanitizeConfig,
      ADD_ATTR: [...new Set([...baseSanitizeConfig.ADD_ATTR, ...customAttrs])],
    };
  }

  // carry through all of the params that the basic onChange handler of React-quill receives.
  onChange = (value, delta, source, editor) => {
    const { onChange } = this.props;
    const sanitizeConfig = this.getSanitizeConfig();

    if (onChange) {
      onChange(sanitize(value, sanitizeConfig), delta, source, editor);
    }
  };

  render() {
    const {
      error,
      editorRef,
      label,
      readOnly,
      required,
      warning,
      formats,
      ...restProps
    } = this.props;
    const sanitizeConfig = this.getSanitizeConfig();

    const inputValue = typeof restProps.value === 'string' ? sanitize(restProps.value, sanitizeConfig) : restProps.value;
    const inputDefaultValue = typeof restProps.defaultValue === 'string'
      ? sanitize(restProps.defaultValue, sanitizeConfig)
      : restProps.defaultValue;

    const component = (
      <ReactQuill
        className={this.getEditorStyle()}
        modules={this.modules}
        formats={formats}
        ref={editorRef}
        readOnly={readOnly}
        value={inputValue}
        defaultValue={inputDefaultValue}
        onChange={this.onChange}
        theme="snow"
        {...omitProps(restProps, [
          'validationEnabled',
          'validStylesEnabled',
          'modules',
          'onChange',
          'defaultValue',
          'sanitizeConfig',
          'value',
        ])}
      />
    );

    const warningElement = warning ?
      <div className={formStyles.feedbackWarning}>{warning}</div> : null;

    const errorElement = error ?
      <div className={formStyles.feedbackError}>{error}</div> : null;

    const labelElement = label ?
      <Label
        htmlFor={this.props.id}
        required={required}
        readOnly={readOnly}
      >
        {label}
      </Label>
      : null;

    return (
      <div className={this.getRootStyle()}>
        {labelElement}
        {component}
        <div role="alert">
          {warningElement}
          {errorElement}
        </div>
      </div>
    );
  }
}

export default formField(
  Editor,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
