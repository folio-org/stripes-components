// @ts-nocheck
import React from "react";
import { AccordionStatusContext } from "./AccordionStatusContext";
type AccordionStatusProps = {
  accordionStatus?: Record<string, any>;
  children?: React.ReactNode | ((...args: any[]) => any);
  initialStatus?: Record<string, any>;
};

export default class AccordionStatus extends React.Component<AccordionStatusProps> {
  constructor(props) {
    super(props);

    this.state = {
      status: props.accordionStatus || props.initialStatus || {},
    };
  }

  static getDerivedStateFromProps(props) {
    return props.accordionStatus ? { status: props.accordionStatus } : null;
  }

  setStatus = (fn) => {
    if (typeof fn === "function") {
      this.setState((cur) => fn(cur));
    } else {
      this.setState({ status: fn });
    }
  };

  onToggle = ({ id }) => {
    this.setStatus((current) => {
      const newState = {
        status: {
          ...current.status,
          [id]: !current.status[id],
        },
      };
      return newState;
    });
  };

  render() {
    const { children } = this.props;
    const provided = {
      status: this.state.status,
      setStatus: this.setStatus,
      onToggle: this.onToggle,
    };
    return (
      <AccordionStatusContext.Provider value={provided}>
        {typeof children === "function" ? children(provided) : children}
      </AccordionStatusContext.Provider>
    );
  }
}
