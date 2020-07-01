/**
 * Link
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';
import css from './Link.css';

const Link = ({ className, href, to, children, ...rest }) => {
  const Element = to ? RouterLink : 'a';

  const props = {
    className: classnames(css.root, className),
    ...(href && { href }), // Only relevant for native links
    ...(to && { to }), // Only relevant for react-router <Link>'s (most common)
    ...rest
  };

  return (
    <Element data-test-link {...props}>
      {children}
    </Element>
  );
};

Link.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.string,
};

export default Link;
