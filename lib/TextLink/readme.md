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
```

## Props
Name | Type | Description
-- | -- | --
children | node | The content of the component |
to | string | The path to a page. This renders the react-router-dom `<Link>`-component internally. |
href | string | The url for a web page. Renders a native `<a>`. Use the `to`-prop for routing. |

The remaining props are passed onto the root element of the component. This component also supports passing a `ref`.
