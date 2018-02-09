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

const MenuItem = (props) => {
  const handleItemSelect = (e) => {
    const itemMetaData = props.itemMeta;
    props.onSelectItem(itemMetaData, e);
  };

  const collectClickHandlers = (child) => {
    if (child.props) {
      return createChainedFunction(child.props.onClick, handleItemSelect);
    }
    return handleItemSelect;
  };

  const renderChildren = () => React.Children.map(props.children, child =>
    React.cloneElement(
      child,
      Object.assign(
        {},
        child.props,
        { onClick: collectClickHandlers(child) },
      ),
      child.props.children,
    ));

  return (
    <div>
      {renderChildren()}
    </div>
  );
};

MenuItem.propTypes = propTypes;

export default MenuItem;
