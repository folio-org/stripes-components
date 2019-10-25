# MessageBanner
Renders a message to the user

```js
import { MessageBanner } from 'Components';

<MessageBanner>Default</MessageBanner>
<MessageBanner icon="check-circle" appearance="success">
  Success
</MessageBanner>
<MessageBanner icon="exclamation-circle" appearance="error">
  Error
</MessageBanner>
<MessageBanner appearance="warning">Warning</MessageBanner>
<MessageBanner appearance="info">Info</MessageBanner>

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

## Props
| Name       | Type            | Description                             | Options              | Default |
| ---------- | --------------- | --------------------------------------- | -------------------- | ------- |
| appearance | string          | Sets the style for the MessageBanner           | default, error, info, success, warning    | default |
| children   | node            | Renders the contents of the MessageBanner      |                      |
| dismissable   | bool            | Adds a close icon and makes the MessageBanner dismissable      | true/false                     | false
| icon   | string            | Renders an icon next to the message. Supports all icons available for the `<Icon>`-component.      |                      |
| onExit   | string            | Callback when the MessageBanner exits (must be dismissable) |                      |
| onExited   | string            | Callback when the MessageBanner has exited (must be dismissable) |                      |
| className  | string          | Adds a custom class name for the MessageBanner |                      |
| element    | string, element, func | Changes the root element of the MessageBanner  |                      | button  |

The rest of the props passed to `<MessageBanner>` will be spread onto the root element of the component. This component also accepts a `ref`.