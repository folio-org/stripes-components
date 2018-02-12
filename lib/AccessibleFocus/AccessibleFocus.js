/**
 * Accessible Focus
 */

 import React from 'react';
 import PropTypes from 'prop-types';

 const propTypes = {
   children: PropTypes.node,
   tag: PropTypes.string.isRequired,
 };

 const defaultProps = {

 };

 const AccessibleFocus = ({ children, tag, ...rest }) => {
   const Element = tag;
   return (
     <Element {...rest}>
      {children}
     </Element>
   );
 };

 AccessibleFocus.propTypes = propTypes;
 AccessibleFocus.defaultProps = defaultProps;

 export default AccessibleFocus;
