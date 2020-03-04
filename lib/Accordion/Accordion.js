import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  isBoolean,
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

class Accordion extends React.Component {
  static defaultProps = {
    header: DefaultAccordionHeader,
    separator: true,
  }

  constructor(props) {
    super(props);

    this.uncontrolledToggle = this.uncontrolledToggle.bind(this);
    this.initializeAccordion = this.initializeAccordion.bind(this);
    this.setContentRef = this.setContentRef.bind(this);
    this.tearDownHandlers = this.tearDownHandlers.bind(this);
    this.syncMaxHeight = this.syncMaxHeight.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.collapseRaf = this.collapseRaf.bind(this);
    this.getRef = this.getRef.bind(this);

    // ref to content div.
    this.content = null;
    // ref to toggle.
    this.toggle = null;

    // tracked scrollHeight of content div
    this.contentHeight = 0;
    // whether this.contentHeight should be updated (false indicates difference.)
    this.syncedHeight = true;

    // animation callback for expansion requestAnimationFrame (RAF)
    this.expandRAFCallback = null;
    // animation callback for collapsing requestAnimationFrame (RAF)
    this.collapseRAFCallback = null;

    // callback for syncing
    this.syncHeightCallback = null;

    // status indicators for transition - true = mid transition.
    this.transitioningOpen = false;
    this.transitioningClosed = false;

    // id for content div needed for proper area support - either supplied or auto-generated.
    this.contentId = this.initializeContentId();

    // local state may or may not be set up if open prop is passed.
    this.state = this.initializeAccordion();

    this.trackingId = this.props.id || uniqueId('acc');
  }

  componentDidMount() {
    this.syncMaxHeight();
    // fix issue with accordion not animating open if closed on mount.
    if ((Object.prototype.hasOwnProperty.call(this.props, 'open') && this.props.open === false) ||
        (Object.prototype.hasOwnProperty.call(this.state, 'isOpen') && !this.state.isOpen)) {
      this.content.style.maxHeight = '0';
      this.content.style.visibility = 'hidden';
      this.content.style.position = 'fixed';
    }

    if (this.props.accordionSet) {
      this.props.accordionSet.registerAccordion(this.getRef, this.trackingId, this.props.closedByDefault);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // prop/state changes to open status set off the animation callbacks.
    // if using state...
    if (isBoolean(this.state.isOpen)) {
      if (this.state.isOpen !== prevState.isOpen) {
        this.setAnimationCallbacks(this.state.isOpen);
      }
    } else if (this.props.open !== prevProps.open) {
      this.setAnimationCallbacks(this.props.open);
    }
  }

  componentWillUnmount() {
    this.tearDownHandlers();
  }

  getRef = () => this.toggle;

  setAnimationCallbacks(isOpen) {
    if (isOpen) {
      this.transitioningOpen = true;
      this.syncedHeight = false;
      this.expandRaf();
    } else {
      this.transitioningClosed = true;
      this.collapseRaf();
      this.syncMaxHeight();
    }
  }

  syncMaxHeight() {
    this.syncHeightCallback = window.requestAnimationFrame(() => {
      this.contentHeight = this.content ? this.content.scrollHeight : 0;
      this.syncedHeight = true;
      this.forceUpdate();
    });
  }

  collapseRaf() {
    if (this.collapseCallback) { // if there's a collapse in progress, let it finish...
      this.transitioningClosed = false;
      return;
    }

    // if there is no content ref, we might get errors
    if (!this.content) return;

    this.transitioningOpen = false;
    this.content.style.overflow = 'hidden';
    this.collapseCallback = window.requestAnimationFrame(() => {
      this.content.style.maxHeight = `${this.contentHeight}px`;
      window.cancelAnimationFrame(this.collapseCallback);
      this.collapseCallback = window.requestAnimationFrame(() => {
        this.content.style.maxHeight = '0';
        window.cancelAnimationFrame(this.collapseCallback);
        this.collapseCallback = null;
      });
    });
  }

  expandRaf() {
    if (this.expandCallback) {
      this.transitioningOpen = false;
      return;
    }
    this.transitioningClosed = false;
    this.content.style.display = '';
    this.expandCallback = window.requestAnimationFrame(() => {
      // update contentHeight...
      this.contentHeight = this.content.scrollHeight;
      this.content.style.maxHeight = this.contentHeight === 0 ? 'none' : `${this.contentHeight}px`;
      window.cancelAnimationFrame(this.expandCallback);
      this.expandCallback = null;
    });
  }

  initializeAccordion() {
    // if no 'open' boolean is provided, set up our own state...
    if (this.props.open === undefined) {
      if (this.props.closedByDefault) {
        return {};
      }
      return { isOpen: true };
    }
    return {};
  }

  // generate unique id if no id is provided.
  initializeContentId() {
    return (this.props.contentId === undefined) ? uniqueId('accordion') : this.props.contentId;
  }

  tearDownHandlers() {
    window.cancelAnimationFrame(this.syncHeightCallback);
    window.cancelAnimationFrame(this.expandCallback);
    window.cancelAnimationFrame(this.collapseCallback);
  }

  uncontrolledToggle() {
    this.setState((curState) => {
      const newState = { ...curState };
      newState.isOpen = !curState.isOpen;
      return newState;
    });
  }

  setContentRef(ref) {
    this.content = ref;
    if (this.props.contentRef) {
      this.props.contentRef(ref);
    }
  }

  handleTransitionEnd() {
    if (this.transitioningOpen) {
      this.transitioningOpen = false;
      this.content.style.maxHeight = 'none';
      this.content.style.overflow = 'visible';
    }
    if (this.transitioningClosed) {
      this.transitioningClosed = false;
      this.content.style.visibility = 'hidden';
      this.content.style.position = 'fixed';
    }
  }

  getContentClass(open) {
    return classNames(
      css.content,
      { [`${css.expanded}`]: open },
    );
  }

  getRootClasses() {
    return classNames(
      css.accordion,
      { [css.hasSeparator]: this.props.separator },
      { [`${css.disabled}`]: this.props.disabled },
    );
  }

  render() {
    let open;
    if (this.props.open !== undefined) {
      open = this.props.open;
    } else {
      open = this.state.isOpen;
    }

    let onToggle;
    if (this.props.onToggle && this.props.open !== undefined) {
      onToggle = this.props.onToggle;
    } else {
      onToggle = this.uncontrolledToggle;
    }

    const headerProps = Object.assign({}, this.props, {
      contentId: this.contentId,
      toggleRef: (ref) => { this.toggle = ref; },
      open,
      onToggle
    });
    const headerElement = React.createElement(this.props.header, headerProps);

    return (
      <section id={this.trackingId} className={this.getRootClasses()} data-test-accordion-section>
        <HotKeys
          id={`${this.trackingId}-hotkeys`}
          keyMap={this.props.toggleKeyMap}
          handlers={this.props.toggleKeyHandlers}
          noWrapper
        >
          {headerElement}
        </HotKeys>
        <div
          className={this.getContentClass(open)}
          ref={this.setContentRef}
          role="tabpanel"
          id={this.contentId}
          onTransitionEnd={this.handleTransitionEnd}
          // effectively hides any tab-able elements within a collapsed accordion...
          style={{
            visibility: open ? 'visible' : 'hidden',
            position: open ? 'static' : 'fixed'
          }}
          data-test-accordion-wrapper
        >
          {this.props.children}
        </div>
      </section>
    );
  }
}
// {this.props.separator && <div className={css.separator} />}

Accordion.propTypes = propTypes;

export default withAccordionSet(Accordion);
