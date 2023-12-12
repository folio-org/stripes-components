/**
 * TextLink
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import css from './TextLink.css';

const TextLink = forwardRef(({ className, element, href, to, children, ...rest }, ref) => {
  const Element = element || (to ? Link : 'a');

  const props = {
    className: classnames(css.root, className),
    ...(href && { href }), // Only relevant for native links
    ...(to && { to }), // Only relevant for react-router <Link>'s (most common)
    ...rest
  };

  // we give possibility to apply root CSS class to child element since it may not be correctly inherited
  // see details at STCOM-1226, STCOM-1000
  return (
    <Element data-test-text-link {...props} ref={ref}>
      {typeof children === 'function' ? children({className: css.root}) : children}
    </Element>
  );
});

TextLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  element: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
  href: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

TextLink.displayName = 'TextLink';

export default TextLink;
