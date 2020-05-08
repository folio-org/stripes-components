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
      
      // We may have been rendered by a component that always passes us `onToggle` and `open`, even if they're undefined.
      // An example of this is `NotesSmartAccordion` in stripes-smart-components. In those cases, we don't want
      // to overwrite the onToggle/open we'll get from context with the `undefined` values in `this.props`.
      // So we pull those values out, do nullish coalescing on them when setting the Accordion props, and only
      // spread the `rest` props.

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
