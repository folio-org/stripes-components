import React, { useState } from 'react';
import isBoolean from 'lodash/isBoolean';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import Button from '../Button';
import Popper from '../Popper';

const Popdown = ({
  disabled,
  label,
  buttonProps,
  children,
  onToggle,
  overlayRef: overlayRefProp,
  renderTrigger,
  usePortal,
  open: openProp,
  placement
}) => {
  const [open, setOpen] = useState(false);

  if (isBoolean(openProp) && openProp !== open) {
    setOpen(openProp);
  }

  const triggerRef = React.createRef();
  const overlayRef = overlayRefProp || React.createRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
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

  const handleKeyDown = (e) => {
    if (disabled) {
      return;
    }

    switch (e.keyCode) {
      case 40: // down
        if (!open) {
          setOpen(true);
        } else if (overlayRef.current && overlayRef.current.focusNext) {
          overlayRef.current.focusNext();
        }
        e.preventDefault();
        break;
      case 27: // escape
      case 9: // tab
        setOpen(false);
        break;
      default:
    }
  }

  const trigger = renderTrigger ?
    renderTrigger(triggerRef, toggleMenu, ariaProps, handleKeyDown) :
    (
      <Button
        buttonRef={triggerRef}
        buttonStyle="none"
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
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
