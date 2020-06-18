/**
 * Available icons
 */
import React from 'react';
import PropTypes from 'prop-types';
import dotSpinner from './DotSpinner.css';
import omitProps from '../../util/omitProps';

/**
 * Import SVG icons
 */
const req = require.context('!!react-svg-loader!./icons/', true, /\.svg$/);
const icons = req.keys().reduce((images, path) => Object.assign(images, {
  [path.slice(2, path.length - 4)]: req(path).default,
}), {});

const SpinnerEllipsis = ({ className, ...rest }) => (
  <div className={`${dotSpinner.spinner} ${className}`} {...omitProps(rest, ['viewBox'])}>
    <div className={dotSpinner.bounce1} />
    <div className={dotSpinner.bounce2} />
    <div className={dotSpinner.bounce3} />
  </div>
);

SpinnerEllipsis.propTypes = {
  className: PropTypes.string,
};

export default {
  ...icons,
  'spinner-ellipsis': SpinnerEllipsis,
};
