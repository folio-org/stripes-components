# HotKeys
 Add keyboard shortcuts to FOLIO modules or even sub-sections of modules.

## Usage
#### Method 1: JSX component


```js
import { Hotkeys } from '@folio/stripes-components/lib/HotKeys';
//..
const keys = { 
  'delete' : ['delete','backspace'],
};

const handlers = {
  'delete': this.doDelete
};

<Hotkeys keymap={keys} handlers={handlers}>
  <Modal dismissible closeOnBackgroundClick open label="example">
    <button onClick={this.handleClose}>Close modal</button>
  </Modal>
</Hotkeys>
```

#### Method 2: High-Order Component
Components can be wrapped to give them the necessary props/functionality to respond to keyboard shortcuts.

```js
import { HotkeysHOC } from '@folio/stripes-components/lib/HotKeys';

class MyComponent extends React.Component {
  // typical component internals... constructor(), render(), etc.  
}

// wrap component with HOC...
export default HotkeysHOC(MyComponent);
```
You can then use the component as normal, supplying appropriate `keyMap` and `handlers` props.

```js
const keys = { 
  'delete' : ['delete','backspace'],
};

const handlers = {
  'delete': this.doDelete
};

<MyComponent keyMap={keys} handlers={handlers} />
```


### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
keyMap | object | Object of named hotkey sequences: e.g. { 'deletion': ['delete', 'backspace'], 'leftArrow': 'left' } | |
handlers | object | Object of hotkey sequence names with corresponding handler functions: e.g. { 'delete': this.doDelete }| |
tabIndex | string | value to apply as the html tabindex attribute. |'-1' |
 