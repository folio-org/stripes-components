// @ts-nocheck
import React from "react";
import OptionSegment from "./OptionSegment";
type DefaultOptionFormatterProps = {
  option?: Record<string, any>;
  searchTerm?: string;
};

const DefaultOptionFormatter = ({
  option,
  searchTerm,
}: DefaultOptionFormatterProps) => {
  return option ? (
    <OptionSegment searchTerm={searchTerm}>{option.label}</OptionSegment>
  ) : null;
};

export default DefaultOptionFormatter;
