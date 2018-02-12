import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Icon.css';
import icons from './icons';

/* eslint-disable react/prefer-stateless-function */
/* We write this as a class because other components apply and use a ref to it */

class Icon extends React.Component {
  static propTypes = {
    icon: PropTypes.oneOf(Object.keys(icons)),
    size: PropTypes.oneOf([
      'small',
      'medium',
      'large',
    ]),
    color: PropTypes.string,
    iconClassName: PropTypes.string,
    iconRootClass: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
  }

  static defaultProps = {
    iconClassName: 'stripes__icon',
    size: 'medium',
  }

  render() {
    const { icon, color, title, iconClassName, id, size, iconRootClass } = this.props;

    const getRootClass = classNames(
      css.icon,
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
  }
}

export default Icon;
