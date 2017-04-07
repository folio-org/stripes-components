import React from 'react';
import css from './PaneMenu.css';

const propTypes = {
  children: React.PropTypes.node,
};

const PaneMenu = props => (
  <div className={css.paneMenu}>{props.children}</div>
);

PaneMenu.propTypes = propTypes;

export default PaneMenu;
