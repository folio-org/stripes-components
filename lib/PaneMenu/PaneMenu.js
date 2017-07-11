import React from 'react';
import PropTypes from 'prop-types';
import css from './PaneMenu.css';

const propTypes = {
  children: PropTypes.node,
};

const PaneMenu = props => (
  <div className={css.paneMenu}>{props.children}</div>
);

PaneMenu.propTypes = propTypes;

export default PaneMenu;
