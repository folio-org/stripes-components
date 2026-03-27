// @ts-nocheck
/*
 * OptionSegment
 * Component for building custon list options that take advantage of filter result highlighting.
 */

import React from "react";
import Highlighter from "../Highlighter";
import css from "./Selection.css";
type OptionSegmentProps = {
  children?: React.ReactNode | any[];
  innerText?: string;
  searchTerm?: string;
};

const OptionSegment = ({
  searchTerm,
  innerText,
  children,
}: OptionSegmentProps) => {
  const text = innerText || children;
  let rendered;
  if (!searchTerm || searchTerm === "" || typeof text !== "string") {
    rendered = text;
  } else {
    rendered = <Highlighter searchWords={searchTerm.split(" ")} text={text} />;
  }

  return (
    <div data-test-selection-option-segment className={css.optionSegment}>
      {rendered}
    </div>
  );
};

export default OptionSegment;
