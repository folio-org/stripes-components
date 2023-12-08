# Editor

WYSIWYG HTML Editor component to wrap the react-quill (see https://github.com/zenoamaro/react-quill#the-unprivileged-editor) with label and validation controls.


## Common Usage with a form framework...
Form state frameworks such as `react-final-form` provide `<Field>` components that manage form state. `<Field>` components often automatically apply particular props such as `onChange` and `value` under the hood, so you don't have to.
```
import { Editor } from '@folio/stripes/components';
import { Field } from 'react-final-form';
...
<Field component={Editor} />
```

## Basic vanilla usage (controlled)
If used without a form state manager, you will have to supply your own state and handlers.
```
import { Editor } from '@folio/stripes/components';
...
<Editor
  value={this.state.html}
  onChange={this.handleChange}
/>
```

## Basic Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`id` | string | ID to be applied to the DOM element | |
`className` | string | Classes to be applied to the DOM element. | |
`value` | string | Value for the editor as a controlled component. Can be a string containing HTML, a Quill Delta instance, or a plain object representing a Delta. Note that due to limitations in Quill, this is actually a semi-controlled mode, meaning that the edit is not prevented, but changing value will still replace the contents. Also note that passing a Quill Delta here, and then an HTML string, or vice-versa, will always trigger a change, regardless of whether they represent the same document. ⚠️ Do not pass the delta object from the onChange event as value, as it will cause a loop. See https://github.com/zenoamaro/react-quill#using-deltas  | |
`defaultValue` | string |  Initial value for the editor as an uncontrolled component. Can be a string containing HTML, a Quill Delta, or a plain object representing a Delta. | |
`readOnly` | bool | If true, the editor won't allow changing its contents. Wraps the Quill disable API. | false |
`placeholder` | string | The default value for the empty editor. | |
`modules` | object | An object specifying which modules are enabled, and their configuration. The editor toolbar is a commonly customized module. See the http://quilljs.com/docs/modules/ | |
`formats` | array | An array of formats to be enabled during editing. All implemented formats are enabled by default. See http://quilljs.com/docs/formats/ for a list of availible formats. | |
`inputRef` | object or func | Supplies a ref to the rendered `<Editor>` | |
`tabIndex` | number | The order in which the editor becomes focused, among other controls in the page, during keyboard navigation. | |
`disableEditorTab` | bool | Disable editor tab handling to improve accessibility. | true |
`required` | bool | Apply `required` attribute to `<input>` | |
`startControl` | element |  Element to render as a leading control to the textfield. | |
`type` | string | Type attribute of `<input>` | "text" |


## Callback Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`onBlur` | func | Called when the editor loses focus. It will receive the selection range it had right before losing focus. | |
`onChange` | func | Called back with the new contents of the editor after change. | |
`onChangeSelection` | func |  Called back with the new selected range, or null when unfocused.  | |
`onFocus` | func | Called when the editor becomes focused. It will receive the new selection range | |
`onKeyPress` | func | Called after a key has been pressed and released. | |
`onKeyDown` | func | Called after a key has been pressed, but before it is released. | |
`onKeyUp` | func | Called after a key has been released. | |

## Validation Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`dirty` | bool | Mark 'true' when value has changes. | |
`error` | node | Error string to display after textfield in case of validation error. | |
`valid` | bool | Applies success validation style to `<Editor>` | |
`validStylesEnabled` | bool | When set to false, `<Editor>` will not display validation styles. | `false` |
`warning` | node | Validation warning. Renders node below `<Editor>` with warning styling. | |

## Style Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`className` | string | Apply a custom class name to the root element that wraps the  `<Editor>`. | |
`style` | object | An object with custom CSS rules to apply on the `<Editor>` container. Rules should be in React's "camelCased" naming style. | |
`editorClassName` | string | Apply a custom class name to the `<Editor>`. | |

