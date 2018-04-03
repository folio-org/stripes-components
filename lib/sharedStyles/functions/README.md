## PostCSS functions

`storybook` and `stripes-core` will scan this directory for functions that can be used in CSS.

Plugin used: [`postcss-functions`](https://github.com/andyjansson/postcss-functions)

Example:
```
// foo.js
module.exports = function foo() {
  return 'bar';
};
```

```
// MyComponent.css
.myComponent {
  color: foo();
}
```

```
// outputted CSS
.myComponent {
  color: 'bar';
}
```
