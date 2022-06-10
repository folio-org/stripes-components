import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pickBy } from 'lodash';
import css from './Icon.css';
import icons from './icons';

const propTypes = {
  'aria-label': PropTypes.string,
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(icons)),
    PropTypes.func,
  ]),
  iconClassName: PropTypes.string,
  iconPosition: PropTypes.oneOf([
    'start',
    'end',
  ]),
  iconRootClass: PropTypes.string,
  iconStyle: PropTypes.oneOf([
    'action',
  ]),
  id: PropTypes.string,
  size: PropTypes.oneOf([
    'small',
    'medium',
    'large',
  ]),
  status: PropTypes.oneOf([
    'error',
    'warn',
    'success',
  ]),
  tabIndex: PropTypes.number,
};

const defaultProps = {
  size: 'medium',
  iconPosition: 'start',
  icon: 'default',
};

const Icon = React.forwardRef(({
  children,
  icon,
  iconClassName,
  iconPosition,
  iconRootClass,
  iconStyle,
  id,
  size,
  status,
  tabIndex,
  ...rest
}, ref) => {
  const getRootClass = classNames(
    css.icon,
    iconRootClass,
    // If icon position is defined
    { [css[`icon-position-${iconPosition}`]]: children && iconPosition },
    // If a status is defined
    { [css[`status-${status}`]]: status },
    // Icons that contains "left" or "right should flip on dir="rtl"
    { [css.flippable]: typeof icon === 'string' && icon.match(/(right|left)/) },
    // Apply icon style
    { [css[iconStyle]]: iconStyle },
  );

  const getSVGClass = classNames(
    'stripes__icon',
    iconClassName,
    `icon-${icon}`,
    css[size],
  );

  // Defaults to the default-icon
  let IconElement = icons.default;

  // Custom icon
  if (typeof icon === 'function') {
    IconElement = icon;
  // Find icon in icons list
  } else if (typeof icon === 'string' && typeof icons[icon] === 'function') {
    IconElement = icons[icon];
  }

  const ariaAttributes = Object.assign(pickBy(rest, (_, key) => key.startsWith('aria')), {
    'aria-label': rest.ariaLabel || rest['aria-label'] || icon
  });

  return (
    <span
      className={getRootClass}
      id={id}
      ref={ref}
      role="presentation"
      tabIndex={tabIndex}
      {...ariaAttributes}
    >
      <IconElement
        data-test-icon-element
        className={getSVGClass}
        viewBox="0 0 32 32"
        focusable="false"
      />
      { children ? <span className={css.label}>{children}</span> : null }
    </span>
  );
});

Icon.displayName = 'Icon';
Icon.defaultProps = defaultProps;
Icon.propTypes = propTypes;

export default Icon;
