import React from 'react';
import PropTypes from 'prop-types';
import { AccordionStatusContext } from './AccordionStatusContext';

export default class AccordionStatus extends React.Component {
  static propTypes = {
    accordionStatus: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    initialStatus: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = props.accordionStatus || props.initialStatus || {};
  }

  static getDerivedStateFromProps(props) {
    return props.accordionStatus ? props.accordionStatus : null;
  }

  setStatus = fn => {
    this.setState(fn);
  };

  onToggle = ({ id }) => {
    this.setStatus(current => ({
      ...current,
      [id]: !current[id]
    }));
  };

  render() {
    const { children } = this.props;
    const provided = {
      status: this.state,
      setStatus: this.setStatus,
      onToggle: this.onToggle
    };
    return (
      <AccordionStatusContext.Provider
        value={provided}
      >
        {typeof children === 'function'
          ? children(provided)
          : children}
      </AccordionStatusContext.Provider>
    );
  }
}
