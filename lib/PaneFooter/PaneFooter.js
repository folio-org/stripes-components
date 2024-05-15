import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DefaultPaneFooter from './DefaultPaneFooter';

import css from './PaneFooter.css';

const PaneFooter = React.forwardRef(({ element: Element = 'div', children, className, innerClassName, ...rest }, ref) => (
  <Element
    ref={ref}
    className={classNames(css.paneFooter, className)}
  >
    {children || <DefaultPaneFooter className={innerClassName} {...rest} />}
  </Element>
));

PaneFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  element: PropTypes.string,
  innerClassName: PropTypes.string,
};

PaneFooter.displayName = 'PaneFooter';

export default PaneFooter;
