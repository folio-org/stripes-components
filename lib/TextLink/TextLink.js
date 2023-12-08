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

  const childrenWithRootClass = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        className: classnames(css.root, child.props.className),
      });
    } else {
      return child;
    }
  });

  return (
    <Element data-test-text-link {...props} ref={ref}>
      {childrenWithRootClass}
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
