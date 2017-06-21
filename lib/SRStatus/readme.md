# SRStatus
A component for providing messages to assistive screen readers.
It works via a `<div>` with attributes `aria-live="assertive"`. This will have screen readers announce any textual additions to the content of the div through the speakers/headphones.
This component is ideal for when React's frequent updates/re-renders do not suit the typical usage of `aria-live` divs (a great amount of repetition can result).

## Usage
SRStatus works via a method call against a ref to an instance of it.

```
import SRStatus from '@folio/stripes-components/lib/SRStatus';

// in constructor
this.srsRef = null;

// component methods/callbacks

someCallback() {
  // call the sendMessage method on the component.
  this.srsRef.sendMessage('hello user!');
}

// in render()
<SRStatus ref={(ref)=>{this.srsRef = ref;}} />

// of course, be sure to use the callback somewhere in your JSX.
<Button type="button" onClick={this.someCallback}> Hear Message </Button>

```
