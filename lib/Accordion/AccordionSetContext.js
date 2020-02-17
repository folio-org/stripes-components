import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

export const { Provider, Consumer } = React.createContext();

export const withAccordionSet = (WrappedComponent) => {
  class WrappedAccordion extends Component {
    static propTypes = {
      id: PropTypes.string,
    }

    constructor(props) {
      super(props);
      this.trackingId = uniqueId('accordion_');
    }

    render() {
      return (
        <Consumer>
          {status => {
            if (status) {
              const uId = this.props.id || this.trackingId;
              return (<WrappedComponent
                accordionSet={status.set}
                open={status.expanded[uId]}
                id={uId}
                onToggle={status.set.handleToggle}
                toggleRef={status.set.registerAccordion}
                toggleKeyHandlers={status.set.toggleKeyHandlers}
                toggleKeyMap={status.set.toggleKeyMap}
                {...this.props}
              />);
            }
            return <WrappedComponent {...this.props} />;
          }
          }
        </Consumer>
      );
    }
  }

  return WrappedAccordion;
};
