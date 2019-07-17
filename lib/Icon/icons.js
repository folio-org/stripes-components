/**
 * Available icons
 */
import React from 'react';
import dotSpinner from './DotSpinner.css';
import omitProps from '../../util/omitProps';

/**
 * Import SVG icons
 */
const req = require.context('!!react-svg-loader!./icons/', true, /\.svg$/);
const icons = req.keys().reduce((images, path) => Object.assign(images, {
  [path.slice(2, path.length - 4)]: req(path).default,
}), {});

export default {
  ...icons,
  'spinner-ellipsis': ({ className, ...rest }) => (
    <div className={`${dotSpinner.spinner} ${className}`} {...omitProps(rest, ['viewBox'])}>
      <div className={dotSpinner.bounce1} />
      <div className={dotSpinner.bounce2} />
      <div className={dotSpinner.bounce3} />
    </div>
  ),
};
