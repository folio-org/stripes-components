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

function getDisplayProp(isOpen, hideIfClosed) {
  const displayProp = hideIfClosed ? { visibility: 'hidden' } : { display: 'none' };
  return !isOpen ? { style: displayProp } : {};
}

const Popper = React.memo(({
  anchorRef,
  children,
  hideIfClosed,
  isOpen,
  modifiers = {},
  onUpdate = () => {},
  overlayProps = {},
  overlayRef: overlayRefProp,
  placement = "bottom",
  portal,
}) => {
  let overlayRef = React.useRef(null);
  const handleRef = React.useRef((ref) => {
    overlayRef.current = ref;
    if (typeof overlayRefProp === 'function') {
      overlayRefProp(ref);
    }
  }).current;

  const popperInstance = React.useRef(null);

  const getOptions = React.useRef(
    () => {
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
        onCreate: onUpdate,
        placement: calculatedPlacement,
      };
    }
  ).current;

  const createPopperInstance = React.useRef(() => {
    popperInstance.current = new PopperJS(
      anchorRef.current,
      overlayRef.current,
      getOptions(),
    );
  }).current;

  const [displayProp, setDisplayProp] = React.useState(getDisplayProp(isOpen, hideIfClosed));
  if (overlayRefProp) {
    if (typeof overlayRefProp === 'function') {
      overlayRef = (ref) => {
        overlayRef.current = ref;
        overlayRefProp(overlayRef.current);
      };
    }
    overlayRef = overlayRefProp;
  }

  // const getOptions = () => {
  //   let calculatedPlacement = placement;
  //   if (document.dir === 'rtl') {
  //     const placementRE = new RegExp(/start|end|left|right/g);
  //     const hash = {
  //       end: 'start',
  //       start: 'end',
  //       left: 'right',
  //       right: 'left'
  //     };
  //     calculatedPlacement = calculatedPlacement.replace(placementRE, matched => hash[matched]);
  //   }

  //   return {
  //     modifiers,
  //     onCreate: onUpdate,
  //     placement: calculatedPlacement,
  //   };
  // };

  // const createPopperInstance = () => {
  //   popperInstance.current = new PopperJS(
  //     anchorRef.current,
  //     overlayRef.current,
  //     getOptions(),
  //   );
  // };

  React.useEffect(() => {
    return () => {
      popperInstance.current?.destroy();
      popperInstance.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      createPopperInstance();
      setDisplayProp(getDisplayProp(isOpen, hideIfClosed));
    } else {
      setDisplayProp(getDisplayProp(isOpen, hideIfClosed));
      popperInstance.current?.destroy();
      popperInstance.current = null;
    }
  }, [isOpen, hideIfClosed]);

  const renderOverlay = () => {
    const overlayStyle = Object.assign({}, overlayProps?.style, displayProp);

    const overlay = React.createElement(
      'div',
      {
        ref: handleRef,
        className: css.overlay,
        ...displayProp,
        ...overlayProps,
        ...overlayStyle
      },
      children
    );

    return portal ? ReactDOM.createPortal(overlay, portal) : <>{overlay}</>;
  };

  return renderOverlay();
});

Popper.displayName = 'Popper';
Popper.propTypes = {
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
};

export default Popper;


// export default class Popper extends React.Component {
//   static propTypes = {
//     anchorRef: PropTypes.oneOfType([
//       PropTypes.func,
//       PropTypes.shape({
//         current: PropTypes.instanceOf(Element),
//       })
//     ]).isRequired,
//     children: PropTypes.node.isRequired,
//     hideIfClosed: PropTypes.bool,
//     isOpen: PropTypes.bool,
//     modifiers: PropTypes.object,
//     onUpdate: PropTypes.func,
//     overlayProps: PropTypes.object,
//     overlayRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
//     placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
//     portal: PropTypes.instanceOf(Element),
//   }

//   static defaultProps = {
//     placement: DEFAULT_PLACEMENT,
//     onUpdate: () => {},
//     overlayProps: {}
//   }

//   constructor(props) {
//     super(props);

//     // typecheck for ref callbacks...
//     if (typeof this.props.overlayRef === 'function') {
//       this.overlayRef = (ref) => {
//         props.overlayRef(ref);
//         this.overlayRef.current = ref;
//       };
//     } else {
//       this.overlayRef = props.overlayRef || React.createRef();
//     }
//   }

//   componentDidMount() {
//     if (!this.props.isOpen) return;

//     this.createPopperInstance();
//   }

//   componentDidUpdate() {
//     this.updatePopperInstance();
//   }

//   componentWillUnmount() {
//     this.destroyPopperInstance();
//   }

//   renderOverlay() {
//     const {
//       portal,
//       children,
//       overlayProps,
//       hideIfClosed,
//       isOpen
//     } = this.props;

//     let displayProp = {};
//     if (!isOpen && hideIfClosed) {
//       displayProp = { hidden: true };
//     }

//     const overlay = (
//       <div className={css.overlay} ref={this.overlayRef} style={visibilityStyle} {...overlayProps}>
//         {children}
//       </div>
//     );

//     return portal ? ReactDOM.createPortal(overlay, portal) : overlay;
//   }

//   getOptions() {
//     const {
//       modifiers,
//       placement,
//       onUpdate,
//     } = this.props;

//     let calculatedPlacement = placement;
//     if (document.dir === 'rtl') {
//       const placementRE = new RegExp(/start|end|left|right/g);
//       const hash = {
//         end: 'start',
//         start: 'end',
//         left: 'right',
//         right: 'left'
//       };
//       calculatedPlacement = calculatedPlacement.replace(placementRE, matched => hash[matched]);
//     }

//     return {
//       modifiers,
//       placement: calculatedPlacement,
//       onCreate: onUpdate,
//     };
//   }

//   updatePopperInstance = () => {
//     this.destroyPopperInstance();
//     this.createPopperInstance();
//   };

//   createPopperInstance() {
//     this.popperInstance = this.props.isOpen
//       ? new PopperJS(
//         this.props.anchorRef.current,
//         this.overlayRef.current,
//         this.getOptions(),
//       )
//       : null;
//   }

//   destroyPopperInstance() {
//     if (this.popperInstance) {
//       this.popperInstance.destroy();
//     }
//   }

//   render() {
//     const { hideIfClosed, isOpen } = this.props;
//     if (hideIfClosed || isOpen) {
//       return this.renderOverlay();
//     }

//     return null;
//   }
// }
