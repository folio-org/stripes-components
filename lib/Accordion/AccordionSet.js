import React from 'react';
import PropTypes from 'prop-types';
import indexOf from 'lodash/indexOf';
import omit from 'lodash/omit';
import noop from 'lodash/noop';

import StripesOverlayWrapper from '../../util/StripesOverlayWrapper';
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
    onRegisterAccordion: PropTypes.func,
    onToggle: PropTypes.func,
    onUnregisterAccordion: PropTypes.func,
    setStatus: PropTypes.func,
  }

  static defaultProps = {
    inheritStatus: true,
    onRegisterAccordion: noop,
    onUnregisterAccordion: noop,
  }

  constructor(props) {
    super(props);

    this.focusNextAccordion = this.focusNextAccordion.bind(this);
    this.focusPreviousAccordion = this.focusPreviousAccordion.bind(this);
    this.focusFirstAccordion = this.focusFirstAccordion.bind(this);
    this.focusLastAccordion = this.focusLastAccordion.bind(this);
    this.unregisterAccordion = this.unregisterAccordion.bind(this);

    this.state = {
      status: {},
      accordionList: []
    };

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
      Object.keys(prevState.status).length !== Object.keys(this.state.status).length) {
      if (this.innerStatus.current) this.innerStatus.current.setStatus(this.state.status);
    }
  }

  focusNextAccordion(e) {
    const currentAccordionIndex = this.state.accordionList.findIndex(a => e.target.id.includes(a.id));
    if (currentAccordionIndex !== -1) {
      if (this.state.accordionList.length >= currentAccordionIndex + 2) {
        this.state.accordionList[currentAccordionIndex + 1].getRef().focus();
      } else if (currentAccordionIndex === this.state.accordionList.length - 1) {
        this.focusFirstAccordion();
      }
    }
  }

  focusPreviousAccordion(e) {
    const currentAccordionIndex = this.state.accordionList.findIndex(a => e.target.id.includes(a.id));
    if (currentAccordionIndex !== -1) {
      if (currentAccordionIndex > 0) {
        const prevRef = this.state.accordionList[currentAccordionIndex - 1].getRef();
        prevRef.focus();
      } else if (currentAccordionIndex === 0) {
        this.focusLastAccordion();
      }
    }
  }

  focusFirstAccordion() {
    this.state.accordionList[0].getRef().focus();
  }

  focusLastAccordion() {
    this.state.accordionList.at(-1).getRef().focus();
  }

  getStackOrder = (id) => {
    const { accordionList } = this.state;
    const index = accordionList.findIndex(a => a.id === id);
    return index;
  }

  getNumberOfAccordions = () => {
    return this.state.accordionList.length;
  }

  registerAccordion = (getRef, id, closedByDefault = false, confirm) => {
    const { initialStatus } = this.props;

    const status = initialStatus || {};
    if (indexOf(this.state.accordionList, id) === -1 && id !== null) {
      const statusUpdater = this.props.setStatus || this.setState.bind(this);
      this.setState(cur => {
        return { accordionList: [...cur.accordionList, { id, getRef }] }
      }, () => {
        confirm(true);
        statusUpdater((curState) => {
          const newState = {
            ...curState,
            status: {
              ...curState.status,
              [id]: status[id] !== undefined ? status[id] : !closedByDefault
            }
          };
          return newState;
        });
      });
    }

    this.props.onRegisterAccordion(id);
  }

  unregisterAccordion = (id) => {
    const accordionIndex = this.state.accordionList.findIndex(accordion => accordion.id === id);
    if (accordionIndex === -1) {
      return;
    }

    this.setState(cur => {
      const newList = cur.accordionList.splice(accordionIndex, 1);
      return { accordionList: newList }
    });

    const statusUpdater = this.props.setStatus || this.setState.bind(this);
    statusUpdater((curState) => {
      return {
        ...curState,
        status: omit(curState.status, [id]),
      };
    });

    this.innerStatus.current?.setStatus(current => {
      return {
        ...current,
        status: omit(current.status, [id]),
      };
    });

    this.props.onUnregisterAccordion(id);
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
                  toggleKeyMap: this.toggleKeyMap,
                  getStackOrder: this.getStackOrder,
                  getNumberOfAccordions: this.getNumberOfAccordions,
                }
              }}
            >
              <div id={id}>
                <StripesOverlayWrapper>
                  {children}
                </StripesOverlayWrapper>
              </div>
            </AccProvider>
          )}
        </AccordionStatus>
      </StatusContext>
    );
  }
}

export default withAccordionStatus(AccordionSet);
