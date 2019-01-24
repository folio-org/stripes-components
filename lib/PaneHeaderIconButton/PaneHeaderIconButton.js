/**
 * PaneHeaderIconButton
 */

import React from 'react';
import classnames from 'classnames';
import IconButton from '../IconButton';
import css from './PaneHeaderIconButton.css';

const PaneHeaderIconButton = ({ className, ...rest }) => (
  <IconButton
    className={classnames(className, css.PaneHeaderIconButton__root)}
    innerClassName={css.PaneHeaderIconButton__inner}
    {...rest}
  />
);

export default PaneHeaderIconButton;
