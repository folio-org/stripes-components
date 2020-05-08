import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

export const { Provider, Consumer } = React.createContext();

export const withAccordionSet = (WrappedComponent) => {
  class WrappedAccordion extends Component {
    static propTypes = {
      id: PropTypes.string,
      onToggle: PropTypes.func,
      open: PropTypes.bool,
    }

    constructor(props) {
      super(props);
      this.trackingId = uniqueId('accordion_');
    }

    render() {
      const { onToggle, open, ...rest } = this.props;

      return (
        <Consumer>
          {status => {
            const uId = this.props.id || this.trackingId;
            return (<WrappedComponent
              accordionSet={status?.set}
              open={open ?? status?.expanded[uId]}
              id={uId}
              onToggle={onToggle ?? status?.set.handleToggle}
              toggleRef={status?.set.registerAccordion}
              toggleKeyHandlers={status?.set.toggleKeyHandlers}
              toggleKeyMap={status?.set.toggleKeyMap}
              {...rest}
            />);
          }
          }
        </Consumer>
      );
    }
  }

  return WrappedAccordion;
};
