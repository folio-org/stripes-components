/**
 * Accessible Focus
 */

 import React from 'react';
 import PropTypes from 'prop-types';
 import classnames from 'classnames';
 import css from './AccessibleFocus.css';

 const propTypes = {
   children: PropTypes.element,
   tag: PropTypes.string,
   component: PropTypes.func,
 };

 const defaultProps = {

 };

 const AccessibleFocus = ({ children, tag, component, className, ...rest }) => {
   const Element = component ? component : tag;
   console.log('element', Element);
   console.log('children', children);
   const classNames = classnames(className, css.accessibleFocusRoot);
   return (
     <Element {...rest} className={classNames}>
      {children}
     </Element>
   );
 };

 AccessibleFocus.propTypes = propTypes;
 AccessibleFocus.defaultProps = defaultProps;

 export default AccessibleFocus;
