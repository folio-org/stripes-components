import React, {
  useMemo,
  useEffect,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extensions';
import DOMPurify from 'dompurify';

import { Toolbar } from './Toolbar';
import formField from '../FormField';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import parseMeta from '../FormField/parseMeta';
import Label from '../Label';

import formStyles from '../sharedStyles/form.css';
import css from './Editor.css';

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

const Editor = ({
  className,
  editorClassName,
  editorRef,
  disableEditorTab,
  dirty,
  error,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  placeholder,
  readOnly,
  required,
  sanitizeConfig,
  style,
  tabIndex,
  valid,
  validationEnabled,
  validStylesEnabled,
  warning,
  value,
  defaultValue,
  ...rest
}) => {
  const getSanitizeConfig = () => {
    const customAttrs = sanitizeConfig && Array.isArray(sanitizeConfig?.ADD_ATTR)
      ? sanitizeConfig.ADD_ATTR
      : [];

    return {
      ...baseSanitizeConfig,
      ...sanitizeConfig,
      ADD_ATTR: [...new Set([...baseSanitizeConfig.ADD_ATTR, ...customAttrs])],
    };
  };

  const extensions = useMemo(() => [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: placeholder || '',
    }),
  ], [placeholder]);

  const editor = useEditor({
    extensions,
    content: sanitize(defaultValue ?? value ?? '', getSanitizeConfig()),
    editable: !readOnly,
    onUpdate: ({ editor: currentEditor }) => {
      if (onChange) {
        onChange(sanitize(currentEditor.getHTML(), getSanitizeConfig()));
      }
    },
    onFocus: ({ event }) => {
      if (onFocus) onFocus(event);
    },
    onBlur: ({ event }) => {
      if (onBlur) onBlur(event);
    },
    coreExtensionOptions: {
      tabindex: {
        value: disableEditorTab ? '-1' : tabIndex,
      },
    },
    editorProps: {
      attributes: {
        id,
        class: css.contenteditable,
      },
      handleKeyDown: (view, event) => {
        if (disableEditorTab && event.key === 'Tab') {
          // returning true keep the browser's default focus management
          return true;
        }

        if (onKeyDown) onKeyDown(event);

        return false;
      },
      handleKeyPress: (view, event) => {
        if (onKeyPress) onKeyPress(event);
        return false;
      },
      handleDOMEvents: {
        keyup: (view, event) => {
          if (onKeyUp) onKeyUp(event);
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const sanitizedValue = sanitize(value, getSanitizeConfig());
      const currentHTML = editor.getHTML();

      if (sanitizedValue !== currentHTML) {
        editor.commands.setContent(sanitizedValue, { emitUpdate: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  useImperativeHandle(editorRef, () => editor, [editor]);

  const getRootStyle = () => classNames(
    formStyles.inputGroup,
    className,
  );

  const getEditorStyle = () => classNames(
    sharedInputStylesHelper({
      dirty,
      error,
      valid,
      warning,
      validationEnabled,
      validStylesEnabled,
      readOnly,
    }),
    css.editor,
    editorClassName,
  );

  const warningElement = warning ?
    <div className={formStyles.feedbackWarning}>{warning}</div> : null;

  const errorElement = error ?
    <div className={formStyles.feedbackError}>{error}</div> : null;

  const labelElement = label ?
    <Label
      htmlFor={id}
      required={required}
      readOnly={readOnly}
    >
      {label}
    </Label>
    : null;

  return (
    <div className={getRootStyle()} style={style}>
      {labelElement}
      <div className={getEditorStyle()}>
        {!readOnly && <Toolbar editor={editor} disabled={readOnly} />}
        <EditorContent
          className={css.editorContent}
          editor={editor}
          {...omitProps(rest, ['modules', 'formats'])}
        />
      </div>
      <div role="alert">
        {warningElement}
        {errorElement}
      </div>
    </div>
  );
};

Editor.propTypes = {
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
  id: PropTypes.string,
  label: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
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

Editor.defaultProps = {
  validationEnabled: true,
  validStylesEnabled: false,
  required: false,
  readOnly: false,
  disableEditorTab: true,
  sanitizeConfig: {},
};

export default formField(
  Editor,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
