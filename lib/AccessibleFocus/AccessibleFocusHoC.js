/**
 * Accessible Focus
 */

 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
 import classnames from 'classnames';
 import css from './AccessibleFocus.css';

 export default function rowHOC(WrappedComponent) {
   return class PP extends React.Component {
     static propTypes = {
       rootClassNameProp: PropTypes.string,
     }
     static defaultProps = {
       rootClassNameProp: 'className'
     }
     constructor(props) {
       super(props);
       // console.log(this);
     }
     render() {
       const { rootClassNameProp, ...rest } = this.props;

       /**
        * Merge root class names
        * with accessible focus styles
        *
        * In most components the root class name prop will
        * be the default "className" but in some casses it might be different
        */
       const classNames = {
         [rootClassNameProp]: classnames(this.props[rootClassNameProp], css.accessibleFocusRoot)
       };

       return (
         <WrappedComponent
          {...rest}
          {...classNames}
        />
       )
     }
   }
 }
