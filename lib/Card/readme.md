# Card

Renders a card with a header and body content. Different styles can be applied using a combination of the `cardStyle`, `hasMargin` and `roundedBorder` props. Classes can be applied using the various classname props.

## Basic Usage

The component itself only sets up the styling of the card and the contents are completely up to the user. E.g.,
```
<Card
  id="my-card"
  headerClass="my-card-header"
  headerEnd={<Button>Click Me!</Button>}
  headerStart={<span className="my-card-header">My Header</span>}
>
  <div>This is my card body content!</div>
</Card>
```

## Styling

Cards are used throughout FOLIO in a variety of styles. These styles can be achieved by applying a set of props to the `Card` component.

### `cardStyle`

The `cardStyle` prop changes the background colors of the card and header (assuming no custom `headerComponent` is used). A `default` style is used if the prop is not provided which is useful for repeating card layouts. `"positive"` and `"negative"` may be passed as the prop value to change the coloring to use FOLIO defaults for different background colors. Because colors could be inverted (a dark mode) or changed altogether, it's difficult to talk in terms of "light" or "dark" foregrounds, but a `positive`-ly colored background will match the default FOLIO background, while a `negative` background will be a contrasting color. Both should still support default, dark text rendered onto them.

## Props

| Name | Type | Required | Note |
--- | --- | --- | --- |
| `bodyClass` | string | |
| `cardClass` | string | |
| `cardStyle` | string | | Must be undefined or one of `default`, `negative`, or `positive`. These generally affect the background of the card.
| `children` | node | Yes |
| `hasMargin` | bool | | Turns on a `margin-bottom` for spacing.
| `headerClass` | string | |
| `headerComponent` | node, string, func | DefaultCardHeader | Pass a React Component (or node-type name) to fully customize the rendering of the header.
| `headerEnd` | node, string | Yes |
| `headerProps` | object | | Props to pass to the header and destructure upon the element/component.
| `headerStart` | node, string | Yes |
| `roundedBorder` | bool | | Apply a border-radius to the card for rounded borders.
| _rest_ | | | Other props will be applied to the top-level card `div`. |

