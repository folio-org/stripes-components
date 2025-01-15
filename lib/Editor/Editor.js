import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import ReactQuill from 'react-quill';
import merge from 'lodash/merge';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!react-quill/dist/quill.snow.css';

import formField from '../FormField';
import css from './Editor.css';
import omitProps from '../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formStyles from '../sharedStyles/form.css';
import parseMeta from '../FormField/parseMeta';
import Label from '../Label';

const defaultModulesConfig = {
  clipboard: {
    matchVisual: false,
  },
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

    const component = (
      <ReactQuill
        className={this.getEditorStyle()}
        modules={this.modules}
        formats={formats}
        ref={editorRef}
        readOnly={readOnly}
        theme="snow"
        {...omitProps(restProps, [
          'validationEnabled',
          'validStylesEnabled',
          'modules',
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
