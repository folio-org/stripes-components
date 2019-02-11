/**
 * PaneHeaderIconButton
 */

import React from 'react';
import classnames from 'classnames';
import IconButton from '../IconButton';
import css from './PaneHeaderIconButton.css';
import paneHeaderCss from '../PaneHeader/PaneHeader.css';

const PaneHeaderIconButton = React.forwardRef(({ className, innerClassName, ...rest }, ref) => (
  <IconButton
    ref={ref}
    className={classnames(className, css.PaneHeaderIconButton, paneHeaderCss.paneHeaderIconButton)}
    innerClassName={classnames(css.PaneHeaderIconButton__inner, innerClassName)}
    {...rest}
  />
));

export default PaneHeaderIconButton;
