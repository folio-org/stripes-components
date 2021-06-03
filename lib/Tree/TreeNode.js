import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
} from '../..';

const propTypes = {

};

const TreeNode = ({
  children,
  content,
  defaultOpen,
  onClick,
  onToggle,
  childCollectionKey,
  item,
  loadChildren,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [childrenLoading, setChildrenLoading] = useState(false);

  const itemChildren = item[childCollectionKey];

  useEffect(() => {
    if (childrenLoading && itemChildren.length) {
      setChildrenLoading(false);
    }
  }, [itemChildren, childrenLoading]);

  const renderContent = () => {
    if (typeof content === 'function') {
      return content(item);
    }

    return content;
  };

  const showToggleButton = !!children;

  const renderChildren = () => {
    return React.Children.toArray(children)
      .filter(child => !!child)
      .map((child) => {
        return React.cloneElement(child, {
          collection: item[childCollectionKey],
        });
      });
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;

    if (!item[childCollectionKey]?.length && loadChildren && !childrenLoading) {
      setChildrenLoading(true);
      loadChildren(item);
    }

    setIsOpen(newIsOpen);
    onToggle(newIsOpen);
  };

  const getIconName = () => {
    if (childrenLoading) {
      return 'spinner';
    }

    return isOpen ? 'caret-up' : 'caret-down';
  };

  return (
    <div>
      {showToggleButton && (
        <IconButton
          icon={getIconName()}
          onClick={handleToggle}
        />
      )}
      <div
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {renderContent(item)}
      </div>
      <div style={{ paddingLeft: '2rem' }}>
        {isOpen && renderChildren(item)}
      </div>
    </div>
  );
};

TreeNode.defaultProps = {
  onToggle: () => {},
};
TreeNode.propTypes = propTypes;

export default TreeNode;
