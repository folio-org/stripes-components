# ModalFooter
The default modal footer for the Modal-component.

### Usage
```js
import { Modal, ModalFooter, Button } from '@folio/stripes/components';

const footer = (
  <ModalFooter>
    <Button
      buttonStyle="primary"
      onClick={() => {...}}
    >
      Save
    </Button>
    <Button onClick={() => {...}}>
      Cancel
    </Button>
  </ModalFooter>
);

<Modal
  open={true}
  label="Modal with ModalFooter"
  footer={footer}
>
  Modal Content
</Modal>
```

Note the primary button is the first element in the example above, but the
`row-reverse` rule in this component's CSS reverses the display order. While
this may seem counterintuitive, it is not without reason: providing the primary
element first allows the default focus-handling in `<Modal>` to be very simple,
focusing on the first focusable element.

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
children | | Set of `<Button>`s. |  |
