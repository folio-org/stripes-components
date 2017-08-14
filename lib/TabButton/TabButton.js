import React from 'react';
import PropTypes from 'prop-types';
import css from './TabButton.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
};

function TabButton(props) {
  const { children, ...buttonProps } = props;

  return (
    <div
      type="button"
      className={css.tabButton}
      {...buttonProps}
    >
      <span style={{ position: 'relative' }}>
        {children}
        {props.selected && <div className={css.selected} />}
      </span>
    </div>
  );
}

TabButton.propTypes = propTypes;

export default TabButton;
