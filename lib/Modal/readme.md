# Modal
Basic component for rendering a modal pop-up.
### Usage

```js
import Modal from '@folio/stripes-components/lib/Modal';
//..
<Modal dismissible closeOnBackgroundClick open label="example">
  <button onClick={this.handleClose}>Close modal</button>
</Modal>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
label | string | Descriptive title for top of modal - also fills aria-label attribute for screen readers. | | &#10004;
id | string | Used in the "id" attribute of the modal div. | |
onClose | func | Callback that signals intent to close window. This callback does not actually close the modal, but can call code within its body that will change the boolean passed to the `open` prop. | |
onOpen | func | Callback fired when modal opens. | noop |
open | bool | Deciding value for rendering the modal(true) or not(false). | false | &#10004;
scope | string | Parent element for modal. Defaults to 'module' which keeps the main navigation visible. A value of 'root' covers the entire view. | 'module' | 
closeOnBackgroundClick | bool | Modal can be dismissed by clicking the background overlay. | false |
dismissible | bool | If true, renders a close 'X' in the starting corner of the modal. | false |
children | node | Content for the body of the modal. | | &#10004;
