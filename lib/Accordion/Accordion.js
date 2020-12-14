import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  uniqueId,
} from 'lodash';

import { DefaultAccordionHeader } from './headers';
import css from './Accordion.css';
import { HotKeys } from '../HotKeys';
import { withAccordionSet } from './AccordionSetContext';

const propTypes = {
  accordionSet: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
  ]).isRequired,
  closedByDefault: PropTypes.bool,
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
    css.content,
    { [`${css.expanded}`]: open },
  );
}

function getRootClasses(separator, disabled) {
  return classNames(
    css.accordion,
    { [css.hasSeparator]: separator },
    { [`${css.disabled}`]: disabled },
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
    toggleKeyMap
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

  const onToggle = typeof openProp === 'undefined' ? uncontrolledToggle : onToggleProp;

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
  const handleBlur = () => updateFocus(false);

  const accordionHeaderProps = Object.assign({}, props, {
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
      className={getRootClasses(separator, disabled)}
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
          onBlur={handleBlur}
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
  header: DefaultAccordionHeader,
  headerProps: {},
  separator: true,
};

export default withAccordionSet(Accordion);
