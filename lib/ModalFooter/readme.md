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

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
children | | Set of `<Button>`s. |  |
buttonsAlignReverse | bool | Reverse the button alignment | false |