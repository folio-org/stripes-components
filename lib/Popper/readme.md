# Popper

Popper relies on the 3rd party library (Popper.js) for perfect positioning.
Is a component with basic mechanism for another components with popups.


## Usage
Create a component which will control an "open" state of the overlay. Pass anchor element through renderTrigger prop and overlay as children.

```
import { Popper } from '@folio/stripes/components';
<Popper
  isOpen={isOpen}
  anchorRef={anchorRef}
>
  <div>Overlay</div>
</Popper>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
isOpen | boolean | Responsible for displaying of the overlay component | | |
onUpdate | function | Callback to be called on every change of the PopperJS instance. Returns all data set of the instance. 
placement | string | Overlay placement. Available values: `top`, `bottom`, `left`, `right`. Each placement can have a variation: `-start`, `-end`. E.g. `top-start`, `left-start`. | `bottom` | |
portal | node | When is provided, overlay renders inside provided portal. | | |
anchorRef | object | Reference to anchor element |  | yes |
children | component | Component to be passed as an overlay |  | yes |
modifiers | object | A set of modifications for extending popper functionality. For more details, please, go to https://popper.js.org/popper-documentation.html#modifiers. | | |
