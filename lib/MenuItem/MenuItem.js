import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const handleItemSelect = (e, props) => {
  const itemMetaData = props.itemMeta;
  if (itemMetaData) {
    return props.onClick(e, itemMetaData);
  }
  return props.onClick(e);
};


const MenuItem = props => (<div onClick={e => handleItemSelect(e, props)}> {props.children}</div>); // eslint-disable-line jsx-a11y/no-static-element-interactions

MenuItem.propTypes = propTypes;

export default MenuItem;
