import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';

import { ToolbarPlugin } from './ToolbarPlugin/ToolbarPlugin';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';

import css from './LexicalEditor.css';

// this default config allows <a> tags with target and rel attributes,
// which the editor itself generates.
const baseSanitizeConfig = {
  ADD_ATTR: ['target', 'rel'],
  FORBID_ATTR: ['class'],
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

const propTypes = {
  editorClassName: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  sanitizeConfig: PropTypes.object,
};

export const LexicalEditorUI = (props) => {
  const getEditorStyle = () => {
    return classNames(
      sharedInputStylesHelper(props),
      css.editorContainer,
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
  const handleChange = (editorState, _editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(_editor);

      props.onChange(sanitize(html, getSanitizeConfig()));
    });
  };

  return (
    <div className={getEditorStyle()}>
      <ToolbarPlugin />
      <div className={css.editorInner}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={css.editorInput}
              aria-placeholder={props.placeholder}
              placeholder={
                <div className={css.editorPlaceholder}>{props.placeholder}</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </div>
  );
};

LexicalEditorUI.propTypes = propTypes;
