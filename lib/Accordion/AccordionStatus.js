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
    if (props.accordionStatus) {
      return props.accordionStatus;
    }

    return null;
  }

  setStatus = fn => {
    this.setState(fn);
  };

  onToggle = id => {
    this.setStatus(current => ({
      ...current,
      [id]: !current[id]
    }));
  };

  render() {
    const { children } = this.props;
    return (
      <AccordionStatusContext.Provider
        value={{
          status: this.state,
          setStatus: this.setStatus,
          onToggle: this.onToggle
        }}
      >
        {typeof children === 'function'
          ? children({
            status: this.state,
            setStatus: this.setStatus,
            onToggle: this.onToggle
          })
          : children}
      </AccordionStatusContext.Provider>
    );
  }
}
