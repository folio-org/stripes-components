import React from 'react';
import uniqueId from 'lodash/uniqueId';
import { Consumer as AccordionConsumer } from './AccordionContext';

export default function withAccordionSet(Component) {
  return function WrappedAccordion(props) {
    const trackingId = uniqueId('accordion_');
    return (
      <AccordionConsumer>
        { status => { 
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
          return <Component {...props}/>;
          }
        }
      </AccordionConsumer>
    );
  }
}
