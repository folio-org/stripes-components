import React from 'react';
import PropTypes from 'prop-types';
import css from './FilterControlGroup.css';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  style: PropTypes.object,
};

const FilterControlGroup = props => (
  <ul
    style={props.style}
    className={css.filterList}
    aria-label={props.label}
  >
    {React.Children.map(props.children, child => (
      <li key={child.id} className={css.listItem}>{child}</li>
    ))}
  </ul>
);

FilterControlGroup.propTypes = propTypes;

export default FilterControlGroup;
