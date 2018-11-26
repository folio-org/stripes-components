# Keyboard Commands
With this system of components, module-wide key combinations can be specified in one place - at the top of a module and applied through a `<CommandList>` instance. Further within the component tree, `<HasCommand>` is used to apply handlers to the key combinations to suit the requirements and fulfill workflows for the module. These special components function as wrappers for core hotkey components, allowing for additional capabilities in discoverability to be built into the system. 
## CommandList
This is a top-level component that stores default shortcut configurations. This configuration is re-usable and can be used to set up interfaces for customizeable shortcuts.
### CommandList Props 
prop | type | description | required
-- | -- | -- | --
`commands` | array | Array of top-level command objects - commonly with only names, shortcuts, and labels. Shortcut keys that might be configurable or re-used throughout your application. | &#10004;
`children` | node, array of nodes | Rendered children | &#10004;
## HasCommand
Placed within the component tree to expose commands in a declarative way within the module.
### HasCommand Props 
prop | type | description | required
-- | -- | -- | --
`commands` | array | Array of command objects - commonly names and handlers - Shortcut keys that should be active within this component's children. | &#10004;
`children` | node, array of nodes | Rendered children | &#10004;
`scope` | DOMNode | Element that shortcut keys should delegate to. Defaults to the outer DOMNode of rendered children | 
`isWithinScope` | function | Function called at handle-time to see whether or not the handler should be executed. This, in combination with the `scope` prop can be used to expand the functionality of the component outside of its own children. | 

## Command shape
property | type | description 
-- | -- | --
`name` | string | Static identifier for the command within module code.
`shortcut` | string | Expresses the desired shortcut. ex `mod+s`.
`handler` | function | Callback that executes when the shortcut is pressed.
## Cross-platform keys
The `shortcut` property of command objects can account for the platform-specific modifiers via the `mod` substring. This will use the `command` key on MacOS and the `ctrl` key on other OS's.
## Example
### Step 1: base configuration.
Default commands can be kept in an exterior file for tidiness and re-use of the configuration.
This example configures four top-level commands and their corresponding shortcuts. These command names and their corresponding keys will be passed down for use within the body of the module. If you specify any *handler* keys here, the shortcuts will be active *anywhere in your module* after step 2.
```
// keyboardCommands.js
import React from 'react';

const commands = [
  {
    name: 'save',
    shortcut: 'mod+s',
  },
  {
    name: 'new',
    shortcut: 'alt+n',
  },
  {
    name: 'search',
    shortcut: 'mod+alt+h',
  },
  {
    name: 'edit',
    shortcut: 'mod+alt+e',
  }
];

export default commands;
```
### Step 2: apply configuration at the top of the module.
Next, in the module's index (or other top-level code) we use the command configuration by setting up an instance of `<CommandList>`.
```
// index.js

<CommandList
  commands={keyboardCommands}
>
{/* top level module things... routes, etc... */}
</CommandList>
```
### Step 3: apply the shortcuts within the module.
Next, the main UI of the app - the "search view"...
```
// searchView.js - view containing the search listing with the ability to create a new record.

// static commands defined as instance property.
constructor(props){
    super(props);
    ...
    this.keyCommands = [
    {
        name: 'search',
        handler: this.focusSearch
    },
    {
        name: 'new',
        handler: this.createNew
    }
    ];
    ...
    this.container = React.createRef();
}
<HasCommand commands={this.keyCommands}>
    <div ref={this.container}>
      {/* Search/listing/view components */}
      {/* Conditional render for a detail display... */}
      { detailView && (
          <Details containerRef={this.container}/>
        )
      }
    </div>
</HasCommand>
```
### Bonus Step: 'advanced' control
Workflows within your module may call for different shortcuts to be active at different times. The declaritive nature of `<HasCommand>` makes this possible. That conditional render in the previous step - say we want an 'edit' shortcut key to start working there, but we want to allow for keyboard focus to be anywhere within the module. (In other words, as long as a detail view is open, we can use keyboard shortcuts to shift to an edit mode.) Here's how.
```
// Details.js
this.detailKeyCommands = [
  {
    name: 'edit',
    handler: this.goToEdit,
  }
];

// this function is called at runtime to test whether the call should execute. This example tests the location of focus within the document, but other criteria could be used as well. By default, HasCommand will use its child contents to gauge whether or not a command should execute - but in this case, we want to expand that scope so that the command may be executed any time the detail view is visible.
checkScope() {
    const { containerRef } = this.props;
    return containerRef.current.contains(document.activeElement);
}
<HasCommand
commands={this.detailKeyCommands}
isWithinScope={this.checkScope}
scope={document.body}
>
{/* Detail contents */}
</HasCommand>
```
## Browser shortcuts.
If a known browser shortcut is supplied to `<CommandList>` it will deliver a warning via the browser's development console. Care must be taken in these situations - In most cases, the shortcut should be changed to something else. There are certain cases where keys can be overridden - `mod+s`, for example, is used by browsers to save the actual html page locally - but is a comfortable convention for users when saving a form. To avoid the browser's behavior, you must call `e.preventDefault()` within the shortcut's handler.
```
handleKeyboardSave(e) {
    e.preventDefault();
    executeSave();
}
```