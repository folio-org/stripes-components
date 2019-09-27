import React from 'react';
import childrenOf from '../childrenOf';
import ChildrenOfChild from './ChildrenOfChild';

const ChildrenOfComponent = ({ ...props }) => (
  <div>
    { [...props] }
  </div>
);

ChildrenOfComponent.propTypes = {
  ascendent: childrenOf(ChildrenOfChild),
  child: childrenOf(ChildrenOfChild).isRequired,
  contents: childrenOf([ChildrenOfChild, ChildrenOfChild]),
};

export default ChildrenOfComponent;
