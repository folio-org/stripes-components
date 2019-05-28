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
| `bottomMargin0` | bool | | Default is `false`
| `cardClass` | string | |
| `cardStyle` | string | | Must be one of `default`, `lookupEmpty`, or `lookupPreview`
| `children` | node | Yes |
| `headerClass` | string | |
| `headerEnd` | node | Yes |
| `headerStart` | node | Yes |
| _rest_ | | | Other props will be applied to the top-level card `div`. |

