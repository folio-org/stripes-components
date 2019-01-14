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
    icon: PropTypes.oneOf(Object.keys(icons)),
    iconClassName: PropTypes.string,
    iconPosition: PropTypes.oneOf([
      'start',
      'end',
    ]),
    iconRootClass: PropTypes.string,
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

  constructor(props) {
    super(props);
    if (props.icon in this.deprecations) {
      console.warn(
        `Warning: <Icon> "${props.icon}" is deprecated. Use "${this.deprecations[props.icon]}" instead.`
      );
    }
  }

  get deprecations() {
    return {
      'clearX': 'times-circle-solid',
      'closeX': 'times',
      'down-arrow': 'arrow-down',
      'down-caret': 'caret-down',
      'down-triangle': 'triangle-down',
      'hollowX': 'times-circle',
      'left-arrow': 'arrow-left',
      'left-double-chevron': 'chevron-double-left',
      'right-arrow': 'arrow-right',
      'right-double-chevron': 'chevron-double-right',
      'trashBin': 'trash',
      'up-arrow': 'arrow-up',
      'up-caret': 'caret-up',
      'up-triangle': 'triangle-up',
      'validation-check': 'check-circle',
      'validation-error': 'exclamation-circle',
    };
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
      iconPosition
    } = this.props;

    const getRootClass = classNames(
      css.icon,
      iconRootClass,
      // If icon position is defined
      { [css[`icon-position-${iconPosition}`]]: children && iconPosition },
      // If a status is defined
      { [css[`status-${status}`]]: status },
      // Icon is spinner (this is going to be deprecated later on)
      { [css.iconSpinner]: icon === 'spinner-ellipsis' },
      // Icons that contains "left" or "right should flip on dir="rtl"
      { [css.flippable]: icon.match(/(right|left)/) },
    );

    const getSVGClass = classNames(
      'stripes__icon',
      iconClassName,
      `icon-${icon}`,
      css[size],
    );

    // Defaults to the default-icon
    let IconSVG = icons.default;

    if (icon in this.deprecations) {
      IconSVG = icons[this.deprecations[icon]];
    } else if (typeof icons[icon] === 'function') {
      IconSVG = icons[icon];
    }

    return (
      <span
        className={getRootClass}
        tabIndex="-1"
        aria-label={ariaLabel}
        id={id}
      >
        <IconSVG className={getSVGClass} />
        { children ? <span className={css.label}>{children}</span> : null }
      </span>
    );
  }
}

export default Icon;
