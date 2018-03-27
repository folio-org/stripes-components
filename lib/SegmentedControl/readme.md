# Segmented Control
Creates a split button set that can be used for filters, tabs, and other subnavigation.

## Usage
`<SegmentedControl>` will accept one or more `<Button>` components as children. **Each child button should have its own unique `id` prop.**
```
import SegmentedControl from '@folio/stripes-components/lib/SegmentedControl';
// ...
/* define a handler for activation.
* It should accept an object containing an 'id' key.
* This will be equal to the 'id' prop of the clicked/selected button
* from the control.
*/

  handleActivate({id}) {
    this.setState({
      activeTab: id,
    });
  }

// ...
<SegmentedControl activeId={this.state.activeTab} onActivate={this.handleActivate}>
  <Button id="test">test</Button>
  <Button id="it">it</Button>
  <Button id="out">out</Button>
</SegmentedControl>
```

Additionally, each child `<Button>` can have its own `onClick` handler as well for handing other functionality.

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
tag | string | Set the HTML tag used to wrap the button set. | 'nav' |
className | string | Add a custom className to SegmentedControl | |
activeId | string | Which of the child `<Button>`s gets "active" styling |  |
onActivate | func | Handler called when a child `<Button>` is clicked |  |
children | node | Set of `<Button>`s. |  |
