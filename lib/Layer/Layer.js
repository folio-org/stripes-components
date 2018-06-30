/*
 * basic pane container with transitions.
 * used to create a new layer of panes within a <Paneset/>
 */

import React from 'react';
import { Portal } from 'react-overlays';
import PropTypes from 'prop-types';
import componentOrElement from 'prop-types-extra/lib/componentOrElement';

import css from './Layer.css';
import { withPaneset } from '../Paneset/PanesetContext';

// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  container: componentOrElement,
  contentLabel: PropTypes.string,
  isOpen: PropTypes.bool,
  paneset: PropTypes.shape({
    registerPane: PropTypes.func,
    removePane: PropTypes.func,
    handleClose: PropTypes.func,
  }),
};

class Layer extends React.Component { // eslint-disable-line react/no-deprecated
  constructor(props) {
    super(props);
    this.container = null;
    this.contentRef = null;
  }

  componentWillMount() {
    this.container = this.props.container || this.props.paneset;
  }

  render() {
    let content = null;
    if (this.props.isOpen) {
      content =
        <div
          className={css.LayerRoot}
          open
          role="dialog"
          key="container"
          tabIndex="0"
          ref={(ref) => { this.contentRef = ref; }}
          aria-label={this.props.contentLabel}
        >
          {this.props.children}
        </div>;
    }

    return (
      <Portal container={this.container} >
        {content}
      </Portal>
    );
  }
}

Layer.propTypes = propTypes;

export default withPaneset(Layer);
