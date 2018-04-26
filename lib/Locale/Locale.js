import React from 'react';
export const LocaleContext = React.createContext('en');

export default function withLocale(Component) {
  return ({ locale, ...props }) => {
    if (locale) {
      return (<Component locale={locale} {...props} />);
    } else {
      return (
        <LocaleContext.Consumer>
          {contextualLocale => <Component locale={contextualLocale} {...props} />}
        </LocaleContext.Consumer>
      );
    }
  };
}
