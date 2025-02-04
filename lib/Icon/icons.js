/**
 * Available icons
 */
import React from 'react';
import PropTypes from 'prop-types';
import dotSpinner from './DotSpinner.css';
import omitProps from '../util/omitProps';

const PlacholderSVG = ({ ...props }) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="0,100 50,25 50,75 100,0" />
  </svg>
);

/**
 * Import SVG icons
 */
let icons = { default: PlacholderSVG }
// check to see if we're in the node test browser - this environment doesn't
// use webpack to build, so it will failwhen require.context is executed for whatever reason.
if (!navigator.userAgent.includes('jsdom')) {
  const req = require.context('./icons/?icon=true', true, /\.svg$/);
  icons = req.keys().reduce((images, path) => Object.assign(images, {
    [path.slice(2, path.length - 4)]: req(path).default,
  }), {});
}


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
