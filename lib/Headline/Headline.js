/**
 * Component: Headline
 */

import React from 'react';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import css from './Headline.css';

const Headline = ({ title, size, margin, tag, faded, bold, children }) => {
  /**
   * Available prop values
   */

  const availablePropValues = {
    size: ['large', 'medium', 'small'],
    margin: ['large', 'medium', 'small', 'none'],
    tag: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'],
  };

  /**
   * Determine prop value helper
   */

  const isValidPropValue = (name, value) => availablePropValues[name].indexOf(value) >= 0;
  const determinePropValue = (propName, propValue, prefix = true) => {
    const defaultValue = Headline.defaultProps[propName];
    let returnValue = defaultValue;
    let value = propValue;

    /**
     * Exceptions
     */

    // If no margin is added; use size as default since all sizes has matching margins
    if (propName === 'margin' && !value) {
      value = (isValidPropValue('size', size)) ? size : Headline.defaultProps.size;
    }

    // Check if prop value is different from default
    // and is a valid value for this prop
    if (isValidPropValue(propName, value)) {
      returnValue = value;
    // If not; we warn the user
    } else {
      console.warn(`[Headline] Value (${value}) is not a valid value for prop: ${propName}. Available values:`, availablePropValues[propName]);
    }

    // Prefix with prop name so we can add the proper CSS
    // (Can be set to false which we use for adding tag)
    return prefix ? camelCase(`${propName} ${returnValue}`) : returnValue;
  };

  /**
   * Get CSS classes depending on props
   */

  const getCssClasses = () => classNames(
    // Base styling
    css.headline,
    // Size
    css[determinePropValue('size', size)],
    // Margin
    css[determinePropValue('margin', margin)],
    // Faded
    { [css.isFaded]: faded },
    // Bold
    { [css.isBold]: bold },
  );

  /**
   * Tag
   */

  const HeadlineTag = `${determinePropValue('tag', tag, false)}`;

  /**
   * Content
   */
  const content = children || title;

  return (
    <HeadlineTag className={getCssClasses()}>{content}</HeadlineTag>
  );
};

Headline.defaultProps = {
  title: '',
  size: 'medium',
  margin: '', // Determined by size if nothing is set
  tag: 'h2',
  faded: false,
  bold: true,
};

Headline.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.string,
  margin: PropTypes.string,
  tag: PropTypes.string,
  faded: PropTypes.bool,
  bold: PropTypes.bool,
};

export default Headline;
