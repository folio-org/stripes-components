# RadioButtonGroup

Convenient wrapper component for sets of radio buttons. Will pass `name` prop as well as other shared props down to `<RadioButton>` children.
The component will automatically render radio buttons within a `<FieldGroup>` with the value for the `label` prop applied as a `<legend>`. Non-`<RadioButton>` children can also be passed for alternative layouts, but **RadioButtons should still be direct descendants**.

## Usage
Example with redux-form `<Field>` component:

```
<Field label="Acting as" name="subGroup" component={RadioButtonGroup}>
  <RadioButton label="self" id="actingAsSelf" value="self" />
  <h4>Sponsor</h4>
  <RadioButton label="Abbot, Cody" id="actingSponsor001" value="sponsor001" inline />
  <RadioButton label="Doe, John" id="actingSponsor002" value="sponsor002" inline />
  <RadioButton label="Martin, Danforth" id="actingSponsor003" value="sponsor003" inline />
  <RadioButton label="James, Phillip" id="actingSponsor004" value="sponsor004" inline />
</Field>
```

## Props
Name | type | description | default | required |
--- | --- | --- | --- | --- |
selectedValue | string | Sets default value for radio button set - **Not necessary for redux-form - will use the form's initialValues prop instead** | | |
children | node or array of nodes | Set of `<RadioButton>`s for usage. Can include other tags (headers, spans, etc.) | | &#10004;|
label | string or node | Content to render in the `<legend>` tag of the created `<fieldset>`. | | |
