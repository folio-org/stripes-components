import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Icon.css';
import icons from './icons';

const propTypes = {
  icon: PropTypes.oneOf(Object.keys(icons)),
  size: PropTypes.string,
  color: PropTypes.string,
  iconClassName: PropTypes.string,
  iconRootClass: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
};

const defaultProps = {
  iconClassName: 'stripes__icon',
  size: 'medium',
};

const Icon = ({ icon, color, title, iconClassName, id, size, iconRootClass }) => {
  const getRootClass = classNames(
    css.root,
    iconRootClass,
    css[size],
    // Icon is spiller (this is going to be deprecated later on)
    { [css.iconSpinner]: icon === 'spinner-ellipsis' },
  );

  const style = color ? { fill: color } : {};

  // Defaults to the default-icon
  let IconSVG = icons.default;

  if (typeof icons[icon] === 'function') {
    IconSVG = icons[icon];
  }

  return (
    <div
      className={getRootClass}
      tabIndex="-1"
      title={title}
      id={id}
    >
      <IconSVG style={style} className={iconClassName} />
    </div>
  );
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
