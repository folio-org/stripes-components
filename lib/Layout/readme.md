# Layout
Helper component that allows for easily accessing a set of helper CSS classes. Useful for adjusting smaller parts of a UI without adding additional CSS.

## Basic Usage

### JSX
Apply any of the available class names to the `className` prop. Any additional custom class names will be combined with any matching helper classes.
```js
  import Layout from '@folio/stripes-components/lib/Layout';

  <Layout className="display-flex flex-align-items-start">
    <Layout element="span" className="padding-start-gutter">
      1st column
    </Layout>  
    <Layout element="span" className=`padding-end-gutter ${css.myCustomClass}`>
      2nd column
    </Layout>  
  </Layout>
```

### CSS
It's also possible to use helper classes in your CSS files by utilizing Post CSS's `composes` feature.

```css
  .myCustomClass {
    composes: display-flex flex-align-items-center from "@folio/stripes-components/lib/Layout/Layout.css";
  }
```

This will automatically apply the additional helper classes into your compiled HTML without adding additional CSS to the bundle.

Note: You can only use the `composes` feature on a single non-nested CSS selector. Read more about composition [here](https://github.com/css-modules/css-modules#composition).

## Props
Any valid React props can be applied to this component. Below are the props that vary from any default props.

Name | Type | Description | Default
-- | -- | -- | --
className | string | Applies any of the available matching helper classes as well as your own custom class names | undefined
element | string, element | Change the default root element of the rendered markup | div
