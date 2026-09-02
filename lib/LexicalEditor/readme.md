# Editor

WYSIWYG HTML Editor component to implemented with the Lexical framework (see https://lexical.dev/) with label and validation controls.


## Common Usage with a form framework...
Form state frameworks such as `react-final-form` provide `<Field>` components that manage form state. `<Field>` components often automatically apply particular props such as `onChange` and `value` under the hood, so you don't have to.
```
import { LexicalEditor } from '@folio/stripes/components';
import { Field } from 'react-final-form';
...
<Field component={LexicalEditor} />
```

## Basic vanilla usage (controlled)
If used without a form state manager, you will have to supply your own state and handlers.
```
import { LexicalEditor } from '@folio/stripes/components';
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
`value` | string | Initial value for the editor. Has to be a string containing HTML | |
`readOnly` | bool | If true, the editor won't allow changing its contents. Disables formatting buttons. | false |
`placeholder` | string | The default value for the empty editor. | |
`sanitizeConfig` | object | Optional DOMPurify configuration used when sanitizing incoming `value` and outgoing `onChange` HTML. Merged with default `ADD_ATTR: ['target', 'rel']` and `FORBID_ATTR: ['class']`. | |
`required` | bool | Apply `required` attribute to `<input>` | |
`label` | Label for the field | undefined | |

## Callback Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`onBlur` | func | Called when the editor loses focus.  | |
`onChange` | func | Called back with sanitized HTML contents of the editor after change. | |

## Input/Output Sanitization
The editor parses input HTML string using `DOMParser` API, and sanitizes output HTML string with `dompurify`:

- Incoming values: `value` is parsed into DOM nodes before being passed to the internal `<LexicalComposer>` component.
- Outgoing values: the first argument passed to `onChange` is sanitized HTML.

By default, anchor attributes `target` and `rel` are allowed to support links such as:

```
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>
```

You can provide additional DOMPurify options with `sanitizeConfig`:

```
<LexicalEditor
  sanitizeConfig={{
    ADD_TAGS: ['custom-tag'],
    ADD_ATTR: ['data-test-id'],
  }}
/>
```

## Validation Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`dirty` | bool | Mark 'true' when value has changes. | |
`error` | node | Error string to display after textfield in case of validation error. | |
`valid` | bool | Applies success validation style to `<LexicalEditor>` | |
`validationEnabled` | bool | When set to false, `<LexicalEditor>` will not display validation messaging. | `true` |
`validStylesEnabled` | bool | When set to false, `<LexicalEditor>` will not display validation styles. | `false` |
`warning` | node | Validation warning. Renders node below `<LexicalEditor>` with warning styling. | |

## Style Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`className` | string | Apply a custom class name to the root element that wraps the  `<LexicalEditor>`. | |
`editorClassName` | string | Apply a custom class name to the `<LexicalEditor>`. | |

## For component developers and maintainers

### Adding formatting options to the editor
In order to add more formatting options we need to do 3 things:
1. Add a new button in the `<ToolbarPlugin>` component. Inside the `onClick` handler we'll have some code that will update the editor state.
2. (optional) Add a new state variable in the `<ToolbarPlugin>` which will hold information of whether a selected text has this formatting option applied.
3. (optional) Add a check inside the `updateToolbar` function to set the state variable from step 2. This is needed because this state represents a toolbar state for the currently selected text. When text selection changes - we also need to update the toolbar.

As an example, let's create a formatting option that will make selected text uppercase:

1. Add a new button
```
const handleOnUppercase = () => {
  editor.update(() => {
    const selection = $getSelection();
    const selectionText = selection.getTextContent();

    // create a new text node so we can insert only uppercase text into it
    const uppercaseNode = $createTextNode();
    uppercaseNode.setTextContent(selectionText.toUpperCase())

    // Lexical will replace the selection with the new node that we created
    selection.insertNodes([uppercaseNode]);
  });
};

<IconButton
  onClick={() => handleOnUppercase()}
  aria-label="Make uppercase"
  icon="uppercase"
/>
```

2. Add a new state variable
```
const [isUpperCase, setIsUpperCase] = useState(false);

const handleOnUppercase = () => {
  editor.update(() => {
    ...
    setIsUpperCase(true);
  });
};

<IconButton
  onClick={() => handleOnUppercase()}
  className={classNames(css.toolbarItem, css.spaced, { [css.active]: isUpperCase })}
  aria-label="Make uppercase"
  icon="uppercase"
/>
```

3. Add a check inside the `updateToolbar` function to set the state variable from step 2.

```
const updateToolbar = useCallback(() => {
  const selection = $getSelection();
  const node = getSelectedNode(selection);
  const parent = node.getParent();

  if ($isRangeSelection(selection)) {
    setIsUpperCase(selection.getTextContent().toUpperCase() === selection.getTextContent());
  }
});
```

And now we have a new functional button in our toolbar that makes the selected text uppercase!

*In addition*, instead of using `editor.update()` in our `handleOnUppercase` callback - we could also create a custom command and dispatch it, like so:
```
const MAKE_UPPERCASE = createCommand('MAKE_UPPERCASE');

useEffect(() => {
  return editor.registerCommand(
    MAKE_UPPERCASE,
    () => {
      const selection = $getSelection();
      const selectionText = selection.getTextContent();

      const uppercaseNode = $createTextNode();
      uppercaseNode.setTextContent(selectionText.toUpperCase())

      selection.insertNodes([uppercaseNode]);
      setIsUpperCase(true);
      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  );
}, [editor]);

<IconButton
  onClick={() => editor.dispatchCommand(MAKE_UPPERCASE)}
  className={classNames(css.toolbarItem, css.spaced, { [css.active]: isUpperCase })}
/>
```
More on commands in the [Lexical Commands docs](https://lexical.dev/docs/concepts/commands)

### Using plugins

Lexical has formatting options available as plugins (lists, links, history etc.).
They usually provide a component to render as a child of `<LexicalComposer>`. If there are custom nodes provided - they should be added to the `editorConfig.nodes` collection.
When adding a formatting option - our click handlers can, depending on the plugin's implementation, dispatch a provided command or call a provided function etc.

More on plugins in the [Lexical Plugins docs](https://lexical.dev/docs/react/plugins)

### Other useful links
[Editor state](https://lexical.dev/docs/concepts/editor-state)
[Nodes](https://lexical.dev/docs/concepts/nodes)
[Node cloning](https://lexical.dev/docs/concepts/node-cloning)
[Selection](https://lexical.dev/docs/concepts/selection)
[Read Mode / Edit Mode](https://lexical.dev/docs/concepts/read-only)
[Verbum](https://github.com/ozanyurtsever/verbum) - a text editor built with Lexical. Useful for concrete code examples.
