# Redux Form Field
Higher-order component for making a component easy to use in a [Redux Form](https://redux-form.com/7.3.0/) [`Field`](https://redux-form.com/7.3.0/docs/api/field.md/).

When passing a component into the `component` prop of a `Field`, Redux Form will inject `input` and `meta` props.

When doing this:
```jsx
<Field name="myField" component={MyCustomInput} />
```
`MyCustomInput` will receive `input` and `meta` objects in its props;
`input` is mostly events, and `meta` is mostly computed properties of the form field.

## Usage
`reduxFormField()` will pass along the `input` props as-is. To normalize the `meta` props injected by Redux Form:
```jsx
function ExampleComponent({ value, onChange, warning, error }) => (
  <div>{warning}</div>
);

export default reduxFormField(
  ExampleComponent,
  ({ meta }) => ({
    warning: (meta.touched && meta.warning ? meta.warning : ''),
    error: (meta.touched && meta.error ? meta.error : '')
  })
);
```

For an example, see [`<Checkbox>`](../Checkbox).

## Props
Name | type | description | required
--- | --- | --- | ---
`WrappedComponent` | node | Component to `redux-form`-ify | Yes
`config` | function | If provided, will map logic from `props.input` and `props.meta` to props on the `WrappedComponent` | No

## Learning
- [React Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
- [Redux Form `Field`](https://redux-form.com/7.3.0/docs/api/field.md/#instance-api)
