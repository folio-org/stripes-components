import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import DOMPurify from 'dompurify';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';

import {
  ListNode,
  ListItemNode,
} from '@lexical/list';
import {
  LinkNode,
  AutoLinkNode,
} from '@lexical/link';
import {
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { $generateHtmlFromNodes } from '@lexical/html';
import {
  ParagraphNode,
  TextNode,
} from 'lexical';

import { ToolbarPlugin } from './ToolbarPlugin/ToolbarPlugin';
import { SanitizedTextNode } from './SanitizedTextNode';
import formField from '../FormField';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import parseMeta from '../FormField/parseMeta';
import Label from '../Label';

import formStyles from '../sharedStyles/form.css';
import css from './LexicalEditor.css';

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

const placeholder = 'Enter some rich text...';

const editorConfig = {
  namespace: 'React.js Demo',
  nodes: [
    ListNode,
    ListItemNode,
    AutoLinkNode,
    LinkNode,
    ParagraphNode,
    SanitizedTextNode,
    {
      replace: TextNode,
      with: (node) => {
        return new SanitizedTextNode(node.__text);
      },
    },
  ],
  onError(error) {
    throw error;
  },
  theme: {
    heading: {
      h1: css.editorHeadingH1,
      h2: css.editorHeadingH2,
      h3: css.editorHeadingH3,
      h4: css.editorHeadingH4,
      h5: css.editorHeadingH5,
    },
    link: css.editorLink,
    list: {
      listitem: css.editorListItem,
      nested: {
        listitem: css.editorNestedListItem,
      },
      ol: css.editorListOl,
      ul: css.editorListUl,
    },
    paragraph: css.editorParagraph,
    placeholder: css.editorPlaceholder,
    text: {
      bold: css.editorTextBold,
      italic: css.editorTextItalic,
      strikethrough: css.editorTextStrikethrough,
      underline: css.editorTextUnderline,
    },
  },
};

const propTypes = {
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

const LexicalEditor = (props) => {
  const getRootStyle = () => {
    return className(
      formStyles.inputGroup,
      props.className,
    );
  };

  const getEditorStyle = () => {
    return className(
      sharedInputStylesHelper(props),
      props.editorClassName,
    );
  };

  const getSanitizeConfig = () => {
    const { sanitizeConfig } = props;
    const customAttrs = sanitizeConfig && Array.isArray(sanitizeConfig?.ADD_ATTR)
      ? sanitizeConfig.ADD_ATTR
      : [];

    return {
      ...baseSanitizeConfig,
      ...sanitizeConfig,
      ADD_ATTR: [...new Set([...baseSanitizeConfig.ADD_ATTR, ...customAttrs])],
    };
  };

  // carry through all of the params that the basic onChange handler of React-quill receives.
  const onChange = (editorState, editor) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      console.log(markdown);

      const html = $generateHtmlFromNodes(editor);
      console.log(sanitize(html, getSanitizeConfig()));
    });

    // if (props.onChangeProp) {
    //   props.onChangeProp(sanitize(value, sanitizeConfig), delta, source, editor);
    // }
  };

  const warningElement = props.warning ?
    <div className={formStyles.feedbackWarning}>{props.warning}</div> : null;

  const errorElement = props.error ?
    <div className={formStyles.feedbackError}>{props.error}</div> : null;

  const labelElement = props.label ?
    <Label
      htmlFor={props.id}
      required={props.required}
      readOnly={props.readOnly}
    >
      {props.label}
    </Label>
    : null;

  return (
    <div className={getRootStyle()}>
      {labelElement}
      <LexicalComposer initialConfig={editorConfig}>
        <div className={css.editorContainer}>
          <ToolbarPlugin />
          <div className={css.editorInner}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={css.editorInput}
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className={css.editorPlaceholder}>{placeholder}</div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <OnChangePlugin onChange={onChange} />
          </div>
        </div>
      </LexicalComposer>
      <div role="alert">
        {warningElement}
        {errorElement}
      </div>
    </div>
  );
};

LexicalEditor.propTypes = propTypes

const LexicalEditorWithFieldProps = formField(
  LexicalEditor,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);

export { LexicalEditorWithFieldProps as LexicalEditor };
