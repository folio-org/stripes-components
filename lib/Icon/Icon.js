import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Icon.css';
import icons from './icons';

const propTypes = {
  icon: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  iconClassName: PropTypes.string,
  iconRootClass: PropTypes.string,
  title: PropTypes.string,
};

const defaultProps = {
  iconClassName: 'stripes__icon',
  size: 'medium',
};

class Icon extends React.Component {
  getRootClass() {
    return classNames(
      css.root,
      this.props.iconRootClass,
      css[this.props.size],
      // Icon is spiller (this is going to be deprecated later on)
      { [css.iconSpinner]: this.props.icon === 'spinner-ellipsis' },
    );
  }

  render() {
    const { icon, color, iconClassName } = this.props;
    const style = color ? { fill: color } : {};

    let IconSVG = () => (<div>{`Icon not found: ${icon}`}</div>);
    if (typeof icons[icon] === 'function') {
      IconSVG = icons[icon];
    }

    return (
      <div
        className={this.getRootClass()}
        tabIndex="-1"
        title={this.props.title}
      >
        <IconSVG style={style} className={iconClassName} />
      </div>
    );
  }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
