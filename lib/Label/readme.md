# Label
Renders a simple `<label>` with a few optional additions

**Note:** Most form components have already labels implemented directly – activated by the "label"-prop. This component is only relevant in special circumstances – e.g. when creating a new form component.

## Basic Usage
```js
  import { Label } from '@folio/stripes/components';

  <Label required>
    My label
  </Label>
```

## Props
Below are the most relevant props for the `<Label>`-component. Any additional props will automatically be spread upon the root-element.

Name | Type | Description
--- | --- | ---
children | node | The content of the `<Label>`
className | string | Applies a custom class name
htmlFor | Adds a "for"-attribute on the label-element
id | string | Adds an ID on the label-element
readOnly | boolean | Renders a lock-icon next to the label (indicating that the associated field is read-only)
required | boolean | Renders an asterisk next to the label (indicating that the associated field is required)
tagName | string | Change the tag name of the component. Renders a label-element as default.
