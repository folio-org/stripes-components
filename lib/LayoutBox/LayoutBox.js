import React from 'react';
import PropTypes from 'prop-types';
import css from './LayoutBox.css';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const LayoutBox = props => (
  <div className={css.sectionBox}>
    {props.children}
  </div>
);

LayoutBox.propTypes = propTypes;

export default LayoutBox;
