/**
 * Utility Component: Scrollable
 * Uses Perfect Scroll to for a more stylish and uniform scrollbar across browsers
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'perfect-scrollbar';
import css from './Scrollable.css';

export default class Scrollable extends Component {
  componentDidMount() {
    this.ps = new PerfectScrollbar(this.container);
  }
  componentWillUnmount() {
    this.ps.destroy();
  }
  render() {
    return (
      <div ref={(c) => { this.container = c; }} className={css.scrollable}>
        {this.props.children}
      </div>
    );
  }
}

Scrollable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
  ]).isRequired,
};
