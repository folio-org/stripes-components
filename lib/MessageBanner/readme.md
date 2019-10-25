# MessageBanner
Display a message to the user. The message banner has short and clear content with key information in bold.

```js
import { MessageBanner } from '@folio/stripes/components';

<MessageBanner>Default</MessageBanner>
<MessageBanner appearance="success">Success</MessageBanner>
<MessageBanner appearance="error">Error</MessageBanner>
<MessageBanner appearance="warning">Warning</MessageBanner>

// Dismissable MessageBanner
<MessageBanner 
  appearance="info" 
  dismissable
  onExit={() => console.log('Will exit now')}
  onExited={() => console.log('Has exited')}
>
  I'm dismissable
</MessageBanner>
```

## Controlled
Passing the `show`-prop makes it possible to control the visibility externally. This also enables enter/exit transitioning.

```js
const [show, setShow] = useState(false);

<Button onClick={() => setShow(!show)}>Toggle</Button>
<MessageBanner
  show={show}

  // Optional
  onEnter={() => console.log('Enter')}
  onEntered={() => console.log('Entered')}
  onExit={() => console.log('Exit')}
  onExited={() => console.log('Exited')}
>
  Hello World
</MessageBanner>
```

## Props
Name | Type | Description | Options | Default
-- | -- | -- | -- | --
appearance | string | Sets the style of the `<MessageBanner>` | default, error, success, warning | default
children | node | Renders the contents of the `<MessageBanner>` | |
dismissable | boolean | Adds a close icon and makes the `<MessageBanner>` dismissable | true/false | false
icon | string | Renders an icon next to the message. Supports all icons available for the [`<Icon>`](/?selectedKind=Icon)-component. When the `appearance`-prop is set to either "success", "error" and "warning" the `<MessageBanner>` will have icons by default but these too can be overwritten by using the `icon`-prop. If you want to remove the icon entirely you can simply set `icon` to `null` | |
onEnter | func | Callback when the `<MessageBanner>` enters | |
onEntered | func | Callback when the `<MessageBanner>` has entered | |
onExit | func | Callback when the `<MessageBanner>` exits | |
onExited | func | Callback when the `<MessageBanner>` has exited | |
className | string | Adds a custom class name for the `<MessageBanner>` | |
element | string, element, func | Changes the root element of the `<MessageBanner>` | | div |
show | boolean | Control the visiblity externally. Using the show-prop will enable the `<MessageBanner>` to transition in and out. | true/false | |


The rest of the props passed to `<MessageBanner>` will be spread onto the root element of the component. This component also accepts a `ref`.
