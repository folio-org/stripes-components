# SRStatus
A component for providing messages to assistive screen readers.
It works via a `<div>` with attributes `aria-live="assertive"`. This will have screen readers announce any textual additions to the content of the div through the speakers/headphones.
This component is ideal for when React's frequent updates/re-renders do not suit the typical usage of `aria-live` divs (a great amount of repetition can result).

## Usage
SRStatus works via a method call against a ref to an instance of it.

```
import { SRStatus } from '@folio/stripes/components';

// set up a ref
this.srsRef = React.createRef(null)

// component methods/callbacks
someCallback() {
  // call the sendMessage method on the component.
  this.srsRef.current.sendMessage('hello user!');
}

// in render()
<SRStatus ref={this.srsRef} />

// of course, be sure to use the callback somewhere in your JSX.
<Button type="button" onClick={this.someCallback}> Hear Message </Button>

```

# Props
Name | Type | Description | Options | Default
-- | -- | -- | -- | --
ariaLive | string | Sets the aria-live attribute for the live region. This is used to set the priority with which screen reader should treat updates to live regions. | assertive, polite, off | assertive
message | string | Pass a message that will be read out by the screen reader. This is an alternative to using the `sendMessage`-method. | |
ref | func | Passing a ref for `<SRStatus>` allows for accessing the `sendMessage`-method as shown in the example above. | |
