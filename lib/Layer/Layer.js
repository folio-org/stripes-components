/*
 * used to create a new layer of panes within a <Paneset/>
 */

import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import componentOrElement from 'prop-types-extra/lib/componentOrElement';
import addFocusListener from 'react-overlays/lib/utils/addFocusListener';
import contains from 'dom-helpers/query/contains';
import trapFocus from '../../util/trapFocus';
import css from './Layer.css';
import { withPaneset } from '../Paneset/PanesetContext';

class Layer extends React.Component {
  static propTypes = {
    afterClose: PropTypes.func,
    afterOpen: PropTypes.func,
    autoFocus: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    container: componentOrElement,
    contentLabel: PropTypes.string,
    enforceFocus: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    paneset: PropTypes.shape({
      handleClose: PropTypes.func,
      registerPane: PropTypes.func,
      removePane: PropTypes.func,
    }),
  }

  static defaultProps = {
    enforceFocus: true,
    autoFocus: true,
    afterOpen: () => {},
    afterClose: () => {},
  }

  constructor(props) {
    super(props);
    this.contentRef = React.createRef();

    this.focusListener = null;
    this.layerContainer = null;
    this.maybeEnforceFocus = this.maybeEnforceFocus.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const {
      isOpen,
    } = this.props;

    if (isOpen) {
      if (!this.layerContainer) {
        this.forceUpdate();
      }
      this.handleOpen();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isOpen,
    } = this.props;

    if (!prevProps.isOpen && isOpen) {
      this.handleOpen();
    }

    if (prevProps.isOpen && !isOpen) {
      this.handleClose();
    }
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener.remove();
    }
  }

  handleOpen() {
    const { afterOpen, contentLabel, autoFocus } = this.props;

    if (autoFocus && this.contentRef.current) {
      if (!contains(this.contentRef.current, document.activeElement)) {
        this.contentRef.current.focus();
      }
    }

    this.focusListener = addFocusListener(this.maybeEnforceFocus);
    afterOpen();

    if (!contentLabel) {
      console.warn("A11y: please supply a string to the <Layer> prop 'contentLabel' for assistive technology users");
    }
  }

  handleClose() {
    const { afterClose } = this.props;
    this.focusListener.remove();
    afterClose();
  }

  maybeEnforceFocus() {
    if (this.props.enforceFocus) {
      trapFocus(this.contentRef.current, [...document.querySelectorAll(`.${css.LayerRoot}`)]);
    }
  }

  render() {
    const {
      isOpen,
      children,
      contentLabel,
      container,
      paneset,
    } = this.props;

    if (!this.layerContainer) {
      this.layerContainer = container || paneset.getContainer();
    }

    if (isOpen && this.layerContainer) {
      return createPortal(
        <Fragment>
          <div
            className={css.LayerRoot}
            role="dialog"
            key="container"
            tabIndex="-1"
            ref={this.contentRef}
            aria-label={contentLabel}
          >
            {children}
          </div>
        </Fragment>,
        this.layerContainer
      );
    } else {
      return null;
    }
  }
}

export default withPaneset(Layer);
