import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Icon.css';
import icons from './icons';

/* eslint-disable react/prefer-stateless-function */
/* We write this as a class because other components apply and use a ref to it */

class Icon extends React.Component {
  static propTypes = {
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
  }

  static defaultProps = {
    size: 'medium',
    iconPosition: 'start',
    icon: 'default',
  }

  render() {
    const {
      icon,
      children,
      ariaLabel,
      iconClassName,
      id,
      size,
      status,
      iconRootClass,
      iconPosition,
      iconStyle,
    } = this.props;

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

    return (
      <span
        className={getRootClass}
        tabIndex="-1"
        aria-label={ariaLabel}
        id={id}
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
  }
}

export default Icon;
