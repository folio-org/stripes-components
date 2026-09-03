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
import { SanitizedTextNode } from './SanitizedTextNode';
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

export const LexicalEditor = ({
  className,
  value,
  warning,
  error,
  label,
  id,
  required,
  readOnly,
  placeholder,
  editorClassName,
  onChange,
  sanitizeConfig,
  ...rest
}) => {
  const prepopulateRichText = (editor) => {
    const root = $getRoot();

    if (!value) {
      const paragraph = $createParagraphNode();
      root.append(paragraph);
    } else {
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      root.append(...nodes);
    }
  };

  const editorConfig = {
    namespace: 'LexicalEditor',
    editable: !readOnly,
    editorState: prepopulateRichText,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
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
    onError(_error) {
      throw _error;
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
      className,
    );
  };

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
    <div id={id} className={getRootStyle()}>
      {labelElement}
      <LexicalComposer initialConfig={editorConfig}>
        <LexicalEditorUI
          placeholder={placeholder}
          editorClassName={editorClassName}
          onChange={onChange}
          sanitizeConfig={sanitizeConfig}
          error={error}
          warning={warning}
          {...rest}
        />
      </LexicalComposer>
      <div role="alert">
        {warningElement}
        {errorElement}
      </div>
    </div>
  );
};

LexicalEditor.propTypes = propTypes;
