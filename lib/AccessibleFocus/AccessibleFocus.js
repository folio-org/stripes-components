/**
 * Accessible Focus
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { capitalize } from 'lodash';
import css from './AccessibleFocus.css';

const propTypes = {
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  component: PropTypes.func,
  wrap: PropTypes.bool,
  flex: PropTypes.bool,
  usePseudoElement: PropTypes.bool,
  focusDot: PropTypes.bool,
  focusDotPosition: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
};

const defaultProps = {
  tag: 'span',
  wrap: false,
  focusDot: false,
  focusDotPosition: 'start',
  // usePseudoElement: true,
};

class AccessibleFocus extends Component {
  render() {
    const { children, tag, component, className, wrap, flex, focusDot, focusDotPosition, ...rest } = this.props;
    const Element = component || tag;
    console.log('comppnent', typeof component);

    const classNames = classnames(
      className,
      css.accessibleFocusRoot,
      { [css.flex]: flex },
      { [css.hasDot]: focusDot },
      { [css[`focusDotPosition${capitalize(focusDotPosition)}`]]: focusDot },
    );

    if (component) {
      let Component = component().type;
      return <Component {...component().props} className={classNames} />;
    }

    const inner = wrap ? (<span>{children}</span>) : children;
    return (
      <Element {...rest} className={classNames}>
        {inner}
      </Element>
    );
  }
}

AccessibleFocus.propTypes = propTypes;
AccessibleFocus.defaultProps = defaultProps;

export default AccessibleFocus;
