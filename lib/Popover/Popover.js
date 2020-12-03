/**
 * Popover
 */

import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { deprecated } from 'prop-types-extra';
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
  modifiers: modifiersProp,
  noPadding,
  onToggle,
  offset,
  open: openProp,
  placement,
  popperProps,
  renderTrigger,
}, ref) => {
  const [open, setOpen] = useState(false);
  const internalAnchorRef = useRef(null);
  const internalPopoverRef = useRef(null);
  const anchorRef = anchorRefProp || internalAnchorRef;
  const popoverRef = ref || internalPopoverRef;
  const handleToggle = typeof onToggle === 'function' ? onToggle : () => setOpen(!open);
  const modifiers = { offset: { enabled: true, offset: `0,${offset}` }, ...modifiersProp };

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

  const renderPopover = transitionStatus => (
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
        <RootCloseWrapper onRootClose={handleToggle} ref={popoverRef}>
          <Transition appear timeout={70} in={open}>
            {renderPopover}
          </Transition>
        </RootCloseWrapper>
      </Popper>
    </>
  );
});

const legacyNotice = `
  Note: The presence of this prop indicates 
  that you are using a legacy implementation of the <Popover>.
  Please see the documentation to learn how to update your implementation.
`;

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
  alignment: deprecated(
    PropTypes.oneOf(['top', 'start', 'end', 'bottom']),
    `It has has been replaced by the "placement"-prop. ${legacyNotice}`
  ),
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
  position: deprecated(
    PropTypes.oneOf(['top', 'start', 'end', 'bottom']),
    `It has been replaced by the "placement"-prop. ${legacyNotice}`
  ),
  renderTrigger: PropTypes.func,
};

Popover.defaultProps = {
  modifiers: {},
  noPadding: false,
  offset: 5,
  placement: 'bottom',
  popperProps: {},
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
