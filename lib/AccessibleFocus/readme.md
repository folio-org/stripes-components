# AccessibleFocus

A universal hover, focus, and active style helper component.

## Purpose
To have an easy way of adding the necessary styles for interactive elements without much configuration.

The main benefits are:
- Uniform interaction styling that is clearly visible when hovering or tabbing through interactive elements such as buttons, links etc.
- Styles can be updated by the user to match their needs - e.g. visually impaired people is able to turn up the contrast (coming in the future)

**Note:** This helper is already implemented in all stripes-components that requires active-, focus- and hover-styling so you don't need to apply it manually.

## How to use it
The `AccessibleFocus`-component can be used in several ways depending on which element should receive styling.

### 1. Replacement element
Use `AccessibleFocus` as a replacement element for another element - such as a button- or anchor-element. Supply a string to the `component`-prop to render a simple element.

```js
<AccessibleFocus component="button" id="my-button" aria-label="My button">
  <span>My button</span>
</AccessibleFocus>
```

You can also provide a component to the `component`-prop. Just make sure to spread the props.

**Note:** This is useful if you want to use react-router `<Link>` or similar components.

```js
const MyButton = ({children, ...rest}) => <button {...rest}>{children}</button>;

<AccessibleFocus component={MyButton}>
  <span>My button</span>
</AccessibleFocus>
```

### 2. Inner element
In some cases you want the inner element to be focused while still having a large clickable/focusable area for the user.

In these cases you can use the `AccessibleFocus`-component as an inner element.

```js
<button style={{ height: '100px', width: '100px' }}>
  <AccessibleFocus>
    <span>
      My Button
    </span>
  </AccessibleFocus>
</button>
```

## Modifiers
The component comes with a variety of modifier props that allows you to customise styles to fit your needs.

### Focus Dot
The dot provides, in addition to the styled box, a very clear and 100%-contrast interface element which can easily be recognised even on things that already stand out in some other way through their styling.

You can update it's appearance by changing the following props:
- **focusDotOffset** (Updates the offset of the dot - values are small, medium and large)
- **focusDotPosition** (Changes the position of the dot - values are start, end, top, bottom)

```js
<AccessibleFocus component="button" focusDot focusDotOffset="small" focusDotPosition="end">
  <span>My Button</span>
</AccessibleFocus>
```

### Box Offset
Change the offset of the box that's visible on hover, focus and active. See examples of this above.

You can control each side by using **boxOffsetStart**, **boxOffsetEnd**, **boxOffsetTop** & **boxOffsetBottom**. If you want to have equal offset on all sides you can simply use **boxOffset**.

The values are small, medium and large.

```js
<AccessibleFocus component="button" boxOffsetStart="large" boxOffsetEnd="small">
  <span>My Button</span>
</AccessibleFocus>
```

## Requirements
AccessibleFocus uses CSS pseudo elements **:before** and **:after** to apply styling on hover, active and focus in a combination with z-index values on parent and child elements.

For the component to work properly you need to have a child element wrapping your content.

```js
// Incorrect
<AccessibleFocus>
  My Button
</AccessibleFocus>
```

```js
// Correct
<AccessibleFocus>
  <span>
    My Button
  </span>
</AccessibleFocus>
```

However you can use the prop `wrap` to wrap the content in a span like so:
```js
<AccessibleFocus wrap>
  My Button
</AccessibleFocus>
```

If you have multiple child elements it can be useful to add the `flex` prop which adds flex styling to `AccessibleFocus`.
```js
<AccessibleFocus flex>
  <div>My label</div>
  <div>My other label</div>
</AccessibleFocus>
```

## Props
Below are the props that are specific for `AccessibleFocus`. Other props you might supply is spread automatically.

Name | Type | Description | Options | Default | Required
--- | --- | --- | --- | ---
component | string, function | Determines what should be rendered | | span | ✅
children | element | The children of the component | | |  ✅
className | string | Add your custom classes | | |
wrap | boolean | Wraps the children in a span | true/false | false |
flex | boolean | Adds display: flex; to the component. Useful if you have multiple child elements | true/false | false |
focusDot | boolean | Adds the focus dot to the component | true/false | false |
focusDotPosition | string | Changes the position of the focus dot | start, end, top, bottom | start |
focusDotOffset | string | Changes the offset of the focus dot | small, medium, large | undefined |
boxOffset | string | Changes the box offset on all sides | small, medium, large | undefined |
boxOffsetStart | string | Changes the box offset on the left | small, medium, large | undefined |
boxOffsetEnd | string | Changes the box offset on the right | small, medium, large | undefined |
boxOffsetTop | string | Changes the box offset on the top | small, medium, large | undefined |
boxOffsetBottom | string | Changes the box offset on the bottom | small, medium, large | undefined |
