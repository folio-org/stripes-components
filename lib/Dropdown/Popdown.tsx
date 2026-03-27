// @ts-nocheck
import React, { useState, useEffect } from "react";
import isBoolean from "lodash/isBoolean";
import DropdownButton from "../DropdownButton";
import Popper from "../Popper";
import {
  getNextFocusable,
  getLastFocusable,
  getFirstFocusable,
} from "../../util/getFocusableElements";
import composeEventHandlers from "../../util/composeEventHandlers";
type DefaultTriggerProps = {
  buttonProps?: Record<string, any>;
  getTriggerProps?: (...args: any[]) => any;
  label?: React.ReactNode;
};
type PopdownProps = {
  buttonProps?: Record<string, any>;
  children?: React.ReactNode | ((...args: any[]) => any);
  disabled?: boolean;
  focusHandlers?: Record<string, any>;
  id?: string;
  label?: React.ReactNode;
  menuKeyHandler?: (...args: any[]) => any;
  modifiers?: Record<string, any>;
  onToggle?: (...args: any[]) => any;
  open?: boolean;
  overlayRef?: ((...args: any[]) => any) | Record<string, any>;
  placement?: string;
  renderMenu?: (...args: any[]) => any;
  renderTrigger?: (...args: any[]) => any;
  triggerKeyHandler?: (...args: any[]) => any;
  triggerRef?: Record<string, any>;
  usePortal?: boolean;
};

const DefaultTrigger = ({
  getTriggerProps,
  buttonProps,
  label,
}: DefaultTriggerProps) => (
  <DropdownButton {...getTriggerProps()} {...buttonProps}>
    {label}
  </DropdownButton>
);

const defaultFocusHandlers = {
  open: (trigger, menu, firstItem) => {
    if (firstItem) firstItem.focus();
  },
  close: (trigger, menu) => {
    if (menu.contains(document.activeElement)) {
      trigger.focus();
    }
  },
};

const Popdown = ({
  buttonProps,
  children,
  disabled,
  focusHandlers,
  label,
  id,
  menuKeyHandler,
  modifiers = {
    flip: { boundariesElement: "viewport", padding: 10 },
    preventOverflow: { boundariesElement: "viewport", padding: 10 },
  },
  onToggle,
  open: openProp,
  overlayRef: overlayRefProp,
  placement = "bottom",
  renderMenu,
  renderTrigger = DefaultTrigger,
  triggerKeyHandler,
  triggerRef: triggerRefProp,
  usePortal = false,
}: PopdownProps) => {
  const [open, setOpen] = useState(false);
  const [keyCode, setKeyCode] = useState();
  const triggerRef = triggerRefProp || React.createRef();
  const overlayRef = overlayRefProp || React.createRef();

  let focusTimeoutId;

  const _focusHandlers = { ...focusHandlers, ...defaultFocusHandlers };

  useEffect(() => {
    if (open) {
      if (overlayRef.current && triggerRef.current) {
        const menu = overlayRef.current.node || overlayRef.current;
        let elem;
        if (keyCode === null || keyCode === 40) {
          // down arrow
          elem = getNextFocusable(menu, true, true);
        }
        if (keyCode === 38) {
          elem = getLastFocusable(menu);
        }
        if (document.activeElement === triggerRef.current) {
          _focusHandlers.open(triggerRef.current, menu, elem);
        }
      }
    }
  }, [open, overlayRef, triggerRef, _focusHandlers, keyCode]);

  if (isBoolean(openProp) && openProp !== open) {
    setOpen(openProp);
    if (!onToggle) {
      console.warn(
        "Popdown - You set a boolean for the 'open' prop, but failed to provide an 'onToggle' handler",
      );
    }
  }

  const toggleMenu = (e) => {
    if (disabled) {
      return;
    }

    if (e) {
      e.stopPropagation();
      if (e.keyCode) {
        setKeyCode(e.keyCode);
      } else {
        setKeyCode(null);
      }
    }
    if (open && triggerRef.current && overlayRef.current) {
      const menuElement = overlayRef.current.node || overlayRef.current;
      _focusHandlers.close(triggerRef.current, menuElement);
    }
    if (onToggle) {
      onToggle(e);
    } else {
      setOpen((prevOpen) => !prevOpen);
    }
  };

  const closeMenu = (e) => {
    if (open) {
      toggleMenu(e);
    }
  };

  const ariaProps = {
    "aria-expanded": open,
    "aria-haspopup": true,
  };

  const focusFirst = () => {
    if (overlayRef.current) {
      const elem = getFirstFocusable(overlayRef.current);
      if (elem) elem.focus();
    }
  };

  const focusTrigger = () => {
    if (triggerRef.current) triggerRef.current.focus();
  };

  const focusAfterMenu = () => {
    const elem = getNextFocusable(triggerRef.current);
    if (elem) elem.focus();
  };

  const triggerHandleKeyDown = (e) => {
    triggerKeyHandler({
      event: e,
      open,
      disabled,
      onToggle: toggleMenu,
      menuRef: overlayRef,
      triggerRef,
      onClose: closeMenu,
    });
  };

  const menuHandleKeyDown = (e) => {
    menuKeyHandler({
      event: e,
      open,
      disabled,
      onToggle: toggleMenu,
      menuRef: overlayRef,
      triggerRef,
      onClose: closeMenu,
    });
  };

  const menuBlur = () => {
    focusTimeoutId = setTimeout(() => closeMenu());
  };

  const menuFocus = () => {
    clearTimeout(focusTimeoutId);
  };

  const getTriggerProps = (opts = {}) => ({
    id,
    ref: triggerRef,
    onClick: toggleMenu,
    disabled,
    onKeyDown: triggerHandleKeyDown,
    onFocus: composeEventHandlers(menuFocus, opts.onFocus),
    onBlur: composeEventHandlers(menuBlur, opts.onBlur),
    ...ariaProps,
  });

  const focusProxy = (onFocus, attributes) => (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
    <div
      tabIndex="0"
      data-focus-exclude
      className="sr-only"
      onFocus={onFocus}
      {...attributes}
    />
  );

  const renderAfterToggle = (menu) => {
    let res = null;
    if (!open) {
      res = <div style={{ display: "none" }}>{menu}</div>;
    } else if (usePortal) {
      res = focusProxy(focusFirst, { "data-focus-first": true });
    }
    return res;
  };

  const portalEl = document.getElementById("OverlayContainer");

  let elements = {};
  let menu;
  let menuFunc = renderMenu;
  if (!menuFunc && typeof children === "function") {
    elements = children({ open, onToggle: toggleMenu });
    if (React.isValidElement(elements)) {
      menu = elements;
    } else if (elements.menu) {
      menuFunc = elements.menu;
    }
  }

  const triggerFunc = elements.trigger || renderTrigger;
  const trigger = triggerFunc({
    getTriggerProps,
    open,
    triggerRef,
    onToggle: toggleMenu,
    ariaProps,
    keyHandler: triggerHandleKeyDown,
    buttonProps,
    label,
  });

  if (!menu) {
    menu = menuFunc
      ? menuFunc({
          open,
          onToggle: toggleMenu,
          keyHandler: menuHandleKeyDown,
        })
      : children;
  }

  return (
    <>
      {trigger}
      {renderAfterToggle(menu)}
      <Popper
        modifiers={modifiers}
        placement={placement}
        isOpen={open}
        anchorRef={triggerRef}
        overlayRef={overlayRef}
        portal={usePortal ? portalEl : null}
        overlayProps={{
          onKeyDown: menuHandleKeyDown,
          ref: overlayRef,
          tabIndex: "-1",
          onBlur: menuBlur,
          onFocus: menuFocus,
          "data-test-dropdown-menu-overlay": true,
          onClick: (e) => {
            e.stopPropagation();
          }, // prevent propagation of click events
        }} // to trigger parents e.g. table rows.
        // The events even propagate through react-portals.
      >
        <>
          {usePortal &&
            focusProxy(focusTrigger, { "data-reverse-proxy": true })}
          {menu}
          {usePortal &&
            focusProxy(focusAfterMenu, { "data-forward-proxy": true })}
        </>
      </Popper>
    </>
  );
};

export default Popdown;
