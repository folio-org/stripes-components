# TextArea

A multi-line, resizable text field.

## Usage

Controlled:

```js
import { TextArea } from '@folio/stripes/components';

const [description, setDescription] = useState('');

<TextArea
  label="Description"
  value={description}
  onChange={e => setDescription(e.target.value)}
/>
```

With react-final-form:

```js
import { Field } from 'react-final-form';
import { TextArea } from '@folio/stripes/components';

<Field
  name="description"
  component={TextArea}
  label="Description"
/>
```

## Props

| Property | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| `ariaLabel` | string | Provides a custom label for the element<br /> **Deprecated, use `aria-label` instead** | | |
| `ariaLabelledby` | string | Identify the element which labels the current element<br /> **Deprecated, use `aria-labelledby` instead** | | |
| `autoFocus` | boolean | If the field should auto-focus on mount | | |
| `dirty` | boolean | Marks the field as changed, for styling | | |
| `disabled` | boolean | Disables the input field | | |
| `endControl` | node | Control or Icon to display at the end of the field | | |
| `error` | node | An error to show for validation | | |
| `fitContent` | boolean | Resizes the textarea to show all content as needed | | |
| `fullWidth` | boolean | If the field should stretch to fill its container | | |
| `id` | string | Adds a custom ID to the control | | |
| `inputRef` | ref | Ref to the internal HTMLTextArea | | |
| `label` | node | The input's label | | |
| `loading` | boolean | Adds a loading spinner to the control | | |
| `lockWidth` | boolean | Prevent the user from changing the width | | |
| `marginBottom0` | boolean | Remove bottom margin | | |
| `name` | string | The input's name | | |
| `newLineOnShiftEnter` | boolean | When true: Shift+Enter=newline, Enter=submit<br />When false: whatever the default behavior is | | |
| `noBorder` | boolean | Removes the border | | |
| `onChange` | func | Fired anytime internal state changes | | |
| `onKeyDown` | func | Fired on key down | | |
| `onSubmitSearch` | func | Event handler for submission, fired when `newLineOnShiftEnter=true` and user presses Enter | | |
| `onFocus` | func | Fired when the user clicks into the control | | |
| `readOnly` | boolean | If the control is readonly | | |
| `required` | boolean | If the field is required | | |
| `rootClass` | string | Adds a custom class to the root wrapper `<div>` | | |
| `startControl` | node | Control or Icon to display at the start of the field | | |
| `valid` | boolean | If true, adds valid styles to the field | | |
| `validationEnabled` | boolean | If validation styles should be rendered | | |
| `validStylesEnabled` | boolean | If styles should be shown for valid input | | |
| `value` | string | The field's value | | |
| `warning` | node | Inline feedback for the user indicating a validation warning | | |

Additional props are spread onto the `<textarea>`.
