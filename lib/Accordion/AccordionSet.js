import React from 'react';
import PropTypes from 'prop-types';
import indexOf from 'lodash/indexOf';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  onToggle: PropTypes.func,
  accordionStatus: PropTypes.object,
  singleOpen: PropTypes.bool,
};

class AccordionSet extends React.Component {
  constructor(props) {
    super(props);

    this.getChildInitialStatus = this.getChildInitialStatus.bind(this);
    this.registerAccordion = this.registerAccordion.bind(this);
    this.focusNextAccordion = this.focusNextAccordion.bind(this);
    this.focusPreviousAccordion = this.focusPreviousAccordion.bind(this);
    this.initState = this.initState.bind(this);

    this.accordionList = [];

    this.state = this.initState();

    this.toggleKeyHandlers = {
      nextAccordion: this.focusNextAccordion,
      previousAccordion: this.focusPreviousAccordion,
    };

    this.toggleKeyMap = {
      nextAccordion: 'down',
      previousAccordion: 'up',
    };
  }

  initState() {
    if (this.props.accordionStatus) {
      return null;
    }

    return {
      expanded: this.getChildInitialStatus(),
    };
  }

  focusNextAccordion(e) {
    const currentAccordionIndex = indexOf(this.accordionList, e.target);
    if (currentAccordionIndex !== -1) {
      if (this.accordionList.length >= currentAccordionIndex + 2) {
        this.accordionList[currentAccordionIndex + 1].focus();
      }
    }
  }

  focusPreviousAccordion(e) {
    const currentAccordionIndex = indexOf(this.accordionList, e.target);
    if (currentAccordionIndex !== -1 && currentAccordionIndex > 0) {
      this.accordionList[currentAccordionIndex - 1].focus();
    }
  }

  registerAccordion(ref) {
    if (indexOf(this.accordionList, ref) === -1 && ref !== null) {
      this.accordionList.push(ref);
    }
  }

  getChildInitialStatus() {
    if (this.props.accordionStatus) {
      return this.props.accordionStatus;
    }

    const accordionStatus = {};
    React.Children.forEach(this.props.children, (child) => {
      accordionStatus[`${child.props.id}`] = true;
    });
    return accordionStatus;
  }

  defaultToggle({ id }) {
    if (Object.prototype.hasOwnProperty.call(this.state.expanded, id)) {
      this.setState((curState) => {
        const newState = curState;
        newState.expanded[id] = !curState.expanded[id];
        return newState;
      });
    }
  }

  getStatus(id) {
    if (this.props.accordionStatus) {
      return this.props.accordionStatus[id];
    }
    return this.state.expanded[id];
  }

  render() {
    const clonedChildren = React.Children.map(this.props.children, (child) => {
      let toggleHandler;
      const { label, id } = child.props;
      if (!child.props.onToggle && !this.props.onToggle) {
        toggleHandler = () => { this.defaultToggle({ label, id }); };
      } else {
        toggleHandler = child.props.onToggle || this.props.onToggle;
      }

      return React.cloneElement(
        child,
        Object.assign({}, child.props,
          {
            open: this.getStatus(child.props.id),
            onToggle: toggleHandler,
            toggleRef: this.registerAccordion,
            toggleKeyHandlers: this.toggleKeyHandlers,
            toggleKeyMap: this.toggleKeyMap,
          },
        ),
      );
    });

    return (
      <div role="tablist" aria-multiselectable={!this.props.singleOpen}>
        {clonedChildren}
      </div>
    );
  }
}

AccordionSet.propTypes = propTypes;

export default AccordionSet;
