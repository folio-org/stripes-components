/**
 * Component: Headline
 */

import React, { forwardRef } from 'react';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import css from './Headline.css';

const Headline = forwardRef((
  { size, margin, tag: Element, faded, bold, flex, block, children, className, ...rest },
  ref
) => {
  /**
   * Get CSS classes depending on props
   */

  const getCssClasses = () => classNames(
    // Base styling
    css.headline,
    // Size
    css[camelCase(`size ${size}`)],
    // Margin
    css[camelCase(`margin ${margin || size}`)],
    // Faded
    { [css.isFaded]: faded },
    // Bold
    { [css.isBold]: bold },
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
      className={getCssClasses()}
    >
      {children}
    </Element>
  );
});

Headline.defaultProps = {
  bold: true,
  faded: false,
  margin: '', // Determined by size if nothing is set
  size: 'medium',
  tag: 'div',
};

Headline.propTypes = {
  block: PropTypes.bool,
  bold: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  faded: PropTypes.bool,
  flex: PropTypes.bool,
  margin: PropTypes.oneOf([ // If nothing is set it will default to the value of size
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
};

export default Headline;
