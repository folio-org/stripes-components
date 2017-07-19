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
}

class FilterControlGroup extends React.Component {
  render() {
    return (
      <div>
        <label className={css.listTopLabel}>{this.props.label}</label>
        <ul className={css.filterList}>
          {React.Children.map(this.props.children, child => (
            <li key={child.id} className={css.listItem}>{child}</li>
          ), this)}
        </ul>
      </div>
    );
  }
}

export default FilterControlGroup;
