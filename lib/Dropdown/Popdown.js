import React, { useState, useEffect } from 'react';
import isBoolean from 'lodash/isBoolean';
import contains from 'dom-helpers/query/contains';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import DropdownButton from '../DropdownButton';
import Popper from '../Popper';

const Popdown = ({
  buttonProps,
  children,
  disabled,
  label,
  id,
  keyHandler,
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

  const _handleKeyDown = (e) => {
    keyHandler(e, open, disabled, toggleMenu, overlayRef, () => setOpen(false));
  };

  const getTriggerProps = () => ({
    id,
    ref: triggerRef,
    onClick: toggleMenu,
    onKeyDown: _handleKeyDown,
    ...ariaProps
  });

  const portalEl = document.getElementById('OverlayContainer');

  let elements = {};
  let menu;
  let menuFunc = renderMenu;
  if (!menuFunc && typeof children === 'function') {
    elements = children({ open, toggleMenu });
    if (React.isValidElement(elements)) {
      menu = elements;
    } else if (elements.menu) {
      menuFunc = elements.menu;
    }
  }

  const triggerFunc = elements.trigger || renderTrigger;
  const trigger = triggerFunc({ getTriggerProps, open, triggerRef, onToggle: toggleMenu, ariaProps, keyHandler: _handleKeyDown, buttonProps, label });

  if (!menu) {
    menu = menuFunc ? menuFunc({ open, onToggle: toggleMenu, keyHandler: _handleKeyDown }) : children;
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
        overlayProps={{ onKeyDown: _handleKeyDown }}
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
  keyHandler: PropTypes.func,
  label: PropTypes.node,
  modifiers: PropTypes.object,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  overlayRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  placement: PropTypes.string,
  renderMenu: PropTypes.func,
  renderTrigger: PropTypes.func,
  usePortal: PropTypes.bool,
};

Popdown.defaultProps = {
  placement: 'bottom',
  modifiers: {
    flip: { boundariesElement: 'scrollParent', padding: 10 },
    preventOverflow: { boundariesElement: 'scrollParent', padding: 10 }
  },
  renderTrigger: ({ getTriggerProps, buttonProps, label }) => (
    <DropdownButton
      {...getTriggerProps()}
      {...buttonProps}
    >
      {label}
    </DropdownButton>
  ),
};

export default Popdown;
