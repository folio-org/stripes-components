import React, { useMemo } from 'react';
import { flushSync } from 'react-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import expandAll from './expandCollapseAll';
import Button from '../Button';
import { withAccordionStatus } from './AccordionStatusContext';

// returns true if more keys in status are set to false than true;
const majorityCollapsed = (status) => {
  const marjority = Object.keys(status).reduce(
    (accum, id) => (status[id] ? accum + 1 : accum - 1),
    0
  );
  return marjority < 0;
};

const propTypes = {
  accordionStatus: PropTypes.object,
  collapseLabel: PropTypes.node,
  expandLabel: PropTypes.node,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  setStatus: PropTypes.func,
};

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
}) => {
  const func = useMemo(majorityCollapsed(accordionStatus), Object.values(accordionStatus));
  const expandLabel = expandLabelProp ||
    <FormattedMessage id="stripes-components.expandAll" />;
  const collapseLabel = collapseLabelProp ||
    <FormattedMessage id="stripes-components.collapseAll" />;

  return (
    <Button
      buttonStyle="link bottomMargin0"
      id={id}
      onClick={() => { handleClick({ accordionStatus, func, setStatus, onToggle }); }}
      data-test-expand-button
    >
      <strong>{func ? expandLabel : collapseLabel}</strong>
    </Button>
  );
};

ExpandAllButton.propTypes = propTypes;

export default withAccordionStatus(ExpandAllButton);
