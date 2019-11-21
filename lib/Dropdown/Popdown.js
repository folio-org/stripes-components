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

const defaultFocusHandlers = {
  open: (trigger, menu, firstItem) => {
    
    if (firstItem) firstItem.focus();
  },
  close: (trigger, menu) => {
    if (contains(menu, document.activeElement)) {
      trigger.focus();
    }
  }
};

const Popdown = ({
  buttonProps,
  children,
  disabled,
  focusHandlers,
  label,
  id,
  menuKeyHandler,
  modifiers,
  onToggle,
  open: openProp,
  overlayRef: overlayRefProp,
  placement,
  renderMenu,
  renderTrigger,
  triggerKeyHandler,
  triggerRef: triggerRefProp,
  usePortal,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = triggerRefProp || React.createRef();
  const overlayRef = overlayRefProp || React.createRef();

  let focusTimeoutId;

  const _focusHandlers = Object.assign({}, Popdown.defaultProps.focusHandlers, focusHandlers);

  useEffect(() => {
    if (open) {
      if (overlayRef.current && triggerRef.current) {
        const menu = overlayRef.current.node || overlayRef.current;
        const elem = getNextFocusable(menu, true, true);
        _focusHandlers.open(triggerRef.current, menu, elem);
      }
    }
  }, [open, overlayRef, triggerRef, _focusHandlers]);

  if (isBoolean(openProp) && openProp !== open) {
    setOpen(openProp);
  }

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (open && triggerRef.current) {
      const menuElement = overlayRef.current.node || overlayRef.current;
      _focusHandlers.close(triggerRef.current, menuElement);
    }
    if (onToggle) {
      onToggle(e);
    } else {
      setOpen(prevOpen => !prevOpen);
    }
  };

  const closeMenu = (e) => {
    if (open) {
      toggleMenu(e);
    }
  };

  const ariaProps = {
    'aria-expanded': open,
    'aria-haspopup': true
  };

  const triggerHandleKeyDown = (e) => {
    triggerKeyHandler(e, open, disabled, toggleMenu, overlayRef, closeMenu);
  };

  const menuHandleKeyDown = (e) => {
    menuKeyHandler(e, open, disabled, toggleMenu, overlayRef, closeMenu);
  };

  const menuBlur = () => {
    focusTimeoutId = setTimeout(() => setOpen(false));
  };

  const menuFocus = () => {
    clearTimeout(focusTimeoutId);
  };

  const getTriggerProps = () => ({
    id,
    ref: triggerRef,
    onClick: toggleMenu,
    onKeyDown: triggerHandleKeyDown,
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
      keyHandler: triggerHandleKeyDown,
      buttonProps,
      label }
  );

  if (!menu) {
    menu = menuFunc ?
      menuFunc({
        open,
        onToggle: toggleMenu,
        keyHandler: menuHandleKeyDown
      }) : children;
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
          onKeyDown: menuHandleKeyDown,
          ref: overlayRef,
          tabIndex: '-1',
          onBlur: menuBlur,
          onFocus: menuFocus
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
  focusHandlers: PropTypes.object,
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
  triggerRef: PropTypes.object,
  usePortal: PropTypes.bool,
};

Popdown.defaultProps = {
  placement: 'bottom',
  modifiers: {
    flip: { boundariesElement: 'scrollParent', padding: 10 },
    preventOverflow: { boundariesElement: 'scrollParent', padding: 10 }
  },
  focusHandlers: defaultFocusHandlers,
  renderTrigger: DefaultTrigger,
};

export default Popdown;
