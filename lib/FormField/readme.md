# FormField
Higher-order component for making a component easy to use in a [Redux Form](https://github.com/erikras/redux-form) or [React Final Form](https://github.com/final-form/react-final-form) `<Field>`.

When passing a component into the `component` prop of a `Field`, React Final Form and Redux Form will inject `input` and `meta` props.

When doing this:
```
<Field name="myField" component={MyCustomInput} />
```
`MyCustomInput` will receive `input` and `meta` objects in its props;
`input` is mostly events, and `meta` is mostly computed properties of the form field.

## Usage
`formField()` will pass along the `input` props as-is. To normalize the `meta` props:
```
function ExampleComponent({ value, onChange, warning, error }) => (
  <div>{warning}</div>
);

export default formField(
  ExampleComponent,
  ({ meta }) => ({
    dirty: meta.dirty,
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
- [Redux Form `Field`](https://github.com/erikras/redux-form/blob/master/docs/api/Field.md)
- [React Final Form `Field`](https://github.com/final-form/react-final-form#fieldprops)
