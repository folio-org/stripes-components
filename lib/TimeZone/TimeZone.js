import React from 'react';
export const TimeZoneContext = React.createContext('UTC');

export default function withTimeZone(Component) {
  return ({ timeZone, ...props }) => {
    if (timeZone) {
      return (<Component timeZone={timeZone} {...props} />);
    } else {
      return (
        <TimeZoneContext.Consumer>
          {contextualTimeZone => <Component timeZone={contextualTimeZone} {...props} />}
        </TimeZoneContext.Consumer>
      );
    }
  };
}
