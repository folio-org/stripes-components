import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import expandAll from './expandAll';
import Button from '../Button';

const propTypes = {
  accordionStatus: PropTypes.object.isRequired,
  collapseLabel: PropTypes.string,
  expandLabel: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
};

const ExpandAllButton = (props) => {
  let expanded = 0;
  let collapsed = 0;
  const expandLabel = props.expandLabel
    ? props.expandLabel
    : <FormattedMessage id="stripes-components.expandAll" />;
  const collapseLabel = props.collapseLabel
    ? props.collapseLabel
    : <FormattedMessage id="stripes-components.collapseAll" />;
  Object.keys(props.accordionStatus).forEach((p) => {
    if (props.accordionStatus[p]) {
      expanded += 1;
    } else {
      collapsed += 1;
    }
  });

  let func = true;
  if (expanded >= collapsed) {
    func = false;
  }

  function handleClick() {
    const newState = expandAll(props.accordionStatus, func);
    props.onToggle(newState);
  }

  return (
    <Button
      buttonStyle="link bottomMargin0"
      onClick={handleClick}
    >
      <strong>{func ? expandLabel : collapseLabel}</strong>
    </Button>
  );
};

ExpandAllButton.propTypes = propTypes;

export default ExpandAllButton;
