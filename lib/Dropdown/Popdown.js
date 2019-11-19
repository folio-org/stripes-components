import React, { useState, useEffect } from 'react';
import isBoolean from 'lodash/isBoolean';
import contains from 'dom-helpers/query/contains';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import DropdownButton from '../DropdownButton';
import Popper from '../Popper';
import { getNextFocusable } from '../../util/getFocusableElements';

const DefaultTrigger = ({ getTriggerProps, buttonProps, label }) => (
  <DropdownButton
    {...getTriggerProps()}
    {...buttonProps}
  >
    {label}
  </DropdownButton>
);

DefaultTrigger.propTypes = {
  buttonProps: PropTypes.object,
  getTriggerProps: PropTypes.func,
  label: PropTypes.node,
};

const Popdown = ({
  buttonProps,
  children,
  disabled,
  label,
  id,
  triggerKeyHandler,
  menuKeyHandler,
  modifiers,
  onToggle,
  open: openProp,
  overlayRef: overlayRefProp,
  placement,
  renderMenu,
  renderTrigger,
  usePortal,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = React.createRef();
  const overlayRef = overlayRefProp || React.createRef();

  let focusTimeoutId;

  useEffect(() => {
    if (open) {
      if (overlayRef.current && triggerRef.current === document.activeElement) {
        const elem = getNextFocusable(overlayRef.current, true, true);
        if (elem) elem.focus();
      }
    }
  }, [open, overlayRef, triggerRef]);

  if (isBoolean(openProp) && openProp !== open) {
    setOpen(openProp);
  }

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (open && triggerRef.current) {
      const menuElement = overlayRef.current.node || overlayRef.current;
      if (contains(menuElement, document.activeElement)) {
        triggerRef.current.focus();
      }
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

  const _triggerHandleKeyDown = (e) => {
    triggerKeyHandler(e, open, disabled, toggleMenu, overlayRef, () => setOpen(false));
  };

  const _menuHandleKeyDown = (e) => {
    menuKeyHandler(e, open, disabled, toggleMenu, overlayRef, () => setOpen(false), triggerRef);
  };

  const _menuBlur = () => {
    focusTimeoutId = setTimeout(() => setOpen(false));
  };

  const _menuFocus = () => {
    clearTimeout(focusTimeoutId);
  };

  const getTriggerProps = () => ({
    id,
    ref: triggerRef,
    onClick: toggleMenu,
    onKeyDown: _triggerHandleKeyDown,
    ...ariaProps
  });

  const portalEl = document.getElementById('OverlayContainer');

  let elements = {};
  let menu;
  let menuFunc = renderMenu;
  if (!menuFunc && typeof children === 'function') {
    elements = children({ open, onToggle: toggleMenu });
    if (React.isValidElement(elements)) {
      menu = elements;
    } else if (elements.menu) {
      menuFunc = elements.menu;
    }
  }

  const triggerFunc = elements.trigger || renderTrigger;
  const trigger = triggerFunc(
    { getTriggerProps,
      open,
      triggerRef,
      onToggle: toggleMenu,
      ariaProps,
      keyHandler: _triggerHandleKeyDown,
      buttonProps,
      label }
  );

  if (!menu) {
    menu = menuFunc ? menuFunc({ open, onToggle: toggleMenu, keyHandler: _menuHandleKeyDown }) : children;
  }

  return (
    <React.Fragment>
      {trigger}
      {!open &&
        <div style={{ display: 'none' }}>
          { menu }
        </div>
      }
      <Popper
        modifiers={modifiers}
        placement={placement}
        isOpen={open}
        anchorRef={triggerRef}
        overlayRef={overlayRef}
        overlayProps={{
          onKeyDown: _menuHandleKeyDown,
          ref: overlayRef,
          tabIndex: '-1',
          onBlur: _menuBlur,
          onFocus: _menuFocus
        }}
        portal={usePortal ? portalEl : null}
      >
        <RootCloseWrapper onRootClose={onToggle || toggleMenu}>
          { menu }
        </RootCloseWrapper>
      </Popper>
    </React.Fragment>
  );
};

Popdown.propTypes = {
  buttonProps: PropTypes.object,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  menuKeyHandler: PropTypes.func,
  modifiers: PropTypes.object,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  overlayRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  placement: PropTypes.string,
  renderMenu: PropTypes.func,
  renderTrigger: PropTypes.func,
  triggerKeyHandler: PropTypes.func,
  usePortal: PropTypes.bool,
};

Popdown.defaultProps = {
  placement: 'bottom',
  modifiers: {
    flip: { boundariesElement: 'scrollParent', padding: 10 },
    preventOverflow: { boundariesElement: 'scrollParent', padding: 10 }
  },
  renderTrigger: DefaultTrigger,
};

export default Popdown;
