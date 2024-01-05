# TextLink
A replacement for the native `<a>` and the react-router-dom `<TextLink>`-component with a11y friendly interaction styles.

## Usage
```jsx
<TextLink to="/users">
  I am an internal link
</TextLink>
```

```jsx
<TextLink target="_blank" rel="noopener noreferrer" href="https://folio.org">
  I am an external link
</TextLink>
```

```jsx
<TextLink element="button" onClick={() => doSomething()}>
  I am a button element!
</TextLink>
```

## Props
Name | Type | Description
-- | -- | --
children | node, func | The content of the component.  Function form takes the root className as an argument; see below
className | string | Adds a class name to the component
element | string, func | Uses a custom element via tag name or component
to | string | The path to a page. This renders the react-router-dom `<Link>`-component internally.
href | string | The url for a web page. Renders a native `<a>`. Use the `to`-prop for routing.

Additional props are passed onto the root element of the component. This component also supports passing a `ref` and 
the ability to apply a root CSS class to the child element.

To pass the root CSS class to the child element, pass a render function as the child. This change was made to ensure correct
inheritance of styles,  especially in cases where the children are inline elements with `display: inline-flex`, and the
underline is not inherited.
```jsx
// In the case that direct style application is required, a child function can be used.
<TextLink to="/users" ref={yourRefCallback}>
  {({ className }) => (
    <span className={className}>
      I am an internal link with custom styles
    </span>
  )}
</TextLink>
```
