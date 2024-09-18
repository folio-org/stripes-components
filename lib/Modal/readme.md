# Modal
Basic component for rendering a modal pop-up.
### Usage

```js
import { Button, Modal } from '@folio/stripes/components';

// Add a footer to the modal (optional)
const footer = (
  <Fragment>
    <Button buttonStyle="primary" marginBottom0>Save</Button>
  </Fragment>
);

<Modal dismissible closeOnBackgroundClick open label="example" footer={footer}>
  <button onClick={this.handleClose}>Close modal</button>
</Modal>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`aria-label` | string | Fills aria-label attribute for screen readers. Camel-case propname `ariaLabel` is also supported.| |
`children` | node | Content for the body of the modal. | | &#10004;
`closeOnBackgroundClick` | bool | Modal can be dismissed by clicking the background overlay. | false |
`contentClass` | string | Apply custom CSS classes to the content element | |
`dismissible` | bool | If true, renders a close 'X' in the starting corner of the modal. | false |
`enforceFocus` | bool | If true, automatically attempts to regain focus when its children are clicked.  | true |
`footer` | node | Footer content of the modal. Pass a single component or multiple components wrapped in a Fragment. | |
`id` | string | Used in the "id" attribute of the modal div. | |
`label` | string | Descriptive title for top of modal. | | &#10004;
`onClose` | func | Callback that signals intent to close window. This callback does not actually close the modal, but can call code within its body that will change the boolean passed to the `open` prop. | |
`onOpen` | func | Callback fired when modal opens. | noop |
`open` | bool | Deciding value for rendering the modal(true) or not(false). | false | &#10004;
`restoreFocus` | bool | If true, the modal will restore focus to previously focused element once modal is hidden. | true |
`scope` | string | Parent element for modal. Defaults to 'module' which keeps the main navigation visible. A value of 'root' covers the entire view. | 'module' |
`size` | string | `small` `medium` or `large` - sets the max-width of the window to `550px`, `750px`, `1100px`, respectively | 'medium' |
`wrappingElement` | string | Change the HTML-tag of the wrapping element. Useful if the modal is a form. | |

### Focus management
By default, the modal will focus its first internally focusable element, falling back to the outer element if necessary. While modals are opened, keyboard focus is trapped to the conent of the modal.

### Assistive technology
Modals are rendered as `[role=dialog]` elements, conforming to accessibility standards. Additionally, they implement screen-reader trapping by applying the `inert` HTML attribute to main elements within the FOLIO UI so that a screen reader can only announce the contents of the modal.

```
// basic handler function
const focusFooterPrimary = ref => ref.current.focus();

const ConfirmationModal = () => {
  // Initialize ref to footer button.
  const footerPrimary = useRef(null);

  // Set up confirmation footer, applying the ref to the button we want focus to move to.
  const footer = (
    <ModalFooter>
      <Button
        ...
        ref={footerPrimary}
      >
        {confirmLabel}
      </Button>
    </ModalFooter>
  );

  // Apply the focusFooterPrimary function in the Modal declaration.
  return(
    <Modal
      ...
      onOpen={() => { focusFooterPrimary(footerPrimary); }}
      footer={footer}
    >
  );
}

```