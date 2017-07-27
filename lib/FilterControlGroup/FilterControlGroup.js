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
};

const FilterControlGroup = props => (
  <div>
    <div className={css.listTopLabel}>{props.label}</div>
    <ul className={css.filterList}>
      {React.Children.map(props.children, child => (
        <li key={child.id} className={css.listItem}>{child}</li>
      ))}
    </ul>
  </div>
);

FilterControlGroup.propTypes = propTypes;

export default FilterControlGroup;
