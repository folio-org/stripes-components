# Button

The classic button, in different styles and sizes

## Basic Usage

```
import { Button } from '@folio/stripes-components/lib/Button';

...
<Button>
    My Button
</Button>
```

## Props
Name | Type | Description
--- | --- | ---
buttonStyle | string | Change the style/color of the button (see the [styles section](/?selectedKind=Button&selectedStory=Styles)) |
type | string | Change the button type |
buttonClass | string | Add a custom class |
align | string | Change the alignment of the button (with flexbox) Options: start, center, end |
className | string | Replace CSS classes completely |
bottomMargin0 | bool | Remove bottom margin |
marginBottom0 | bool | Remove bottom margin |
paddingSide0 | bool | Remove padding on the sides |
fullWidth | fullWidth | Forces the button width to 100% |
href | string | Returns an anchor-tag with an href-attribute |
allowAnchorClick | bool | Allow anchor click |
onClick | function | Adds an onClick handler |
role | string | Adds [role-attribute](https://www.w3.org/wiki/PF/XTech/HTML5/RoleAttribute) to the button |,
children | node / array of nodes | Adds child node(s) to button |
buttonRef | string | Adds ref-attribute |
autoFocus | bool | If this prop is `true`, component will automatically focus on mount | | 
