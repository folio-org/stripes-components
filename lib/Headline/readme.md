# Headline
Renders headlines in different sizes and with different tags, margins and styles depending on props.

### Basic Usage
```
  import Headline from '@folio/stripes-components/lib/Headline';

  <Headline size="large" margin="medium" tag="h3">
    My headline
  </Headline>
```

### Props
Name | Type | Description | Options | Default
--- | --- | --- | --- | ---
children | node | Alternative way to set the label of the headline | | |
size | string | The size of the headline | xx-small, x-small, small, medium, large, x-large, xx-large | medium
margin | string | The bottom margin of the component. Automatically matches the size-prop. | xx-small, x-small, small, medium, large, x-large, xx-large, none | medium
tag | string | The tag of the headline | h1, h2, h3, h4, h5, h6, p, div, legend | div
faded | boolean | Adds faded style to headline (gray color) | true/false | false
bold | boolean | Adds bold style to headline | true/false | true
