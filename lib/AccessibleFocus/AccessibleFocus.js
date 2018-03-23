/**
 * Accessible Focus
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { capitalize } from 'lodash';
import css from './AccessibleFocus.css';

const propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  wrap: PropTypes.bool,
  flex: PropTypes.bool,
  focused: PropTypes.bool,
  focusDot: PropTypes.bool,
  focusDotPosition: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
  focusDotOffset: PropTypes.oneOf(['small', 'medium', 'large']),
  boxOffset: PropTypes.oneOf(['small', 'medium', 'large']),
  boxOffsetStart: PropTypes.oneOf(['small', 'medium', 'large']),
  boxOffsetEnd: PropTypes.oneOf(['small', 'medium', 'large']),
  boxOffsetTop: PropTypes.oneOf(['small', 'medium', 'large']),
  boxOffsetBottom: PropTypes.oneOf(['small', 'medium', 'large']),
};

const defaultProps = {
  component: 'span',
  wrap: false,
  flex: false,
  focusDot: false,
  focused: false,
  focusDotPosition: 'start',
};

class AccessibleFocus extends Component {
  render() {
    const { children, component, className, wrap, flex, focused, focusDot, focusDotPosition, focusDotOffset, boxOffset, boxOffsetStart, boxOffsetEnd, boxOffsetTop, boxOffsetBottom, ...rest } = this.props;
    const Element = component;

    const classNames = classnames(
      className,
      css.accessibleFocusRoot,
      { [css.flex]: flex },
      { [css.hasDot]: focusDot },
      { [css.isFocused]: focused },
      { [css[`focusDotPosition${capitalize(focusDotPosition)}`]]: focusDot },
      { [css[`focusDotOffset${capitalize(focusDotOffset)}`]]: focusDotOffset },
      { [css[`boxOffset${capitalize(boxOffset)}`]]: boxOffset },
      { [css[`boxOffsetStart${capitalize(boxOffsetStart)}`]]: boxOffsetStart },
      { [css[`boxOffsetEnd${capitalize(boxOffsetEnd)}`]]: boxOffsetEnd },
      { [css[`boxOffsetTop${capitalize(boxOffsetTop)}`]]: boxOffsetTop },
      { [css[`boxOffsetBottom${capitalize(boxOffsetBottom)}`]]: boxOffsetBottom },
    );

    const inner = wrap ? (<span className={css.wrappedInner}>{children}</span>) : children;
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
