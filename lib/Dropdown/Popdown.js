import React, { useState } from 'react';
import isBoolean from 'lodash/isBoolean';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import Button from '../Button';
import Popper from '../Popper';

const Popdown = ({ label, buttonProps, children, renderTrigger, portal, open: isOpen }) => {
  const [open, setOpen] = useState(false);

  if (isBoolean(isOpen) && isOpen !== open) {
    setOpen(isOpen);
  }

  const triggerRef = React.createRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpen(prevOpen => !prevOpen);
  };

  const ariaProps = {
    'aria-expanded': open,
    'aria-haspopup': true
  };

  const trigger = renderTrigger ?
    renderTrigger(triggerRef, toggleMenu, ariaProps) :
    (
      <Button
        buttonRef={triggerRef}
        buttonStyle="none"
        onClick={toggleMenu}
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
      <Popper
        modifiers={{
          flip: { boundariesElement: 'scrollParent', padding: 10 },
          preventOverflow: { boundariesElement: 'scrollParent', padding: 10 }
        }}
        placement="bottom-start"
        isOpen={open}
        anchorRef={triggerRef}
        portal={portal ? portalEl : null}
      >
        <RootCloseWrapper onRootClose={toggleMenu}>
          {children}
        </RootCloseWrapper>
      </Popper>
    </React.Fragment>
  );
};

Popdown.propTypes = {
  buttonProps: PropTypes.object,
  children: PropTypes.node,
  label: PropTypes.node,
  portal: PropTypes.bool,
  renderTrigger: PropTypes.func,
};

export default Popdown;
