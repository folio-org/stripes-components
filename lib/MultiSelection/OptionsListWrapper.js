import React from 'react';
import PropTypes from 'prop-types';
import Popper from '../Popper';

const OptionsListWrapper = React.forwardRef(({
  useLegacy,
  children,
  controlRef,
  isOpen,
  renderToOverlay,
  menuPropGetter,
  modifiers,
  ...props
}, ref) => {
  if (useLegacy) {
    return <div {...menuPropGetter({ ref })} {...props} data-open={props.isOpen} hidden={!isOpen}>{children}</div>;
  }

  const {
    overlayRef,
    ...menuRest
  } = menuPropGetter({ ref, refKey: 'overlayRef' });

  let portal;
  if (renderToOverlay) {
    portal = document.getElementById('OverlayContainer');
  }

  return (
    <Popper
      anchorRef={controlRef}
      overlayProps={{ ...menuRest, ...props }}
      overlayRef={overlayRef}
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
  menuPropGetter: PropTypes.func,
  modifiers: PropTypes.object,
  renderToOverlay: PropTypes.bool,
  useLegacy: PropTypes.bool,
};

export default OptionsListWrapper;
