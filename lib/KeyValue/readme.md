# KeyValue

Display key value with a label. Often used in combination with a grid to display relevant information about a certain content type - e.g. User Information.

## Basic Usage

```
import { KeyValue } from '@folio/stripes/components';

<KeyValue
  label="Some label"
  value="Some value"
  subValue="Some sub value"
/>
```

The "value" can also be a node, passed as children. This version is useful for acceptance testing.
```
<KeyValue label="Some label">
  <span data-test-id="my-test-string">Some node</span>
</KeyValue>
```

If the `value` prop is set and children exist, the `value` prop is ignored.

## Props
Name | Type | Description
-- | -- | --
children | node | Renders the value of the component if no value-prop is provided
label | node | Renders the label of the component
subValue | node | Renders a sub below the value
value | node | Renders the value of the component
