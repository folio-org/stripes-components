import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import {
  ListNode,
  ListItemNode,
} from '@lexical/list';
import { LinkNode } from '@lexical/link';
import {
  $createParagraphNode,
  $getRoot,
  ParagraphNode,
  TextNode,
} from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { HeadingNode } from '@lexical/rich-text';

import { LexicalEditorUI } from './LexicalEditorUI';
import formField from '../FormField';
import parseMeta from '../FormField/parseMeta';
import Label from '../Label';

import formStyles from '../sharedStyles/form.css';
import css from './LexicalEditor.css';

const propTypes = {
  className: PropTypes.string,
  dirty: PropTypes.bool,
  editorClassName: PropTypes.string,
  error: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  sanitizeConfig: PropTypes.object,
  valid: PropTypes.bool,
  validationEnabled: PropTypes.bool,
  validStylesEnabled: PropTypes.bool,
  value: PropTypes.string,
  warning: PropTypes.node,
};

const LexicalEditor = (props) => {
  const prepopulateRichText = (editor) => {
    const root = $getRoot();

    if (!props.value) {
      const paragraph = $createParagraphNode();
      root.append(paragraph);
    } else {
      const parser = new DOMParser();
      const dom = parser.parseFromString(props.value, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      root.append(...nodes);
    }
  };

  const editorConfig = {
    namespace: 'LexicalEditor',
    editorState: prepopulateRichText,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ParagraphNode,
      TextNode,
    ],
    onError(error) {
      throw error;
    },
    theme: {
      heading: {
        h1: css.editorHeadingH1,
        h2: css.editorHeadingH2,
        h3: css.editorHeadingH3,
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

  const getRootStyle = () => {
    return classNames(
      formStyles.inputGroup,
      props.className,
    );
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
    <div id={props.id} className={getRootStyle()}>
      {labelElement}
      <LexicalComposer initialConfig={editorConfig}>
        <LexicalEditorUI
          placeholder={props.placeholder}
          editorClassName={props.editorClassName}
          onChange={props.onChange}
          sanitizeConfig={props.sanitizeConfig}
          onBlur={props.onBlur}
          {...props}
        />
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
  ({ meta, input }) => ({
    onBlur: input.onBlur,
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);

export { LexicalEditorWithFieldProps as LexicalEditor };
