/**
 * Popover
 */

import React, { useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import get from 'lodash/get';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import RootCloseWrapper from '../../util/RootCloseWrapper';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import css from './Popover.css';
import LegacyPopover from './LegacyPopover';

/* Check if the legacy implementation is used */
const isLegacy = (childrenProp) => {
  return Array.isArray(childrenProp)
    && get(React.Children.toArray(childrenProp), '[0].props[data-role]') === 'target';
};

const Popover = forwardRef(({
  anchorRef: anchorRefProp,
  children,
  className,
  modifiers: modifiersProp = {},
  noPadding = false,
  onToggle,
  offset = 5,
  open: openProp,
  placement = 'bottom',
  popperProps = {},
  renderTrigger,
}, ref) => {
  const [open, setOpen] = useState(false);
  const internalAnchorRef = useRef(null);
  const internalPopoverRef = useRef(null);
  const anchorRef = anchorRefProp || internalAnchorRef;
  const popoverRef = ref || internalPopoverRef;

  // when the popper is open, and the user clicks the trigger,
  // this function is called AFTER handleClickOutside.
  const internalToggleRef = useRef(() => {
    setOpen((cur) => {
      if (cur &&
        (popoverRef.current === document.activeElement ||
          popoverRef.current?.contains(document.activeElement)
        )
      ) {
        anchorRef.current?.focus(); // eslint-disable-line
      }
      return !cur;
    });
  }).current;

  const handleToggle = typeof onToggle === 'function' ? onToggle : () => internalToggleRef();
  const modifiers = { offset: { enabled: true, offset: `0,${offset}` }, ...modifiersProp };

  // This function is used to close the popover if the user clicks anywhere outside of the overlay element or trigger.
  // However, if the popover is open and the trigger is clicked to close it, this function will be executed, followed
  // by the handleToggle() function (which can create a double-toggle effect and re-open the popover by mistake)
  // so we conditionally check to see if the user clicked the trigger (anchorRef contains the target) -
  // and in that case, we don't close the popover here, but let subsequent call to handleToggle() close the popover.
  const handleClickOutside = useCallback((e) => {
    if (!anchorRef.current.contains(e.target)) {
      setOpen(false);
    }
  }, [anchorRef]);

  const renderProps = {
    ref: anchorRef,
    toggle: handleToggle,
    open,
  };

  /**
   * Controlled externally
   */
  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  /**
   * Focus content when popover opens
   */
  useEffect(() => {
    if (open && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [open, popoverRef]);

  //
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      // like all good accessible dialogs,
      // close the popover on escape!
      handleToggle();
    }
  };

  const renderPopover = transitionStatus => (
    // eslint-disable-next-line
    <div
      data-test-popover-overlay
      className={
        classnames(
          css.popover,
          { [css.noPadding]: noPadding },
          css.transition,
          css[`transition-${transitionStatus}`],
          className
        )}
      ref={popoverRef}
      role="dialog"
      tabIndex="-1"
      onKeyDown={handleKeyDown}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </div>
  );

  return (
    <>
      {typeof renderTrigger === 'function' && renderTrigger(renderProps)}
      <Popper
        isOpen={open}
        anchorRef={anchorRef}
        placement={placement}
        modifiers={modifiers}
        {...popperProps}
      >
        <RootCloseWrapper onRootClose={handleClickOutside} ref={popoverRef}>
          <Transition appear timeout={70} in={open}>
            {renderPopover}
          </Transition>
        </RootCloseWrapper>
      </Popper>
    </>
  );
});

const checkForLegacyChildrenProp = (props) => {
  if (isLegacy(props.children)) {
    throw new Error(`
      You are using a legacy implementation of the <Popover>-component.
      See the documentation for this component to learn how to update
      your implementation to use the new component API. Docs:
      https://github.com/folio-org/stripes-components/blob/master/lib/Popover/readme.md
    `);
  }
};

Popover.propTypes = {
  activeClass: PropTypes.string,
  anchorRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  children: PropTypes.oneOfType([
    checkForLegacyChildrenProp,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  className: PropTypes.string,
  modifiers: PropTypes.object,
  noPadding: PropTypes.bool,
  offset: PropTypes.number,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  popperProps: PropTypes.object,
  renderTrigger: PropTypes.func,
};

/**
 * Legacy support
 */

const PopoverWithLegacySupport = (props) => { /* eslint-disable react/prop-types */
  if (isLegacy(props.children)) {
    return <LegacyPopover {...props} />;
  }

  return <Popover {...props} />;
};

export default PopoverWithLegacySupport;
