# Card

Renders a card with a header and body content. Different styles can be selected using the `cardStyle` prop.

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
</Card>ma
```

## `cardStyle`

The `default` card style is selected automatically. Optionally, you can set the `cardStyle` prop to `lookupPreview` and `lookupEmpty` for easy application of the styles required for a remote resource lookup pattern.

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

