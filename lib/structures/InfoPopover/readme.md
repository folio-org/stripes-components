# InfoPopover
Display a small information icon which can be toggled by clicking on it.

## Basic Usage
```
  import InfoPopover from '@folio/stripes-components/lib/structures/InfoPopover';

  <InfoPopover
    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    buttonLabel="Read more"
    buttonHref="https://wiki.folio.org/"
    buttonTarget="_blank"
  />
```
## Props
Name | Type | Description | default
-- | -- | --
content | string, node | The content of the information popover |
buttonLabel | string | The label of the button inside the information popover | "Read more"
buttonHref | string | The destination for the button inside the information popover |
buttonTarget | string | The target for the button  | _blank
