/*
 * used to create a new layer of panes within a <Paneset/>
 */

import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import componentOrElement from 'prop-types-extra/lib/componentOrElement';
import trapFocus from '../../util/trapFocus';
import css from './Layer.css';
import { withPaneset } from '../Paneset/PanesetContext';
import { withResize } from '../Paneset/ResizeContext';

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
    inRootSet: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    paneset: PropTypes.shape({
      getContainer: PropTypes.func,
      getTopmostContainer: PropTypes.func,
      handleClose: PropTypes.func,
      registerPane: PropTypes.func,
      removePane: PropTypes.func,
    }),
    resizer: PropTypes.shape({
      resume: PropTypes.func.isRequired,
      suspend: PropTypes.func.isRequired,
    }),
  }

  static defaultProps = {
    enforceFocus: true,
    autoFocus: true,
    afterOpen: () => { },
    afterClose: () => { },
  }

  constructor(props) {
    super(props);
    this.contentRef = React.createRef();
    this.containerRef = React.createRef();
    this.layerContainer = null;
    this.maybeEnforceFocus = this.maybeEnforceFocus.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // componentDidMount() {
  //   const {
  //     isOpen,
  //   } = this.props;

  //   if (isOpen) {
  //     if (!this.layerContainer) {
  //       this.forceUpdate();
  //     }
  //     this.handleOpen();
  //   }
  // }

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
    document.removeEventListener('focus', this.maybeEnforceFocus, true);
  }

  handleOpen() {
    const { afterOpen, contentLabel, autoFocus, resizer } = this.props;

    resizer?.suspend();

    if (autoFocus && this.containerRef.current) {
      if (!this.containerRef.current.contains(document.activeElement)) {
        this.containerRef.current.focus();
      }
    }

    document.addEventListener('focus', this.maybeEnforceFocus, true);

    afterOpen();

    if (!contentLabel) {
      console.warn("A11y: please supply a string to the <Layer> prop 'contentLabel' for assistive technology users");
    }
  }

  handleClose() {
    const { afterClose, resizer } = this.props;
    resizer.resume();
    document.removeEventListener('focus', this.maybeEnforceFocus, true);
    afterClose();
  }

  maybeEnforceFocus() {
    if (this.props.enforceFocus) {
      trapFocus(this.contentRef.current, [...document.querySelectorAll(`.${css.LayerRoot}`)]);
    }
  }

  getLayerContainer = () => {
    const { container, inRootSet, paneset } = this.props;
    const elem = paneset ?
      container || inRootSet ?
        paneset.getTopmostContainer() : paneset.getContainer() :
      document.getElementById('OverlayContainer');
    return elem;
  }

  mountedRef = () => {
    const {
      isOpen,
    } = this.props;

    if (this.containerRef.current) {
      if (isOpen) {
        if (!this.layerContainer) {
          this.forceUpdate();
        }
        this.handleOpen();
      }
    }
  }

  handleRef = (ref) => {
    this.containerRef.current = ref;
    this.mountedRef(ref);
  }

  render() {
    const {
      isOpen,
      children,
      contentLabel,
    } = this.props;

    if (!this.layerContainer) {
      this.layerContainer = this.getLayerContainer();
    }

    if (isOpen && this.layerContainer) {
      return createPortal(
        <>
          <div
            className={css.LayerRoot}
            role="dialog"
            key="container"
            tabIndex="-1"
            ref={this.handleRef}
            aria-label={contentLabel}
            style={{ pointerEvents: 'all' }}
          >
            {children}
          </div>
        </>,
        this.layerContainer
      );
    } else {
      return null;
    }
  }
}

export default withPaneset(withResize(Layer));
