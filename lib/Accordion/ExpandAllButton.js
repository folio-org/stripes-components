import React from 'react';
import PropTypes from 'prop-types';
import expandAll from './expandAll';
import Button from '../Button';

const propTypes = {
  accordionStatus: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  expandLabel: PropTypes.string,
  collapseLabel: PropTypes.string,
};

const defaultProps = {
  expandLabel: 'Expand all',
  collapseLabel: 'Collapse all',
};

const ExpandAllButton = (props) => {
  let expanded = 0;
  let collapsed = 0;
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
      <strong>{func ? props.expandLabel : props.collapseLabel}</strong>
    </Button>
  );
};

ExpandAllButton.propTypes = propTypes;
ExpandAllButton.defaultProps = defaultProps;

export default ExpandAllButton;
