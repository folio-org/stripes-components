import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { Consumer as AccordionConsumer } from './AccordionContext';

const withAccordionSet = (Component) => {
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
        <AccordionConsumer>
          {status => {
            if (status) {
              const uId = this.props.id || this.trackingId;
              return (<Component
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
            return <Component {...this.props} />;
          }
          }
        </AccordionConsumer>
      );
    }
  }

  return WrappedAccordion;
};

export default withAccordionSet;
