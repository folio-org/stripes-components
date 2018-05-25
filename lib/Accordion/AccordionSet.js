import React from 'react';
import PropTypes from 'prop-types';
import indexOf from 'lodash/indexOf';
import { Provider as AccProvider } from './AccordionContext';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  onToggle: PropTypes.func,
  accordionStatus: PropTypes.object,
  singleOpen: PropTypes.bool,
};

class AccordionSet extends React.Component {
  constructor(props) {
    super(props);

    this.registerAccordion = this.registerAccordion.bind(this);
    this.focusNextAccordion = this.focusNextAccordion.bind(this);
    this.focusPreviousAccordion = this.focusPreviousAccordion.bind(this);
    this.focusFirstAccordion =  this.focusFirstAccordion.bind(this);
    this.focusLastAccordion = this.focusLastAccordion.bind(this);
    this.initExpanded = this.initExpanded.bind(this);
    this.defaultToggle = this.defaultToggle.bind(this);

    this.accordionList = [];

    let accordionStatus = this.initExpanded();
    this.state = {
      expanded: accordionStatus,
      set: this,
    }

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

    this.handleToggle = this.props.onToggle || this.defaultToggle;
    
  }

  static getDerivedStateFromProps(props, state) {
    let updateObject = null;
    if (typeof props.accordionStatus !== 'undefined') {
      updateObject = {
        expanded: props.accordionStatus,
      }
    }

    return updateObject;
  }

  initExpanded() {
    if (this.props.accordionStatus) {
      return this.props.accordionStatus;
    }

    return {};
  }

  focusNextAccordion(e) {
    const currentAccordionIndex = indexOf(this.accordionList, e.target);
    if (currentAccordionIndex !== -1) {
      if (this.accordionList.length >= currentAccordionIndex + 2) {
        this.accordionList[currentAccordionIndex + 1].focus();
      }
      if (currentAccordionIndex === this.accordionList.length - 1 ) {
        this.focusFirstAccordion(e);
      }
    }
  }

  focusPreviousAccordion(e) {
    const currentAccordionIndex = indexOf(this.accordionList, e.target);
    if (currentAccordionIndex !== -1) {
      if (currentAccordionIndex > 0) {
        this.accordionList[currentAccordionIndex - 1].focus();
      }
      if (currentAccordionIndex === 0 ) {
        this.focusLastAccordion(e);
      }
    } 
  }

  focusFirstAccordion(e) {
    this.accordionList[0].focus();
  }

  focusLastAccordion(e) {
    this.accordionList[this.accordionList.length - 1].focus();
  }

  registerAccordion(ref, id) {
    if (indexOf(this.accordionList, ref) === -1 && ref !== null) {
      this.accordionList.push(ref);
      this.setState((curState) => {
        let newState = Object.assign({}, curState);
        if(typeof newState.expanded[id] === 'undefined') {
          newState.expanded[id] = true;
        }
        return newState;
      });
    }
  }

  defaultToggle({ label, id }) {
    if (Object.prototype.hasOwnProperty.call(this.state.expanded, id)) {
      this.setState((curState) => {
        const newState = curState;
        newState.expanded[id] = !curState.expanded[id];
        return newState;
      });
    }
  }

  render() {
    return (
      <AccProvider value={this.state}>
        <div role="tablist" aria-multiselectable={!this.props.singleOpen}>
          {this.props.children}
        </div>
      </AccProvider>
    );
  }
}

AccordionSet.propTypes = propTypes;

export default AccordionSet;
