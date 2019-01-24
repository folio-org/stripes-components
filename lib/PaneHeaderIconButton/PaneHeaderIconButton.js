/**
 * PaneHeaderIconButton
 */

import React from 'react';
import classnames from 'classnames';
import IconButton from '../IconButton';
import css from './PaneHeaderIconButton.css';

const PaneHeaderIconButton = ({ className, innerClassName, ...rest }) => (
  <IconButton
    className={classnames(className, css.PaneHeaderIconButton__button)}
    innerClassName={classnames(css.PaneHeaderIconButton__inner, innerClassName)}
    {...rest}
  />
);

export default PaneHeaderIconButton;
