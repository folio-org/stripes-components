import React from 'react';
import PropTypes from 'prop-types';
import Popper from '../Popper';

const OptionsListWrapper = React.forwardRef(({
  useLegacy,
  children,
  controlRef,
  isOpen,
  renderToOverlay,
  modifiers,
  ...props
}, ref) => {
  if (useLegacy) {
    return <div data-open={props.isOpen} {...props} hidden={!isOpen}>{children}</div>;
  }

  let portal;
  if (renderToOverlay) {
    portal = document.getElementById('OverlayContainer');
  }

  return (
    <Popper
      anchorRef={controlRef}
      overlayProps={{ ...props }}
      overlayRef={ref}
      isOpen={isOpen}
      portal={portal}
      placement="bottom-start"
      modifiers={modifiers}
      hideIfClosed
    >
      {children}
    </Popper>
  );
});

OptionsListWrapper.displayName = 'OptionsListWrapper';
OptionsListWrapper.propTypes = {
  children: PropTypes.node,
  controlRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isOpen: PropTypes.bool,
  modifiers: PropTypes.object,
  renderToOverlay: PropTypes.bool,
  useLegacy: PropTypes.bool,
};

export default OptionsListWrapper;
