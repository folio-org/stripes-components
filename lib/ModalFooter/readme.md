# ModalFooter
The default modal footer for the Modal-component.

### Usage
```js
import Modal from '@folio/stripes-components/lib/Modal';
import ModalFooter from '@folio/stripes-components/lib/ModalFooter';

const footer = (
  <ModalFooter
    primaryButton={{
      label: 'Save',
      onClick={() => {...}}
    }}
    secondaryButton={{
      label: 'Cancel',
      onClick={() => {...}}
    }}
  />
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
primaryButton | object | Props for the primary button. In addition to the "label"-key it will accept all available [`<Button>`](/?selectedKind=Button) props. | undefined | false
secondaryButton | object | Props for the secondary button. In addition to the "label"-key it will accept all available [`<Button>`](/?selectedKind=Button) props. | undefined | false
