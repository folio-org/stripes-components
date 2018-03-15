# KeyValue

Display key value with a label. Often used in combination with a grid to display relevant information about a certain content type - e.g. User Information.

## Basic Usage

```
import { KeyValue } from '@folio/stripes-components/lib/KeyValue';

<KeyValue
  label="Some label"
  value="Some value"
/>
```

The "value" can also be a node, passed as children. This version is useful for acceptance testing.
```
<KeyValue label="Some label">
  <span data-test-id="my-test-string">Some node</span>
</KeyValue>
```

If the `value` prop is set and children exist, the `value` prop is ignored.
