import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  uniqueId,
  noop,
} from 'lodash';

import { DefaultAccordionHeader } from './headers';
import css from './Accordion.css';
import { HotKeys } from '../HotKeys';
import { withAccordionSet } from './AccordionSetContext';
import omitProps from '../../util/omitProps';

const propTypes = {
  accordionSet: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
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
  onClickToggle: PropTypes.func,
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
    onClickToggle,
    label,
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
  const labelId = useRef(`accordion-toggle-button-${trackingId}`).current;


  const getRef = useRef(() => toggle.current).current;
  const [isOpen, updateOpen] = useState(open || !closedByDefault);
  const [registered, updateRegistered] = useState(!accordionSet);
  const [stackOrder, updateStackOrder] = useState(1);

  const uncontrolledToggle = useRef(() => {
    updateOpen(current => !current);
  }).current;

  const onToggle = (toggleArgs) => {
    if (typeof open === 'undefined') {
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

  useEffect(() => { // eslint-disable-line
    function registrationCallback(isRegistered) {
      updateRegistered(isRegistered);
      if (accordionSet) {
        updateStackOrder(accordionSet.getStackOrder(trackingId));
      }
    }

    if (accordionSet) {
      accordionSet.registerAccordion(getRef, trackingId, closedByDefault, registrationCallback);
      return () => {
        accordionSet.unregisterAccordion(trackingId);
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const accordionHeaderProps = Object.assign({}, omitProps(props, ['contentHeight']), {
    contentId,
    toggleRef: (ref) => { toggle.current = ref; },
    open: isOpen,
    onToggle,
    label,
    labelId,
    ...headerProps
  });
  const headerElement = React.createElement(header, accordionHeaderProps);

  if (!registered) return null;
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
      <div className={getWrapClass(isOpen)} style={{ zIndex: stackOrder }}>
        <div
          role="region"
          className={getContentClass(isOpen)}
          ref={setContentRef}
          id={contentId}
          aria-labelledby={labelId}
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
  onClickToggle: noop,
};

export default withAccordionSet(Accordion);
