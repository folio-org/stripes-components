/**
 * Pane Menu Icon
 */

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import css from './PaneMenuIcon.css';

const PaneMenuIcon = ({ icon, onClick, title, ariaLabel, id, style }) => (
  <button className={css.root} title={title} onClick={onClick} aria-label={ariaLabel} id={id} style={style}>
    <span className={css.icon}>
      <Icon icon={icon} />
    </span>
  </button>
);

PaneMenuIcon.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.obj,
};

export default PaneMenuIcon;
