# ErrorModal

A basic error modal with props to support label (required) and content (required).

## Basic usage

```
// Show/hide handlers for the application.

showError() {
  this.setState({
    isOpen: true,
  });
}

hideError() {
  this.setState({
    isOpen: false,
  });
}

onClose() {
  this.hideError();
}

// ...in JSX...

<ErrorModal
  open={this.state.isOpen}
  label="Something went wrong"
  content="Here is a detailed message that explains why the error occurred."
  onClose={this.onClose}
/>
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
`aria-label` | string | Fills aria-label attribute for screen readers. Camel-case prop name `ariaLabel` is also supported |  |
`bodyTag` | string | String to set the HTML tag used to wrap the modal content | "div" |
`content` | node | Renderable content that displayed in the `<div>` tag by default |  | &#10004;
`label` | string | String displayed at the top of the modal as an H1 tag |  | &#10004;
`onClose` | func | Callback fired when the Close button is clicked |  | &#10004;
`open` | bool | Boolean reflecting modal's open/closed status |  | &#10004;
