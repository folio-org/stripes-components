# FOLIO UI Module Layout
The stripes-components Library provides a few components that form the back-bone of UI layout for FOLIO modules.
We can start from the highest level in the typical module component tree and work our way inward:
## Panesets
Panesets are containers for a collection of Panes that span the width of their containing element. Under the hood they control sizing and general management of their descendent Pane components. They can be nested using the 'nested' prop. See their [documentation](../lib/Paneset/readme.md) for more info.
## Panes
Panes are the primary layout device for FOLIO module UI. They contain the FOLIO 'chrome'- a header area and space for menus and functions that pertain to the contents of the Pane. Consult their [documentation] on ways to customize them.
## Layers
The `Layer` component can be used within a Paneset to trigger visibility on a new 'layer' of the UI. It typically contains a Paneset with its descendent Panes. It uses a boolean prop to show or hide itself, so it can and should be triggered through user interaction. Check out the [documentation](https://github.com/folio-org/stripes-components/blob/master/lib/Layer/readme.md) for more info.
## LayoutGrid
The `<LayoutGrid>` component consists of a few sub-components to control layout of content within Panes.
### Row
A `<Row>` is a container that spans the width of its parent element. It nests one or more `<Col>` components.
### Col
`<Col>` components stack like bricks within the rows. They're used to control layout that can vary depending on the width of the screen. They have size props to specify their horizontal width at particular viewport widths via media queries - `xs`, `sm`, `md`, `lg`. The number required by these props is an integer representing a ratio out of 12. So a value of 6 would give you a `<Col>` with a width of 50%. See the [documentation](https://github.com/roylee0704/react-flexbox-grid/blob/master/README.md#usage) of react-flexbox-grid for more details.

### Boilerplate Basic Pane Layout

```
import React from 'react';
import { Col, Pane, Paneset, Row } from '@folio/stripes/components';

class LayoutExample extends React.Component {
  render() {
    return (
      <Paneset>
        <Pane paneTitle="Pane 1" defaultWidth="20%">
          Pane 1 Content
        </Pane>
        <Pane paneTitle="Pane 2" defaultWidth="fill">
          Pane 2 Content
        </Pane>
      </Paneset>
    );
  }
}

export default LayoutExample;

```
