# Card

Renders a card with a header and body content. Different styles can be applied using a combination of the `cardStyle` and `roundedBorder` props. Classes can be applied using the various classname props.

## Basic Usage

The component itself only sets up the styling of the card and the contents are completely up to the user. E.g.,
```js
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

## Common Patterns

A few patterns for using cards are common in FOLIO. Here are how they would be implemented.

### Repeating Card

Generally used in forms for objects in an array:

```js
items.map(item => <Card headerStart={item.name}>/* some form fields */</Card>);
```

### Remote Resource Lookup

Some apps can link their resources to resources provided by other apps. When adding a remote resource, an empty card is first shown with a call to action. It's styling could be accomplished like in the following example for a remote Organization resource.

```js
<Card
  cardStyle="negative"
  headerStart="Organization"
  headerEnd={<Button onClick={addOrg()}>Add organization</Button>}
  roundedBorder
>
  <Layout className="textCentered">No organization added</Layout>
</Card>
```

After a resource is selected, it's information is shown in a slightly differently-styled card. To continue the mock example of an organization:

```js
<Card
  cardStyle="positive"
  headerStart={org.name}
  headerEnd={<Button onClick={unlinkOrg()}>Unlink organization</Button>}
  roundedBorder
>
  <OrganizationPreview org={org} />
</Card>
```


## Props

| Name | Type | Required | Note |
--- | --- | --- | --- |
| `bodyClass` | string | |
| `cardClass` | string | |
| `cardStyle` | string | | Must be undefined or one of `default`, `negative`, or `positive`. These generally affect the background of the card.
| `children` | node | Yes |
| `headerClass` | string | |
| `headerComponent` | node, string, func | DefaultCardHeader | Pass a React Component (or node-type name) to fully customize the rendering of the header.
| `headerEnd` | node, string | |
| `headerProps` | object | | Props to pass to the header and destructure upon the element/component.
| `headerStart` | node, string | Yes |
| `marginBottom0` | bool | Remove bottom margin |
| `roundedBorder` | bool | | Apply a border-radius to the card for rounded borders.
| _rest_ | | | Other props will be applied to the top-level card `div`. |

