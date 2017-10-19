/*
 * basic pane container with transitions.
 * used to create a new layer of panes within a <Paneset/>
 */

import React from 'react';
import { Portal } from 'react-overlays';
import PropTypes from 'prop-types';
import componentOrElement from 'prop-types-extra/lib/componentOrElement'; // eslint-disable-line import/no-extraneous-dependencies

import css from './Layer.css';
import Paneset from '../Paneset';

// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const propTypes = {
  isOpen: PropTypes.bool,
  container: PropTypes.oneOfType([
    componentOrElement,
    PropTypes.node,
  ]),
  contentLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const contextTypes = {
  paneset: PropTypes.instanceOf(Paneset),
};

class Layer extends React.Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.contentRef = null;
  }

  componentWillMount() {
    this.container = this.props.container || this.context.paneset;
  }

  render() {
    let content = null;
    if (this.props.isOpen) {
      content = <div className={css.LayerRoot} open role="dialog" key="container" tabIndex="0" ref={(ref) => { this.contentRef = ref; }} aria-label={this.props.contentLabel}>{this.props.children}</div>;
    }

    return (
      <Portal container={this.container} >
        {content}
      </Portal>
    );
  }
}

Layer.propTypes = propTypes;
Layer.contextTypes = contextTypes;

export default Layer;
