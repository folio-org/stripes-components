import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import expandAll from './expandCollapseAll';
import Button from '../Button';
import { withAccordionStatus } from './AccordionStatusContext';

// returns true if more keys in status are set to false than true;
const majorityCollapsed = memoizeOne((status) => {
  const marjority = Object.keys(status).reduce(
    (accum, id) => (status[id] ? accum + 1 : accum - 1),
    0
  );
  return marjority < 0;
}, isEqual);

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
  if (setStatus) setStatus(newState);
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
  const expandLabel = expandLabelProp ||
    <FormattedMessage id="stripes-components.expandAll" />;
  const collapseLabel = collapseLabelProp ||
    <FormattedMessage id="stripes-components.collapseAll" />;

  const func = majorityCollapsed(accordionStatus);

  return (
    <Button
      buttonStyle="link bottomMargin0"
      id={id}
      onClick={() => { handleClick({ accordionStatus, func, setStatus, onToggle }); }}
      data-tast-expand-button
    >
      <strong>{func ? expandLabel : collapseLabel}</strong>
    </Button>
  );
};

ExpandAllButton.propTypes = propTypes;

export default withAccordionStatus(ExpandAllButton);
