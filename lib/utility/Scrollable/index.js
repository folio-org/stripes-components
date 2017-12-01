/**
 * Utility Component: Scrollable
 * Uses Perfect Scroll to for a more stylish and uniform scrollbar across browsers
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'perfect-scrollbar';
import classNames from 'classnames';
import css from './Scrollable.css';

export default class Scrollable extends Component {
  static defaultProps = {
    noOverflow: false,
    containerStyle: null,
    containerClass: '',
  }
  constructor(props) {
    super(props);
    this.getContainerClasses = this.getContainerClasses.bind(this);
    this.perfectScrollbarIsActive = this.perfectScrollbarIsActive.bind(this);
    this.handleScrollX = this.handleScrollX.bind(this);
    this.handleScrollY = this.handleScrollY.bind(this);
  }
  componentDidMount() {
    if (this.perfectScrollbarIsActive()) {
      this.ps = new PerfectScrollbar(this.container);

      // Attach handlers
      this.container.addEventListener('ps-scroll-x', this.handleScrollX);
      this.container.addEventListener('ps-scroll-y', this.handleScrollY);
    }
  }
  componentWillUnmount() {
    if (this.perfectScrollbarIsActive()) {
      this.container.removeEventListener('ps-scroll-x', this.handleScrollX, true);
      this.container.removeEventListener('ps-scroll-y', this.handleScrollY, true);
      this.ps.destroy();
    }
  }
  // Check if perfect scrollbar is active
  perfectScrollbarIsActive() {
    const { noOverflow } = this.props;
    return !noOverflow;
  }
  getContainerClasses() {
    return classNames(
      css.scrollable,
      { [css.isDeactivated]: !this.perfectScrollbarIsActive() },
      this.props.containerClass,
    );
  }
  handleScrollX(e) {
    const { onScroll } = this.props;
    if (typeof onScroll === 'function') {
      onScroll(e);
    }
  }
  handleScrollY(e) {
    const { onScroll } = this.props;
    if (typeof onScroll === 'function') {
      onScroll(e);
    }
  }
  render() {
    return (
      <div style={this.props.containerStyle} ref={(c) => { this.container = c; }} className={this.getContainerClasses()}>
        {this.props.children}
      </div>
    );
  }
}

Scrollable.propTypes = {
  onScroll: PropTypes.func,
  containerClass: PropTypes.string,
  containerStyle: PropTypes.object,
  noOverflow: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
  ]).isRequired,
};
