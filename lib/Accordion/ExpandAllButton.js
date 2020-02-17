import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import expandAll from './expandCollapseAll';
import Button from '../Button';
import { withAccordionStatus } from './AccordionStatusContext';

const majorityCollapsed = (status) => {
  const marjority = Object.keys(status).reduce(
    (accum, id) => (status[id] ? accum + 1 : accum - 1),
    0
  );
  return marjority <= 0;
};

const propTypes = {
  accordionStatus: PropTypes.object,
  collapseLabel: PropTypes.node,
  expandLabel: PropTypes.node,
  id: PropTypes.string,
  onToggle: PropTypes.func,
};

const ExpandAllButton = ({
  accordionStatus,
  collapseLabel: collapseLabelProp,
  expandLabel: expandLabelProp,
  id,
  onToggle
}) => {
  const expandLabel = expandLabelProp ||
    <FormattedMessage id="stripes-components.expandAll" />;
  const collapseLabel = collapseLabelProp ||
    <FormattedMessage id="stripes-components.collapseAll" />;

  const func = majorityCollapsed(accordionStatus);

  function handleClick() {
    const newState = expandAll(accordionStatus, func);
    onToggle(newState);
  }

  return (
    <Button
      buttonStyle="link bottomMargin0"
      id={id}
      onClick={handleClick}
      data-tast-expand-button
    >
      <strong>{func ? expandLabel : collapseLabel}</strong>
    </Button>
  );
};

ExpandAllButton.propTypes = propTypes;

export default withAccordionStatus(ExpandAllButton);
