/**
 * Component: Headline
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import css from './Headline.css';

const Headline = forwardRef((
  { size, margin, tag: Element, faded, flex, block, children, className, weight, ...rest },
  ref
) => {
  const classes = classNames(
    // Base styling
    css.headline,
    // Size
    css[`size-${size}`],
    // Margin
    css[`margin-${margin || size}`],
    // Faded
    { [css.isFaded]: faded },
    // Define font-weight
    { [css[`font-weight-${weight}`]]: weight },
    // Display: flex
    { [css.flex]: flex },
    // Display: block
    { [css.block]: block },
    // Customize with className
    className,
  );

  return (
    <Element
      {...rest}
      ref={ref}
      className={classes}
      data-test-headline
    >
      {children}
    </Element>
  );
});

Headline.defaultProps = {
  faded: false,
  weight: 'bold',
  margin: '', // If nothing is set it will default to the value of size
  size: 'medium',
  tag: 'div',
};

Headline.propTypes = {
  block: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  faded: PropTypes.bool,
  flex: PropTypes.bool,
  margin: PropTypes.oneOf([
    'xx-small',
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large',
    'none',
    ''
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'x-large', 'xx-large']),
  tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'legend']),
  weight: PropTypes.oneOf(['regular', 'medium', 'bold', 'black']),
};

Headline.displayName = 'Headline';

export default Headline;
