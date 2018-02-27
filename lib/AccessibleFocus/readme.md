# AccessibleFocus

A universal hover, focus, and active style helper component.

## Purpose
To have an easy way of adding the necessary styles for interactive elements without much configuration.

The main benefits are:
- Uniform interaction styling that is clearly visible when hovering or tabbing through interactive elements such as buttons, links etc.
- One single source of styling which makes changes easier and at a later point can be updated via. CSS variables for custom styles for each tenant or even a single user.

## How to use it
The `AccessibleFocus`-component can be used in several ways depending on which element should receive styling.

## 1. Replacement element
Use `AccessibleFocus` as a replacement element for another element - such as a button- or anchor-element.

```js
<AccessibleFocus component="button" id="my-button" aria-label="My button">
  <span>My button</span>
</AccessibleFocus>
```

Which simply renders:
```
<button id="my-button" aria-label="My button">
  <span>My Button</span>
</button>
```

## 2. Inner element
