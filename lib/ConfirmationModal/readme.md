# ConfirmationModal

A basic confirmation modal with props to support a heading (required) and brief message along with customizable 'cancel' and 'submit' action labeling.

## Basic usage

```
// Handlers for showing/hiding and submitting for application.

showConfirm() {
  this.setState({
    confirming: true,
  });
}

hideConfirm() {
  this.setState({
    confirming: false,
  });
}

handleSubmit() {
  this.hideConfirm();
}

// ...in JSX...

<ConfirmationModal
  open={this.state.confirming}
  heading="Please confirm!"
  message="Description of the thing that needs confirming"
  onConfirm={this.handleSubmit}
  onCancel={this.hideConfirm}
/>
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
heading | node | String to appear as the modal's H1 tag |  | &#10004;
message | node or array of nodes | Renderable content rendered within a `<p>` tag. |  |
open | bool | Boolean reflecting modal's open/closed status |  | &#10004;
cancelLabel | node | String to render on the Cancel action. | "Cancel" |
confirmLabel | node | String to render on the Submit action. | "Submit" |
buttonStyle | [button style](https://github.com/folio-org/stripes-components/tree/master/lib/Button#colors) | Style of the Submit action button. | `primary` |
cancelButtonStyle | [button style](https://github.com/folio-org/stripes-components/tree/master/lib/Button#colors) | Style of the Cancel action button. | `default` |
onConfirm | func | Callback fired when the Submit button is clicked |  | &#10004;
onCancel | func | Callback fired when the Cancel button is clicked |  | &#10004;
bodyTag | string | String to set the HTML tag used to wrap the modal message | "p" |
isConfirmButtonDisabled | bool | Boolean reflecting confirm button's enabled/disabled status | false |
