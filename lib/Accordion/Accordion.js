import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  uniqueId,
} from 'lodash';

import { DefaultAccordionHeader } from './headers';
import css from './Accordion.css';
import { HotKeys } from '../HotKeys';
import useClickOutside from '../../hooks/useClickOutside';
import { withAccordionSet } from './AccordionSetContext';
import omitProps from '../../util/omitProps';

const propTypes = {
  accordionSet: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  closedByDefault: PropTypes.bool,
  contentHeight: PropTypes.string,
  contentId: PropTypes.string,
  contentRef: PropTypes.func,
  disabled: PropTypes.bool,
  displayWhenClosed: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  displayWhenOpen: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]),
  headerProps: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.oneOfType([ // eslint-disable-line react/no-unused-prop-types
    PropTypes.element,
    PropTypes.string
  ]).isRequired,
  onToggle: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  open: PropTypes.bool,
  separator: PropTypes.bool,
  toggleKeyHandlers: PropTypes.object,
  toggleKeyMap: PropTypes.object,
};

function getContentClass(open) {
  return classNames(
    css['content-region'],
    { [`${css.expanded}`]: open },
  );
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
  return classNames(
    css['content-wrap'],
    { [`${css.expanded}`]: open },
  );
}

const Accordion = (props) => {
  const {
    accordionSet,
    children,
    closedByDefault,
    contentHeight,
    contentId: contentIdProp,
    contentRef,
    disabled,
    header,
    headerProps,
    id,
    onToggle: onToggleProp,
    open,
    separator,
    toggleKeyHandlers,
    toggleKeyMap,
    className,
  } = props;

  const toggle = useRef(null);
  const content = useRef(null);
  const setContentRef = useRef((ref) => {
    content.current = ref;
    if (typeof contentRef === 'function') {
      contentRef(ref);
    }
  }).current;
  const contentId = useRef(contentIdProp || uniqueId('accordion')).current;
  const trackingId = useRef(id || uniqueId('acc')).current;

  const getRef = useRef(() => toggle.current).current;
  const [isOpen, updateOpen] = useState(open || !closedByDefault);
  const [focused, updateFocus] = useState(false);

  const uncontrolledToggle = useRef(() => {
    updateOpen(current => !current);
  }).current;

  const onToggle = typeof open === 'undefined' ? uncontrolledToggle : onToggleProp;

  useEffect(() => {
    if (open !== undefined) {
      updateOpen(open);
    }
  }, [open]);

  useEffect(() => { // eslint-disable-line 
    if (accordionSet) {
      accordionSet.registerAccordion(getRef, trackingId, closedByDefault);
      return () => {
        accordionSet.unregisterAccordion(trackingId);
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFocus = () => updateFocus(true);

  // use click outside instead of blur
  // blur has issues with clicking on scroll bars, where event's target is
  // the whole document instead of the scrollable content. because of this we can't
  // use blur to determine whether user clicked inside the accordion component tree
  useClickOutside(content, (e, isOutside) => updateFocus(!isOutside));

  const accordionHeaderProps = Object.assign({}, omitProps(props, ['contentHeight']), {
    contentId,
    toggleRef: (ref) => { toggle.current = ref; },
    open: isOpen,
    onToggle,
    ...headerProps
  });
  const headerElement = React.createElement(header, accordionHeaderProps);

  return (
    <section
      id={trackingId}
      className={getRootClasses(separator, disabled, className)}
      data-test-accordion-section
    >
      <HotKeys
        id={`${trackingId}-hotkeys`}
        keyMap={toggleKeyMap}
        handlers={toggleKeyHandlers}
        noWrapper
      >
        {headerElement}
      </HotKeys>
      <div className={getWrapClass(isOpen)} style={{ zIndex: focused ? '2' : '1' }}>
        <div
          role="region"
          className={getContentClass(isOpen)}
          ref={setContentRef}
          id={contentId}
          aria-labelledby={`accordion-toggle-button-${trackingId}`}
          onFocus={handleFocus}
          style={contentHeight ? { height: contentHeight } : null}
          data-test-accordion-wrapper
        >
          {typeof children === 'function' ? children(isOpen) : children}
        </div>
      </div>
    </section>
  );
};

Accordion.propTypes = propTypes;
Accordion.defaultProps = {
  className: '',
  header: DefaultAccordionHeader,
  separator: true,
};

export default withAccordionSet(Accordion);
