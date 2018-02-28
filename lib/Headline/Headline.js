/**
 * Component: Headline
 */

import React from 'react';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import css from './Headline.css';

const Headline = ({ size, margin, tag, faded, bold, flex, block, children, className, ...rest }) => {
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

  const HeadlineTag = tag;

  return (
    <HeadlineTag {...rest} className={getCssClasses()}>{children}</HeadlineTag>
  );
};

Headline.defaultProps = {
  size: 'medium',
  margin: '', // Determined by size if nothing is set
  tag: 'h2',
  faded: false,
  bold: true,
};

Headline.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  margin: PropTypes.oneOf(['small', 'medium', 'large', 'none', '']), // If nothing is set it will default to the value of size
  tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div']),
  faded: PropTypes.bool,
  bold: PropTypes.bool,
  flex: PropTypes.bool,
  block: PropTypes.bool,
};

export default Headline;
