# Time Zone Context
Higher-order component for consuming `timeZone` from a context provider.

## Usage
When using this component within the context of a `stripes-core`-powered platform, `stripes-core` creates a `<TimeZoneContext.Provider>`.

To wrap a component in a `<TimeZoneContext.Consumer>`, thus sending a `timeZone` prop to the component:
```
import withTimeZone from '@folio/stripes-components/lib/TimeZone';

function ExampleComponent({ timeZone }) => (
  <div>{timeZone}</div>
);

export default withTimeZone(ExampleComponent)
```

For examples, see [`<Datepicker>`](../Datepicker) and [`<Timepicker>`](../Timepicker).

If a component wrapped `withTimeZone` does not have a parent `<TimeZoneContext.Provider>`, it will receive the default value for the `timeZone` prop, `UTC`.

### More on React context
This is using the [context API](https://reactjs.org/docs/context.html) shipped with React 16.3.
