/**
 * Link
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';
import css from './Link.css';

const Link = forwardRef(({ className, href, to, children, ...rest }, ref) => {
  const Element = to ? RouterLink : 'a';

  const props = {
    className: classnames(css.root, className),
    ...(href && { href }), // Only relevant for native links
    ...(to && { to }), // Only relevant for react-router <Link>'s (most common)
    ...rest
  };

  return (
    <Element data-test-link {...props} ref={ref}>
      {children}
    </Element>
  );
});

Link.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.string,
};

Link.displayName = 'Link';

export default Link;
