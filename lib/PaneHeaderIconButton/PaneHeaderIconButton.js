/**
 * PaneHeaderIconButton
 */

import React from 'react';
import PropTypes from 'prop-types';
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

PaneHeaderIconButton.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
};

export default PaneHeaderIconButton;
