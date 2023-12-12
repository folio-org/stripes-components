# TextLink
A replacement for the native `<a>` and the react-router-dom `<TextLink>`-component with a11y friendly interaction styles.

## Usage
```js
import { TextLink } from '@folio/stripes/components';

<TextLink to="/users">
  I'm an internal link
</TextLink>

<TextLink target="_blank" rel="noopener noreferrer" href="https://folio.org">
  I'm an external link
</TextLink>

<TextLink to="/users" ref={yourRefCallback}>
  {({ className }) => (
    <span className={className}>
      I'm an internal link with custom styles
    </span>
  )}
</TextLink>
```

## Props
Name | Type | Description
-- | -- | --
children | node | The content of the component |
to | string | The path to a page. This renders the react-router-dom `<Link>`-component internally. |
href | string | The url for a web page. Renders a native `<a>`. Use the `to`-prop for routing. |

The remaining props are passed onto the root element of the component. This component also supports passing a `ref` and 
the ability to apply a root CSS class to the child element. Now, the TextLink component supports the object parameter 
`className` and applying a root CSS class to the child element. This change was made to ensure correct inheritance of styles, 
especially in cases where the children are inline elements with display: inline-flex, and the underline is not inherited.
