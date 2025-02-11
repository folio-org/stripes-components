# MessageBanner
Display a message to the user. The message banner has short and clear content with key information in bold.

## Basic Usage
```js
import { MessageBanner } from '@folio/stripes/components';

<MessageBanner>Default</MessageBanner>
<MessageBanner type="success">Success</MessageBanner>
<MessageBanner type="error">Error</MessageBanner>
<MessageBanner type="warning">Warning</MessageBanner>

<MessageBanner type="error">
  <ul>
    <li><strong>Using an unordered HTML list</strong></li>
    <li>Your password must include one numeric value</li>
    <li>Your password must include one special charater</li>
    <li>Your password must be at least 8 charaters</li>
  </ul>
</MessageBanner>
```

## Accessibility
For accessibility reasons we want the `<MessageBanner>` to remain in the DOM so that screen readers will update and read out the contents of the component as it changes.

If you need the `<MessageBanner>` to enter and exit the UI then you should use the `show`-prop to handle this. Using this prop will ensure that the screen reader related DOM element remains in the DOM after the visual part of the component exits.

**Example:**
```js
// Bad
{ message && <MessageBanner>{message}</MessageBanner>}

// Good
<MessageBanner show={!!message}>{message}</MessageBanner>
```

You can further improve the screen reader experience by adding a more specific dismiss button aria-label. For this purpose you can use the `dismissButtonAriaLabel`-prop to change the message that will be read out load. This label defaults to `"Hide message"`.

## Dismissible
Setting the `dismissible`-prop enables the option for the user to hide the `<MessageBanner>`. It is also possible to control the visibility externally by using the `show`-prop. See an example below this section.

```js
<MessageBanner dismissible>
  I'm dismissible
</MessageBanner>
```

## Controlled
Passing the `show`-prop makes it possible to control the visibility externally. This also enables enter/exit transitions.

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
aria-live | string | Sets the `aria-live`-attribute for the root element. | off, polite, assertive | assertive
autoFocusDismissButton | bool | Autofocuses the dismiss button when the `<MessageBanner>` enters the DOM. This requires that the `dismissible`-prop is set to true | | false
type | string | Sets the style of the `<MessageBanner>` | default, error, success, warning | default
children | node | Renders the contents of the `<MessageBanner>` | |
dismissible | boolean | Adds a close icon and makes the `<MessageBanner>` dismissible | true/false | false
dismissButtonAriaLabel | string | Adds an aria-label attribute for the dismiss `<IconButton>`. | | "Hide message"
dismissButtonProps | object | Add custom props for the dismiss button. This can be useful for e.g. adding a custom class name for the internal `<IconButton>`. | | {}
icon | string | Renders an icon next to the message. Supports all icons available for the <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Icon" target="_blank">`<Icon>`</a>-component. When the `type`-prop is set to either "success", "error" and "warning" the `<MessageBanner>` will have icons by default but these too can be overwritten by using the `icon`-prop. If you want to remove the icon entirely you can simply set `icon` to `null` | |
onEnter | func | Callback when the `<MessageBanner>` enters | |
onEntered | func | Callback when the `<MessageBanner>` has entered | |
onExit | func | Callback when the `<MessageBanner>` exits | |
onExited | func | Callback when the `<MessageBanner>` has exited | |
className | string | Adds a custom class name for the `<MessageBanner>` | |
contentClassName | string | Adds a custom class name for the content element inside the `<MessageBanner>` | |
element | string, element, func | Changes the root element of the `<MessageBanner>` | | div |
show | boolean | Control the visiblity externally. Using the show-prop will enable the `<MessageBanner>` to transition in and out. | true/false | |


The remaining props passed to `<MessageBanner>` will be spread onto the root element of the component. This component also accepts a `ref`.
