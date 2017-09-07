import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { DefaultAccordionHeader } from './headers';
import css from './Accordion.css';
import { HotKeys } from '../HotKeys';

const propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  contentId: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired, // eslint-disable-line react/no-unused-prop-types
  displayWhenOpen: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  displayWhenClosed: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  onToggle: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]),
  contentRef: PropTypes.func,
  separator: PropTypes.bool,
  toggleKeyHandlers: PropTypes.object,
  toggleKeyMap: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

class Accordion extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = this.initializeAccordion();

    this.uncontrolledToggle = this.uncontrolledToggle.bind(this);
    this.initializeAccordion = this.initializeAccordion.bind(this);
    this.setContentRef = this.setContentRef.bind(this);
  }

  static defaultProps = {
    header: DefaultAccordionHeader,
    separator: true,
    onToggle: this.uncontrolledToggle,
  }

  initializeAccordion() {
    // if no 'open' boolean or 'id' prop is provided, set up our own state...
    if(this.props.open === undefined && this.props.id === undefined) {
      return { isOpen: true };
    }
    return {};
  }

  uncontrolledToggle(){
    this.setState((curState) => {
      const newState = curState;
      newState.isOpen = !curState.isOpen;
      return newState;
    });
  }

  setContentRef(ref){
    if (this.props.contentRef) {
      this.props.contentRef(ref);
    }
  };

  render() {

    let contentId;
    if (this.props.contentId) {
      contentId = this.props.contentId;
    } else {
      contentId = uniqueId('accordion');
    }

    let open;
    if(this.props.open !== undefined) {
      open = this.props.open;
    } else {
      open = this.state.isOpen;
    }

    let onToggle;
    if(this.props.onToggle && this.props.open !== undefined) {
      onToggle = this.props.onToggle;
    } else {
      onToggle = this.uncontrolledToggle;
    }

    const headerProps = Object.assign({}, this.props, { contentId, open, onToggle });
    const headerElement = React.createElement(this.props.header, headerProps);

    return (
      <section id={this.props.id} className={css.root} >
        <HotKeys keyMap={this.props.toggleKeyMap} handlers={this.props.toggleKeyHandlers} noWrapper >
          {headerElement}
        </HotKeys>
        <div className={css.content} ref={this.setContentRef} role="tabpanel" id={contentId}>
          {open &&
            this.props.children
          }
        </div>
        {this.props.separator && <div className={css.separator} />}
      </section>
    );
  }
};

Accordion.propTypes = propTypes;

export default Accordion;
