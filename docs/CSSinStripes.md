# CSS and Styling within Stripes-Components
The goal of built-in styles applied via component props is to take the concern of aesthetics and css syntax away from module developers - empowering them to develop beautiful modules with very little effort outside of their logical code.
Stripes components have built-in styles using [CSS-modules](https://github.com/css-modules/css-modules/blob/master/README.md). This provides scoping of CSS classes for stripes components and leaves the namespace open for the styles of new components.
We also make use of [PostCSS](https://github.com/postcss/postcss) and a few of its plug-ins to allow use of modern and upcoming css syntax.

## Conventions
* Rely primarily on class selectors. Avoid using ID and tagname selectors to assign styles.
* Minimize use of `!important`. Use it only when there are no other overrides available.
* Use camelCase for class-names.
* Choose meaningful classnames that relate to the role of elements being styled, not to how they will appear -- i.e. prefer `errorMessage` over `boldRed`.
* Primary aesthetic styles should use a separate .css file - limit usage of inline styles to keep styling concerns separate from component source.
* Rely on layout components [`<LayoutGrid>`](../lib/LayoutGrid) and `<Layout>` for page/module layout needs rather than using custom styles to do so.
* [The `classnames` library](https://github.com/JedWatson/classnames) can be used to dynamically assign css classes based on props. It is preferred over other methods.
* Stylesheets should contain styles for only a single component.
* Primary component .css files should carry the same file name as their corresponding component's .js file.

### CSS-Modules
CSS files can be written as normal. For class-naming, camelCase is recommended, but not enforced. These files should live in the same directory as the component's .js file.
```
/* ComponentName.css */
.className {
  color: #090;
}
```
Then in your component's .js...
```
// import the stylesheet, including the '.css' file extension in the statement.
import css from './ComponentName.css';

// Later in the JSX...
// apply your CSS classes via dot-syntax
<div className={css.className}> Styled Content </div>
```
When the element is inspected in the browser, you can see that the CSS class is given a randomly generated suffix.
```
<div class="className--14b75"> Styled Content </div>
```

### PostCSS
We use PostCSS to allow CSS to be written using an easy syntax that meets the upcoming CSS4 spec. Here are some syntax examples of the features we make use of:
#### Nesting
```
.parentClass {
  &.specificityClass { ... }
  &:pseudoSelector { ... }
  & .childClass { ... }
  &>.directDescendant { ... }
}
```
#### Color Manipulation
You can see a list of available [color functions](https://github.com/postcss/postcss-color-function/blob/master/README.md#list-of-color-adjuster), e.g.
```
.darkerBG {
  background-color: color(#fff shade(8%))
}
```
#### CSS Variables
```
/* Conforming to spec, these *must* be declared on root */
:root {
  --primary: #106c9e;
}

/* the second parameter is a fallback in case the variable isn't present */
.primaryButton {
  background-color: var(--primary, #106c9e);
}
```
For consistency, there is a [shared set](../lib/variables.css) of established CSS variables/values.
It is subject to change.

### Media Queries
`stripes-components` provides [pre-set breakpoints](../lib/variables.css) that you can use to adjust styles at different browser window widths.
```
@media (--medium-up) {
  .button {
    height: 2em;
  }
}
```

Use `min-width` breakpoints like `--small-up`, `--medium-up`, and `--large-up` when possible. There are `max-width` breakpoints available, but the cases for their use should be rare. Leaning on `min-width` promotes a mobile-first CSS workflow, where the narrowest screen size is the default. Layout can gradually be added as the width increases.

This:
```
x ≥ 321px, x ≥ 641px, x ≥ 1025px, x ≥ 1441px
```
is easier to debug and reason about than this:
```
x ≤ 640px, 641px ≤ x ≤ 1024px, 1025px ≤ x < 1440px, x ≥ 1441px
```
