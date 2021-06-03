import React from 'react';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

const propTypes = {

};

const TreeLevel = ({
  children,
  collection,
  totalChildren,
  childCollectionKey,
  ...rest
}) => {
  return (
    <>
      {collection.map((item) => (
        <TreeNode
          item={item}
          childCollectionKey={childCollectionKey}
          {...rest}
        >
          {children}
          {
            item[childCollectionKey]?.length < totalChildren
              ? (<button>Load more...</button>)
              : null
          }
        </TreeNode>
      ))}
    </>
  );
};

TreeLevel.propTypes = propTypes;

export default TreeLevel;
