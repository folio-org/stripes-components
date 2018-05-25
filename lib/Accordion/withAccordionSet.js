import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { Consumer as AccordionConsumer } from './AccordionContext';

const withAccordionSet = (Component) => {
  const WrappedAccordion = (props) => {
    const trackingId = uniqueId('accordion_');
    return (
      <AccordionConsumer>
        {status => {
          if (status) {
            const uId = props.id || trackingId;
            return (<Component
              accordionSet={status.set}
              open={status.expanded[uId]}
              id={uId}
              onToggle={status.set.handleToggle}
              toggleRef={status.set.registerAccordion}
              toggleKeyHandlers={status.set.toggleKeyHandlers}
              toggleKeyMap={status.set.toggleKeyMap}
              {...props}
            />);
          }
          return <Component {...props} />;
        }
        }
      </AccordionConsumer>
    );
  };

  WrappedAccordion.propTypes = {
    id: PropTypes.string,
  };

  return WrappedAccordion;
};

export default withAccordionSet;
