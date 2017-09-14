import React from 'react';
import Button from '@folio/stripes-components/lib/Button';
import PropTypes from 'prop-types';
import expandAll from './expandAll';

const propTypes = {
  accordionStatus: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  expandString: PropTypes.string,
  collapseString: PropTypes.string,
}

const defaultProps = {
  expandLabel: 'Expand All',
  collapseLabel: 'Collapse All',
}

const ExpandAllButton = (props) => {
  let expanded = 0;
  let collapsed = 0;
  Object.keys(props.accordionStatus).forEach((p) => {
    props.accordionStatus[p] ? expanded += 1 : collapsed += 1; 
  });

  let func = true;
  if(expanded >= collapsed) {
    func = false;
  }

  function handleClick() {
    const newState = expandAll(props.accordionStatus, func);
    props.onToggle(newState);
  }

  return (
    <Button 
      buttonStyle="mlink"
      onClick={handleClick}>
        <strong>{func ? props.expandLabel : props.collapseLabel}</strong>
    </Button>
  );
};

ExpandAllButton.propTypes = propTypes;
ExpandAllButton.defaultProps = defaultProps;

export default ExpandAllButton;