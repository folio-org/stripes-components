import React from 'react';
import PropTypes from 'prop-types';
import indexOf from 'lodash/indexOf';
import { Provider as AccProvider } from './AccordionSetContext';
import AccordionStatus from './AccordionStatus';
import {
  AccordionStatusContext,
  withAccordionStatus
} from './AccordionStatusContext';

class AccordionSet extends React.Component {
  static propTypes = {
    accordionStatus: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    id: PropTypes.string,
    inheritStatus: PropTypes.bool,
    initialStatus: PropTypes.object,
    onToggle: PropTypes.func,
    setStatus: PropTypes.func,
  }

  static defaultProps = {
    inheritStatus: true
  }

  constructor(props) {
    super(props);

    this.focusNextAccordion = this.focusNextAccordion.bind(this);
    this.focusPreviousAccordion = this.focusPreviousAccordion.bind(this);
    this.focusFirstAccordion = this.focusFirstAccordion.bind(this);
    this.focusLastAccordion = this.focusLastAccordion.bind(this);
    this.unregisterAccordion = this.unregisterAccordion.bind(this);

    this.accordionList = [];

    this.state = {};

    this.toggleKeyHandlers = {
      nextAccordion: this.focusNextAccordion,
      previousAccordion: this.focusPreviousAccordion,
      firstAccordion: this.focusFirstAccordion,
      lastAccordion: this.focusLastAccordion,
    };

    this.toggleKeyMap = {
      nextAccordion: 'down',
      previousAccordion: 'up',
      firstAccordion: 'home',
      lastAccordion: 'end',
    };

    this.innerStatus = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(prevState).length !== Object.keys(this.state).length) {
      if (this.innerStatus.current) this.innerStatus.current.setStatus(this.state);
    }
  }

  focusNextAccordion(e) {
    const currentAccordionIndex = this.accordionList.findIndex(a => e.target.id.includes(a.id));
    if (currentAccordionIndex !== -1) {
      if (this.accordionList.length >= currentAccordionIndex + 2) {
        this.accordionList[currentAccordionIndex + 1].getRef().focus();
      }
      if (currentAccordionIndex === this.accordionList.length - 1) {
        this.focusFirstAccordion();
      }
    }
  }

  focusPreviousAccordion(e) {
    const currentAccordionIndex = this.accordionList.findIndex(a => e.target.id.includes(a.id));
    if (currentAccordionIndex !== -1) {
      if (currentAccordionIndex > 0) {
        const prevRef = this.accordionList[currentAccordionIndex - 1].getRef();
        prevRef.focus();
      }
      if (currentAccordionIndex === 0) {
        this.focusLastAccordion();
      }
    }
  }

  focusFirstAccordion() {
    this.accordionList[0].getRef().focus();
  }

  focusLastAccordion() {
    this.accordionList[this.accordionList.length - 1].getRef().focus();
  }

  registerAccordion = (getRef, id, closedByDefault = false) => {
    const { initialStatus } = this.props;

    const status = initialStatus || {};
    if (indexOf(this.accordionList, id) === -1 && id !== null) {
      this.accordionList.push({ id, getRef });
      const statusUpdater = this.props.setStatus || this.setState.bind(this);
      statusUpdater((curState) => (
        {
          ...curState,
          [id]: typeof status[id] !== 'undefined' ? status[id] : !closedByDefault
        }
      ));
    }
  }

  unregisterAccordion = (id) => {
    const accordionIndex = this.accordionList.findIndex(accordion => accordion.id === id);
    if (accordionIndex === -1) {
      return;
    }

    this.accordionList.splice(accordionIndex, 1);
    const statusUpdater = this.props.setStatus || this.setState.bind(this);
    statusUpdater((curState) => {
      delete curState[id];
      return curState;
    });

    // eslint-disable-next-line
    this.innerStatus.current?.setStatus(current => {
      delete current[id];
      return current;
    });
  }

  render() {
    const {
      children,
      id,
      inheritStatus,
      initialStatus,
      accordionStatus,
      onToggle: onToggleProp,
    } = this.props;

    let StatusContext = React.Fragment;
    // if we don't want to inherit the status context, we just render a blank provider.
    if (!inheritStatus) {
      StatusContext = AccordionStatusContext.Provider;
    }

    return (
      <StatusContext>
        <AccordionStatus
          accordionStatus={accordionStatus}
          initialStatus={initialStatus}
          ref={this.innerStatus}
        >
          {({ status, onToggle }) => (
            <AccProvider
              value={{
                expanded: status,
                set: {
                  registerAccordion: this.registerAccordion,
                  unregisterAccordion: this.unregisterAccordion,
                  handleToggle: onToggleProp || onToggle,
                  toggleKeyHandlers: this.toggleKeyHandlers,
                  toggleKeyMap: this.toggleKeyMap
                }
              }}
            >
              <div id={id}>
                {children}
              </div>
            </AccProvider>
          )}
        </AccordionStatus>
      </StatusContext>
    );
  }
}

export default withAccordionStatus(AccordionSet);
