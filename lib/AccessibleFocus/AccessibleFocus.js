/**
 * Accessible Focus
 */

 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
 import classnames from 'classnames';
 import css from './AccessibleFocus.css';

 const propTypes = {
   tag: PropTypes.string,
   component: PropTypes.element,
   wrap: PropTypes.bool,
   flex: PropTypes.bool,
   usePseudoElement: PropTypes.bool,
 };

 const defaultProps = {
   tag: 'span',
   wrap: false,
   // usePseudoElement: true,
 };

class AccessibleFocus extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { children, tag, component, className, wrap, flex, ...rest } = this.props;
    const Element = component ? component : tag;
    const classNames = classnames(className, css.accessibleFocusRoot, { [css.flex]: flex });
    const inner = wrap ? (<span>{children}</span>) : children;
    return (
      <Element {...rest} className={classNames}>
        {inner}
      </Element>
    );
  }
};

 AccessibleFocus.propTypes = propTypes;
 AccessibleFocus.defaultProps = defaultProps;

 export default AccessibleFocus;
