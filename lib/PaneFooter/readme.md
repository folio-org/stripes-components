# PaneFooter
Render pane footer at the bottom of the `<Pane>`-component containing a form.

### Usage
```js
import { Pane, PaneFooter, Button } from '@folio/stripes/components';

const footer = (
  <PaneFooter>
    <Button onClick={() => {...}}>
      Cancel
    </Button>
    <Button
      buttonStyle="primary"
      type="submit"
    >
      Save
    </Button>
  </PaneFooter>
);

<Pane footer={footer} ... >
  Pane Content
</Pane>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
children | | Set of `<Button>`s. |  |
