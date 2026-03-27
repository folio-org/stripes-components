// @ts-nocheck
import React from "react";
import { flushSync } from "react-dom";
import { FormattedMessage } from "react-intl";
import isEqual from "lodash/isEqual";
import memoizeOne from "memoize-one";
import expandAll from "./expandCollapseAll";
import Button from "../Button";
import { withAccordionStatus } from "./AccordionStatusContext";

// returns true if more keys in status are set to false than true;
type ExpandAllButtonProps = {
  accordionStatus?: Record<string, any>;
  collapseLabel?: React.ReactNode;
  expandLabel?: React.ReactNode;
  id?: string;
  onToggle?: (...args: any[]) => any;
  setStatus?: (...args: any[]) => any;
};
const majorityCollapsed = memoizeOne((status) => {
  const marjority = Object.keys(status).reduce(
    (accum, id) => (status[id] ? accum + 1 : accum - 1),
    0,
  );
  return marjority < 0;
}, isEqual);

function handleClick({ accordionStatus, func, setStatus, onToggle }) {
  const newState = expandAll(accordionStatus, func);
  if (setStatus) {
    // we want the button change to be snappy, so we go ahead and push
    // the state update to immediate mode vs React v18's batching.
    flushSync(() => setStatus(newState));
  }
  if (onToggle) onToggle(newState);
}

const ExpandAllButton = ({
  accordionStatus,
  collapseLabel: collapseLabelProp,
  expandLabel: expandLabelProp,
  id,
  onToggle,
  setStatus,
}: ExpandAllButtonProps) => {
  const expandLabel = expandLabelProp || (
    <FormattedMessage id="stripes-components.expandAll" />
  );
  const collapseLabel = collapseLabelProp || (
    <FormattedMessage id="stripes-components.collapseAll" />
  );

  const func = majorityCollapsed(accordionStatus);

  return (
    <Button
      buttonStyle="link bottomMargin0"
      id={id}
      onClick={() => {
        handleClick({ accordionStatus, func, setStatus, onToggle });
      }}
      data-test-expand-button
    >
      <strong>{func ? expandLabel : collapseLabel}</strong>
    </Button>
  );
};

export default withAccordionStatus(ExpandAllButton);
