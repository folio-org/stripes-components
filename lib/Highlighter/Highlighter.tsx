// @ts-nocheck
/**
 * Highlighter
 */

import React from "react";
import ReactHighlightWords from "react-highlight-words";
import css from "./Highlighter.css";
type HighlightMarkProps = { children?: React.ReactNode; className?: string };
type HighlighterProps = {
  autoEscape?: boolean;
  className?: string;
  highlightClassName?: string;
  sanitize?: (...args: any[]) => any;
  searchWords?: string[];
  style?: Record<string, any>;
  text?: string;
};

const HighlightMark = ({ children, className }: HighlightMarkProps) => (
  <mark className={className.trim() || css.mark} data-test-highlighter-mark>
    {children}
  </mark>
);

const Highlighter = ({
  autoEscape = true,
  className,
  highlightClassName,
  searchWords = [],
  sanitize,
  style,
  text = "",
}: HighlighterProps) => (
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

export default Highlighter;
