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
import {
  getFirstFocusable,
  getLastFocusable,
  getNextFocusable,
} from '../../util/getFocusableElements';
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

  const handleToggleRef = useRef(handleToggle);
  handleToggleRef.current = handleToggle;

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
    if (openProp !== undefined) {
      setOpen(openProp);
    }
  }, [openProp]);

  /**
   * The popover content is rendered into a portal (#OverlayContainer) that lives
   * elsewhere in the DOM, disconnected from the trigger's visual position, and it's
   * always mounted (just visually hidden while closed). Focus is never moved into it
   * automatically - that would either interrupt the `aria-expanded` state-change
   * announcement on the trigger (when content has nothing focusable), or cause content
   * to be announced twice (once via focus, once via the trigger's own accessible
   * description). Instead, Tab/Shift+Tab are handled explicitly below so that, when the
   * content does contain something focusable (e.g. a `buttonHref` link), it can still be
   * reached and left via keyboard - with focus always resolved relative to the trigger
   * (anchorRef), which sits in its natural DOM position, rather than relative to the
   * portal's (unrelated) DOM position.
   *
   * A global, capture-phase listener is used for both Escape and Tab handling. This is
   * required (not just a preference) because a page can wrap the trigger in its own
   * keyboard-shortcut scope (e.g. `HasCommand`/`react-hotkeys`, bound to the page's
   * `<form>`) that registers a bubble-phase 'esc' handler. Since the trigger renders
   * inside the app's normal component tree (unlike the portaled content, which sits
   * outside any such wrapper), a bubble-phase handler scoped to the trigger element
   * itself would always lose the race to an ancestor's own bubble-phase shortcut
   * handler and get its propagation stopped before ever reaching React's root-level
   * synthetic event delegation. Capture phase runs top-down, before any bubble-phase
   * handler fires, so it always wins regardless of where the trigger is rendered.
   *
   * Being global, the listener only acts when focus is actually on the trigger or
   * somewhere inside the popover content.
   */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      const isFocusRelevant = document.activeElement === anchorRef.current
        || !!popoverRef.current?.contains(document.activeElement);

      // If focus is not on the trigger or inside the popover content, ignore the event.
      if (!isFocusRelevant) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleToggleRef.current();
        return;
      }

      if (e.key !== 'Tab') return;

      const firstFocusable = getFirstFocusable(popoverRef.current);
      if (!firstFocusable) return;

      const isOnTrigger = document.activeElement === anchorRef.current;

      // Tab forward from the trigger into the content
      if (!e.shiftKey && isOnTrigger) {
        e.preventDefault();
        e.stopPropagation();
        firstFocusable.focus();
        return;
      }

      const lastFocusable = getLastFocusable(popoverRef.current);
      const isOnLastFocusable = document.activeElement === lastFocusable;

      // Tab forward out of the content, past its last focusable element.
      // The popover is left open - it's only closed via Escape or an outside click.
      if (!e.shiftKey && isOnLastFocusable) {
        e.preventDefault();
        e.stopPropagation();
        getNextFocusable(anchorRef.current, false)?.focus();
        return;
      }

      const isOnFirstFocusable = document.activeElement === firstFocusable;

      // Shift+Tab back out of the content, from its first focusable element.
      // The popover is left open - it's only closed via Escape or an outside click.
      if (e.shiftKey && isOnFirstFocusable) {
        e.preventDefault();
        e.stopPropagation();
        anchorRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [open, anchorRef, popoverRef]);

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
