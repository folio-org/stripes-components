// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import { uniqueId, noop } from "lodash";

import { DefaultAccordionHeader } from "./headers";
import css from "./Accordion.css";
import { HotKeys } from "../HotKeys";
import { withAccordionSet } from "./AccordionSetContext";
import omitProps from "../../util/omitProps";
type AccordionProps = {
  accordionSet?: Record<string, any>;
  children: React.ReactNode | ((...args: any[]) => any);
  className?: string;
  closedByDefault?: boolean;
  contentHeight?: string;
  contentId?: string;
  contentRef?: (...args: any[]) => any;
  disabled?: boolean;
  displayWhenClosed?: React.ReactElement;
  displayWhenOpen?: React.ReactElement;
  header?: React.ElementType;
  headerProps?: Record<string, any>;
  id?: string;
  label: React.ReactElement | string;
  onClickToggle?: (...args: any[]) => any;
  onToggle?: (...args: any[]) => any;
  open?: boolean;
  separator?: boolean;
  toggleKeyHandlers?: Record<string, any>;
  toggleKeyMap?: Record<string, any>;
};

function getContentClass(open) {
  return classNames(css["content-region"], { [`${css.expanded}`]: open });
}

function getRootClasses(separator, disabled, className) {
  return classNames(
    css.accordion,
    { [css.hasSeparator]: separator },
    { [`${css.disabled}`]: disabled },
    className,
  );
}

function getWrapClass(open) {
  return classNames(css["content-wrap"], { [`${css.expanded}`]: open });
}

/* The z-index requirements for accordions:
 * Accordions should not overlap any overlays/dropdowns from previous/next accordions.
 * Accordions/overlays should not be overlapped if focus left the accordion or went to another pane...
 *
 */

// loops through other accordions rendered within the UI to find the highest z-index among them all.
const getHighestStackOrder = () => {
  const accordions = Array.from(
    document.querySelectorAll(`.${css["content-wrap"]}`),
  );
  const highest = accordions?.reduce((acc, cur) => {
    let currentZ = getComputedStyle(cur).getPropertyValue("z-index");
    // skip any that might have non-integer z-index settings.
    if (currentZ === "auto" || currentZ === null) return acc;
    currentZ = parseInt(currentZ, 10);
    // this will prevent duplicated highest z-index, since with matching z-index, the tag
    // that's ordered last will overlap.
    if (currentZ === acc) currentZ += 1;
    return currentZ > acc ? currentZ : acc;
  }, 2);
  return highest;
};

const Accordion = (props: AccordionProps) => {
  const {
    accordionSet,
    children,
    className = "",
    closedByDefault,
    contentHeight,
    contentId: contentIdProp,
    contentRef,
    disabled,
    header = DefaultAccordionHeader,
    headerProps = { headingLevel: 3 },
    id,
    label,
    onClickToggle = noop,
    onToggle: onToggleProp,
    open,
    separator = true,
    toggleKeyHandlers,
    toggleKeyMap,
  } = props;

  const toggle = useRef(null);
  const content = useRef(null);
  const setContentRef = useRef((ref) => {
    content.current = ref;
    if (typeof contentRef === "function") {
      contentRef(ref);
    }
  }).current;
  const contentId = useRef(contentIdProp || uniqueId("accordion")).current;
  const trackingId = useRef(id || uniqueId("acc")).current;
  const labelId = useRef(
    headerProps?.labelId || `accordion-toggle-button-${trackingId}`,
  ).current;
  const headerRef = useRef(null);

  const getRef = useRef(() => toggle.current).current;
  const [isOpen, updateOpen] = useState(open || !closedByDefault);
  const [registered, updateRegistered] = useState(!accordionSet);
  const [zIndex, updateZIndex] = useState(1);
  const [focused, updateFocused] = useState(false);

  const uncontrolledToggle = useRef(() => {
    updateOpen((current) => !current);
  }).current;

  // Affecting z-index when accordions are focused within.
  // We only update the accordion z-index if it does not contain focus _and_ if it's not
  // already the highest z-index among other accordions.
  const handleFocusIn = () => {
    if (!focused) {
      updateFocused(true);
      updateZIndex((cur) => {
        if (content.current.matches(":focus-within")) {
          // we assign one greater than the highest z-index value.
          const highest = getHighestStackOrder() + 1;
          if (cur !== highest) {
            return highest;
          }
        }
        return cur;
      });
    }
  };

  const handleFocusOut = () => {
    updateFocused(false);
  };

  const onToggle = (toggleArgs) => {
    if (typeof open === "undefined") {
      uncontrolledToggle(toggleArgs);
    } else {
      onToggleProp(toggleArgs);
    }

    onClickToggle({ ...toggleArgs, open: !isOpen });
  };

  useEffect(() => {
    if (open !== undefined) {
      updateOpen(open);
    }
  }, [open]);

  // At registration, accordions are assigned a z-index that, in most cases,
  // will render in reverse order.
  useEffect(() => {
    // eslint-disable-line
    function registrationCallback(isRegistered) {
      updateRegistered(isRegistered);
      if (accordionSet) {
        const defaultZIndex = accordionSet.getStackOrder(trackingId);
        updateZIndex(defaultZIndex);
      }
    }

    if (accordionSet) {
      accordionSet.registerAccordion(
        getRef,
        trackingId,
        closedByDefault,
        registrationCallback,
      );
      return () => {
        accordionSet.unregisterAccordion(trackingId);
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const accordionHeaderProps = Object.assign(
    {},
    omitProps(props, ["contentHeight", "headerProps"]),
    {
      contentId,
      toggleRef: (ref) => {
        toggle.current = ref;
      },
      open: isOpen,
      onToggle,
      label,
      labelId,
      ...headerProps,
    },
  );
  const headerElement = React.createElement(header, accordionHeaderProps);

  if (!registered) return null;
  return (
    <section
      id={trackingId}
      className={getRootClasses(separator, disabled, className)}
      data-test-accordion-section
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <HotKeys
        id={`${trackingId}-hotkeys`}
        keyMap={toggleKeyMap}
        handlers={toggleKeyHandlers}
        attach={headerRef}
        noWrapper
      >
        <div ref={headerRef} style={{ width: "100%", display: "flex" }}>
          {headerElement}
        </div>
      </HotKeys>
      <div className={getWrapClass(isOpen)} style={{ zIndex }}>
        <div
          role="region"
          className={getContentClass(isOpen)}
          ref={setContentRef}
          id={contentId}
          aria-labelledby={accordionHeaderProps.labelId}
          style={contentHeight ? { height: contentHeight } : null}
          data-test-accordion-wrapper
        >
          {typeof children === "function" ? children(isOpen) : children}
        </div>
      </div>
    </section>
  );
};

export default withAccordionSet(Accordion);
