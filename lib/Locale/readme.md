# Locale Context
Higher-order component for consuming `locale` from a context provider.

## Usage
When using this component within the context of a `stripes-core`-powered platform, `stripes-core` creates a `<LocaleContext.Provider>`.

To wrap a component in a `<LocaleContext.Consumer>`, thus sending a `locale` prop to the component:
```
import withLocale from '@folio/stripes-components/lib/Locale';

function ExampleComponent({ locale }) => (
  <div>{locale}</div>
);

export default withLocale(ExampleComponent)
```

For examples, see [`<Datepicker>`](../Datepicker) and [`<Timepicker>`](../Timepicker).

If a component wrapped `withLocale` does not have a parent `<LocaleContext.Provider>`, it will receive the default value for the `locale` prop, `en`.

### More on React context
This is using the [context API](https://reactjs.org/docs/context.html) shipped with React 16.3.
