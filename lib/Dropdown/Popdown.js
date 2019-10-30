import React, { useState, useEffect } from 'react';
import isBoolean from 'lodash/isBoolean';
import contains from 'dom-helpers/query/contains';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import Button from '../Button';
import Popper from '../Popper';

const Popdown = ({
  disabled,
  label,
  buttonProps,
  children,
  keyHandler,
  onToggle,
  overlayRef: overlayRefProp,
  renderTrigger,
  usePortal,
  open: openProp,
  placement
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = React.createRef();
  const overlayRef = overlayRefProp || React.createRef();

  useEffect(() => {
    if (open) {
      if (overlayRef.current && triggerRef.current === document.ActiveElement) {
        overlayRef.current.focus();
      }
    }
  }, [open]);

  if (isBoolean(openProp) && openProp !== open) {
    setOpen(openProp);
  }

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (open && triggerRef.current && contains(overlayRef.current, document.activeElement)) {
      triggerRef.current.focus();
    }
    if (onToggle) {
      onToggle(e);
    } else {
      setOpen(prevOpen => !prevOpen);
    }
  };

  const ariaProps = {
    'aria-expanded': open,
    'aria-haspopup': true
  };

  const _handleKeyDown = (e) => {
    keyHandler(e, open, disabled, toggleMenu, overlayRef, () => setOpen(false));
  };

  const trigger = renderTrigger ?
    renderTrigger(triggerRef, toggleMenu, ariaProps, _handleKeyDown) :
    (
      <Button
        buttonRef={triggerRef}
        buttonStyle="none"
        onClick={toggleMenu}
        onKeyDown={_handleKeyDown}
        {...buttonProps}
        {...ariaProps}
      >
        {label}
      </Button>
    );

  const portalEl = document.getElementById('OverlayContainer');

  return (
    <React.Fragment>
      {trigger}
      {!open &&
        <div style={{ display: 'none' }}>
          { children }
        </div>
      }
      <Popper
        modifiers={{
          flip: { boundariesElement: 'scrollParent', padding: 10 },
          preventOverflow: { boundariesElement: 'scrollParent', padding: 10 }
        }}
        placement={placement}
        isOpen={open}
        anchorRef={triggerRef}
        overlayRef={overlayRef}
        overlayProps={{ onKeyDown: _handleKeyDown }}
        portal={usePortal ? portalEl : null}
      >
        <RootCloseWrapper onRootClose={toggleMenu}>
          {
            typeof children === 'function' ?
              children({ toggleMenu, open }) :
              children
          }
        </RootCloseWrapper>
      </Popper>
    </React.Fragment>
  );
};

Popdown.propTypes = {
  buttonProps: PropTypes.object,
  children: PropTypes.node,
  keyHandler: PropTypes.func,
  label: PropTypes.node,
  onToggle: PropTypes.func,
  placement: PropTypes.string,
  renderTrigger: PropTypes.func,
  usePortal: PropTypes.bool,
};

Popdown.defaultProps = {
  placement: 'bottom'
};

export default Popdown;
