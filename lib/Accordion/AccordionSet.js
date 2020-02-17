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
    singleOpen: PropTypes.bool,
  }

  static defaultProps = {
    inheritStatus: true
  }

  constructor(props) {
    super(props);

    this.registerAccordion = this.registerAccordion.bind(this);
    this.focusNextAccordion = this.focusNextAccordion.bind(this);
    this.focusPreviousAccordion = this.focusPreviousAccordion.bind(this);
    this.focusFirstAccordion = this.focusFirstAccordion.bind(this);
    this.focusLastAccordion = this.focusLastAccordion.bind(this);
    // this.initExpanded = this.initExpanded.bind(this);
    // this.defaultToggle = this.defaultToggle.bind(this);

    this.accordionList = [];

    // const accordionStatus = this.initExpanded();
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

    // this.handleToggle = this.props.onToggle || this.defaultToggle;
    this.innerStatus = React.createRef();
  }

  // static getDerivedStateFromProps(props) {
  //   let updateObject = null;
  //   if (typeof props.accordionStatus !== 'undefined') {
  //     updateObject = {
  //       expanded: props.accordionStatus,
  //     };
  //   }

  //   return updateObject;
  // }

  componentDidUpdate(prevProps, prevState) {
    if (Object.keys(prevState.registered).length !== Object.keys(this.state.registered).length) {
      if (this.innerStatus.current) this.innerStatus.current.setStatus(this.state);
    }
  }

  // initExpanded() {
  //   if (this.props.accordionStatus) {
  //     return this.props.accordionStatus;
  //   }

  //   return {};
  // }

  focusNextAccordion(e) {
    const currentAccordionIndex = indexOf(this.accordionList, e.target);
    if (currentAccordionIndex !== -1) {
      if (this.accordionList.length >= currentAccordionIndex + 2) {
        this.accordionList[currentAccordionIndex + 1].focus();
      }
      if (currentAccordionIndex === this.accordionList.length - 1) {
        this.focusFirstAccordion();
      }
    }
  }

  focusPreviousAccordion(e) {
    const currentAccordionIndex = indexOf(this.accordionList, e.target);
    if (currentAccordionIndex !== -1) {
      if (currentAccordionIndex > 0) {
        this.accordionList[currentAccordionIndex - 1].focus();
      }
      if (currentAccordionIndex === 0) {
        this.focusLastAccordion();
      }
    }
  }

  focusFirstAccordion() {
    this.accordionList[0].focus();
  }

  focusLastAccordion() {
    this.accordionList[this.accordionList.length - 1].focus();
  }

  registerAccordion(ref, id, closedByDefault = false) {
    if (indexOf(this.accordionList, ref) === -1 && ref !== null) {
      this.accordionList.push(ref);
      const statusUpdater = this.props.setStatus || this.setState.bind(this);
      statusUpdater((curState) => (
        {
          ...curState,
          [id]: !closedByDefault
        }
      ));
    }
  }

  // defaultToggle({ id }) {
  //   if (Object.prototype.hasOwnProperty.call(this.state.expanded, id)) {
  //     this.setState((curState) => {
  //       const newState = curState;
  //       newState.expanded[id] = !curState.expanded[id];
  //       return newState;
  //     });
  //   }
  // }

  render() {
    const {
      children,
      id,
      inheritStatus,
      initialStatus,
      accordionStatus,
      onToggle: onToggleProp,
      singleOpen,
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
          {({ status, setStatus, onToggle }) => (
            <AccProvider
              value={{
                expanded: status,
                set: {
                  registerAccordion: this.registerAccordion,
                  handleToggle: onToggleProp || onToggle,
                  toggleKeyHandlers: this.toggleKeyHandlers,
                  toggleKeyMap: this.toggleKeyMap
                }
              }}
            >
              <div role="tablist" aria-multiselectable={!singleOpen} id={id}>
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
