/**
 * Accessible Focus
 */

 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
 import classnames from 'classnames';
 import css from './AccessibleFocus.css';

 export default function rowHOC(WrappedComponent) {
   return class PP extends React.Component {
     constructor(props) {
       super(props);
       // console.log(this);
     }
     render() {
       // console.log('hell yes!', this.props);
       // console.log('WrappedComponent', WrappedComponent);
       return (
         <WrappedComponent
          {...this.props}
          rowClass={classnames(this.props.rowClass, css.accessibleFocusRoot)}
        />
       )
     }
   }
 }
