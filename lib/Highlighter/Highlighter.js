/**
 * Highlighter
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactHighlightWords from 'react-highlight-words';
import css from './Highlighter.css';

const HighlightMark = ({ children, className }) => (
  <mark className={className.trim() || css.mark} data-test-highlighter-mark>{children}</mark>
);

HighlightMark.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const Highlighter = ({
  autoEscape = true,
  className,
  highlightClassName,
  searchWords = [],
  sanitize,
  style,
  text = '',
}) => (
  <ReactHighlightWords
    data-test-highlighter
    autoEscape={autoEscape}
    className={className}
    highlightTag={HighlightMark}
    highlightClassName={highlightClassName}
    sanitize={sanitize}
    searchWords={searchWords}
    style={style}
    textToHighlight={text}
  />
);

Highlighter.propTypes = {
  autoEscape: PropTypes.bool,
  className: PropTypes.string,
  highlightClassName: PropTypes.string,
  sanitize: PropTypes.func,
  searchWords: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.object,
  text: PropTypes.string,
};

export default Highlighter;
