# PaneFooter
Renders pane footer at the bottom of the `<Pane>`-component containing a form.

### Basic (Default) Usage

The component itself only sets up the styling of the footer and the contents (`renderStart` and `renderEnd` props) are completely up to the developer.
```js
import { Pane, PaneFooter } from '@folio/stripes/components';

const footer = (
  <PaneFooter
    renderStart={<Button>Cancel</Button>}
    renderEnd={<Button>Save</Button>}
    className={css.paneFooterClass}
    innerClassName={css.paneFooterContentClass}
  />
);

<Pane footer={footer} ... >
  Pane Content
</Pane>
```

### Advanced (Customized) Usage

The component styling and content are completely up to the developer.
```js
import { Pane, PaneFooter, Button } from '@folio/stripes/components';

const footer = (
  <PaneFooter footerClass={css.paneFooter}>
    <div className={css.paneFooterContent}>
      <Button onClick={() => {...}}>
        Cancel
      </Button>
      <Button
        buttonStyle="primary"
        type="submit"
      >
        Save
      </Button>
    </div>
  </PaneFooter>
);

<Pane footer={footer} ... >
  Pane Content
</Pane>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
children | node |  |  |
className | string | Adds a className to the `PaneFooter`. Optional. |  |
innerClassName | string | Adds a className to the `PaneFooter` content. Optional. |  |
renderEnd | node |  |  |
renderStart | node |  |  |
