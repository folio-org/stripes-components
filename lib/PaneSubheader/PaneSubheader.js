import React from 'react';
import PropTypes from 'prop-types';
import css from './PaneSubheader.css';

const PaneSubheader = ({ children }) => (
  <div className={css.subheader}>
    {children}
  </div>
);

PaneSubheader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.element,
  ]),
};

export default PaneSubheader;
