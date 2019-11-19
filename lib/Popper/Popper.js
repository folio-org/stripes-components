import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PopperJS from 'popper.js';

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
    isOpen: PropTypes.bool,
    modifiers: PropTypes.object,
    onUpdate: PropTypes.func,
    overlayProps: PropTypes.object,
    overlayRef: PropTypes.object,
    placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
    portal: PropTypes.instanceOf(Element),
  }

  static defaultProps = {
    placement: DEFAULT_PLACEMENT,
    onUpdate: () => {},
  }

  constructor(props) {
    super(props);

    this.overlayRef = props.overlayRef || React.createRef();
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
    } = this.props;

    const overlay = (
      <div ref={this.overlayRef} {...overlayProps}>
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
    const {
      isOpen,
    } = this.props;

    return isOpen ? this.renderOverlay() : null;
  }
}
