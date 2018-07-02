# Inject Intl
Higher-order component for injecting the `intl` context into a component from a   `react-intl` `<IntlProvider>`. Based on `react-intl`'s `injectIntl()`.

Uses React 16.3 `forwardRef()` to enable cleaner ref handling than `react-intl`'s `injectIntl()`.

This component is intended to only be a temporary replacement for `react-intl`'s `injectIntl()`, until ref handling can be improved upstream. Not intended for use outside of `stripes-components`.

## Usage
Use exactly like `react-intl` `injectIntl()`.

## Learning
- [`react-intl` `injectIntl()`](https://github.com/yahoo/react-intl/blob/master/src/inject.js)
- [Forwarding Refs in React](https://reactjs.org/docs/forwarding-refs.html)
