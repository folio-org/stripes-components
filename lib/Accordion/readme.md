# Accordion

Make parts of the UI collapsible using this component.

## Basic Usage

```
import { AccordionSet, Accordion } from '@folio/stripes-components/lib/Accordion';

...
<AccordionSet>
  <Accordion label="Example Accordion" id="ex-1">
    <p>Accordion content!</p>
  </Accordion>
  <Accordion label="Acc #2" id="ex-2">
    <p>Accordion content!</p>
  </Accordion>
</AccordionSet>
```
`id` and `label` are both required props. `label` represents the visual heading for the modal - it can be a string, and html tag or a component. It will be part of the clickable area for expanding/contracting the content.

## Controlled
Accordions can, of course, be controlled by state or local resource. Simply include an object with a list of keys for each accordion's `id` set to a boolean value that will be passed through to the corresponding accordion's `open` prop. This object should passed to the `<AccordionSet>`'s `accordionStatus` prop. An `onToggle` handler will also need to be provided for proper state interaction. Passed to the `<AccordionSet>`'s `onToggle` prop, it will receive both the label and id of the target accordion- either of which could be used for additional interactions as needed.

```
import { AccordionSet, Accordion } from '@folio/stripes-components/lib/Accordion';

... // state or manifest/local resource.

this.state = {
  accordions: {
    'ex-1': true,
    'ex-2': false,
  }
}

... // Toggle handler

onToggleSection({label, id}) {
  this.setState((curState) =>{
    let newState = curState;
    newState.detailAccordions[id] = !curState.detailAccordions[id];
    return newState
  });
}

... // include in the jsx: 

<AccordionSet accordionStatus={this.state.accordions} onToggle={this.onToggleSection}>
  <Accordion label="Example Accordion" id="ex-1">
    <p>Accordion content!</p>
  </Accordion>
  <Accordion label="Acc #2" id="ex-2">
    <p>Accordion content!</p>
  </Accordion>
</AccordionSet>
```

## Summary Items and Actions.
`<Accordion>` provides two additional props: `displayWhenOpen` and `displayWhenClosed` that are used to place content in the accordion header at various states. An example of this would be summary information rendered in the `displayWhenClosed` prop, and `<Button>`'s rendered in the `displayWhenOpen` prop.
```
<AccordionSet>
  <Accordion 
    label="Example Accordion" 
    id="ex-1"
    displayWhenClosed={<em>3 items</em>}
    displayWhenOpen={<Button>Add item</Button>}
  >
    <ul>
      <li>All</li>
      <li>The</li>
      <li>Items!</li>
    </ul>
  </Accordion>
</AccordionSet>
```

## Custom Headers
The default header suits many cases, but if it is not adequate, a custom header can be provided via `<Accordion>`'s `header` prop. A custom header component should take `ContentId` prop in order to appropriately apply aria-attributes to the custom header. Any props passed to `<Accordion>` will also be passed to its `header` component.

## Props

Name | type | description | default | required
--- | --- | --- | --- | ---
label | string, element | visible header label | | true
open | bool | open or closed | true |
id | string | unique ID to track accordion state | | true
displayWhenOpen | element | content to display in header when Accordion is in the open state | | 
displayWhenClosed | element | content to display in header when Accordion is in the closed state | | 
onToggle | func | callback for toggling the accordion open/closed | | 
header | node, func | used to render a custom accordion header | | 
contentRef | func | reference fuction for accessing the accordion content's DOM element. | | 
children | node, array of nodes | content of the accordion | | true
