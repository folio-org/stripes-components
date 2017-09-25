import React from 'react';
import PropTypes from 'prop-types';
import createChainedFunction from '../../util/createChainedFunction';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  itemMeta: PropTypes.object,
  onSelectItem: PropTypes.func,
};

// const handleItemSelect = (e, props) => {
//   const itemMetaData = props.itemMeta;
//   if (itemMetaData) {
//     return props.onClick(e, itemMetaData);
//   }
//   return props.onClick(e);
// };

const MenuItem = (props) => {
  const handleItemSelect = (e) => {
    const itemMetaData = props.itemMeta;
    props.onSelectItem(e, itemMetaData);
  };

  const renderChildren = () => React.Children.map(props.children, child =>
    React.cloneElement(
      child,
      Object.assign(
        {},
        child.props,
        { onClick: createChainedFunction(child.props.onClick, handleItemSelect) },
      ),
      child.props.children,
    ),
  );

  return (
    <div>
      {renderChildren()}
    </div>
  );
};

MenuItem.propTypes = propTypes;

export default MenuItem;
