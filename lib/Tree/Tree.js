import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {

};

const Tree = ({
  data,
  children,
  childCollectionKey,
}) => {
  return React.Children.toArray(children)
    .filter(child => !!child)
    .map((child) => {
      return React.cloneElement(child, {
        collection: data[childCollectionKey],
      });
    });
};

Tree.propTypes = propTypes;

export default Tree;
