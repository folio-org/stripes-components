import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PopperJS from 'popper.js';
import css from './Popper.css';

export const AVAILABLE_PLACEMENTS = [
  'bottom',
  'top',
  'left',
  'right',
  'top-start',
  'top-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end',
  'right-start',
  'right-end',
];

const [DEFAULT_PLACEMENT] = AVAILABLE_PLACEMENTS;

export default class Popper extends React.Component {
  static propTypes = {
    anchorRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        current: PropTypes.instanceOf(Element),
      })
    ]).isRequired,
    children: PropTypes.node.isRequired,
    hideIfClosed: PropTypes.bool,
    isOpen: PropTypes.bool,
    modifiers: PropTypes.object,
    onUpdate: PropTypes.func,
    overlayProps: PropTypes.object,
    overlayRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
    portal: PropTypes.instanceOf(Element),
  }

  static defaultProps = {
    placement: DEFAULT_PLACEMENT,
    onUpdate: () => {},
    overlayProps: {}
  }

  constructor(props) {
    super(props);

    // typecheck for ref callbacks...
    if (typeof this.props.overlayRef === 'function') {
      this.overlayRef = (ref) => {
        props.overlayRef(ref);
        this.overlayRef.current = ref;
      };
    } else {
      this.overlayRef = props.overlayRef || React.createRef();
    }
  }

  componentDidMount() {
    if (!this.props.isOpen) return;

    this.createPopperInstance();
  }

  componentDidUpdate() {
    this.updatePopperInstance();
  }

  componentWillUnmount() {
    this.destroyPopperInstance();
  }

  renderOverlay() {
    const {
      portal,
      children,
      overlayProps,
      hideIfClosed,
      isOpen
    } = this.props;

    let displayProp = {};
    if (!isOpen && hideIfClosed) {
      displayProp = { hidden: true };
    }

    const overlay = (
      <div className={css.overlay} ref={this.overlayRef} {...displayProp} {...overlayProps}>
        {children}
      </div>
    );

    return portal ? ReactDOM.createPortal(overlay, portal) : overlay;
  }

  getOptions() {
    const {
      modifiers,
      placement,
      onUpdate,
    } = this.props;

    let calculatedPlacement = placement;
    if (document.dir === 'rtl') {
      const placementRE = new RegExp(/start|end|left|right/g);
      const hash = {
        end: 'start',
        start: 'end',
        left: 'right',
        right: 'left'
      };
      calculatedPlacement = calculatedPlacement.replace(placementRE, matched => hash[matched]);
    }

    return {
      modifiers,
      placement: calculatedPlacement,
      onCreate: onUpdate,
    };
  }

  updatePopperInstance = () => {
    this.destroyPopperInstance();
    this.createPopperInstance();
  };

  createPopperInstance() {
    this.popperInstance = this.props.isOpen
      ? new PopperJS(
        this.props.anchorRef.current,
        this.overlayRef.current,
        this.getOptions(),
      )
      : null;
  }

  destroyPopperInstance() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
  }

  render() {
    const { hideIfClosed, isOpen } = this.props;
    if (hideIfClosed || isOpen) {
      return this.renderOverlay();
    }

    return null;
  }
}
