# Headline
Renders headlines in different sizes and with different tags, margins and styles depending on props.

### Basic Usage
```
  import { Headline } from '@folio/stripes/components';

  <Headline size="large" margin="medium" tag="h3">
    My headline
  </Headline>
```

### Props
Name | Type | Description | Options | Default
--- | --- | --- | --- | ---
children | node | The label of the headline | | |
size | string | The size of the headline | xx-small, x-small, small, medium, large, x-large, xx-large | medium
margin | string | The bottom margin of the component. Automatically matches the size-prop. | xx-small, x-small, small, medium, large, x-large, xx-large, none | medium
tag | string | The tag of the headline | h1, h2, h3, h4, h5, h6, p, div, legend | div
faded | boolean | Adds faded style to headline (gray color) | true/false | false
weight | string | Changes the font-weight of the `<Headline>` | regular, medium, bold, black | bold
block | boolean | If the headline should have `display: block` applied | true/false | false
flex | boolean | If the headline should have `display: flex` applied | true/false | false
className | string | Any custom class(es) which should be added to the Headline | | `""`
