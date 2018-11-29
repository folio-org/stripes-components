# Accordion

Make parts of the UI collapsible using this component.

## Basic Usage

```
import { AccordionSet, Accordion } from '@folio/stripes/components';

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
`label` is the only required prop. `label` represents the visual heading for the modal - it can be a string, an html tag or a component.

## AccordionSets
The `<AccordionSet>` sets up keyboard navigation and conveniently controls state of its wrapped collection of accordions if no `accordionStatus` prop is provided.
`<Accordion>`s don't have to be direct children of an `<AccordionSet>` since they register themselves via context passed down from the set. Component hierarchies like this will work fine:
```
<AccordionSet>
  <IfInterface>
    <AccountAccordion /> // <Accordion> is rendered within.
  </IfInterface>
</AccordionSet>
```
## Keyboard Navigation
Keyboard support comes packaged with use of the `<AccordionSet>`. The keys are active when an accordion header is in focus. Bindings are as follows:
| key | function |
| -- | -- |
`up` | Navigate to the previous accordion header. If the first accordion header is focused, the focus will jump to the last accordion. |
`down` | Navigate to the next accordion header. If the last accordion header is focused, the focus will jump to the first accordion. |
`home` | Navigate to the first accordion in the set. |
`end` | Navigate to the last accordion in the set. |

## Controlled
Accordions can, of course, be controlled by state or local resource. Simply include an object with a list of keys for each accordion's `id` set to a boolean value that will be passed through to the corresponding accordion's `open` prop. This object should be passed to the `<AccordionSet>`'s `accordionStatus` prop. An `onToggle` handler will also need to be provided for proper state interaction. Passed to the `<AccordionSet>`'s `onToggle` prop, it will receive both the label and id of the target accordion, either of which could be used for additional interactions as needed.

```
import { AccordionSet, Accordion } from '@folio/stripes/components';

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
    let newState = _.cloneDeep(curState); // remember to safely copy state! using lodash's cloneDeep() for example.
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

## Rendering Summary Items and Actions in the Header.
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

## Accordion Props

Name | type | description | default | required
--- | --- | --- | --- | ---
label | string, element | visible header label | | true
open | bool | open or closed | true |
closedByDefault | bool | Use to collapse the Accordion by default. Ensure that you use it only when the Accordion is not being controlled by an `open` prop | false |
id | string | unique ID to track accordion state | |
displayWhenOpen | element | content to display in header when Accordion is in the open state | |
displayWhenClosed | element | content to display in header when Accordion is in the closed state | |
onToggle | func | callback for toggling the accordion open/closed | |
header | node, func | used to render a custom accordion header | |
contentRef | func | reference function for accessing the accordion content's DOM element. | |
children | node, array of nodes | content of the accordion | |
autoFocus | bool | If this prop is `true`, Accordion toggle/label will automatically focus on mount | |

## Expand or Collapse All
The `<ExpandAllButton>` component can be added to a stack of controlled accordions to provide a helper for performing collapse/expansions of the full stack all at once. The `onToggle` prop for `<ExpandAllButton>` takes a callback using the accordionStatus object that can be used to update the application's state.

```
// handler for ExpandAll...
  handleExpandAll(newAccordionStatus) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = newAccordionStatus; // substitute 'accordions' with your designated status object's name.
      return newState;
    });
  }

// in JSX
  <ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} />
```
