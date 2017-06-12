## Flex-box layout grid
Automagical support for right-to-left languages (rtl), dynamic sizing of columns, responsive behavior, to boot.

## Basics
Every `<Row>` contains a series of `<Col>`s. Each `<Col>` has different size properties that apply to different media query breakpoints. Each property accepts an integer from 1 to 12, representing the fraction x/12 of the total width of the `<Row>`. `xs` is the base, dominant prop that would be used most often, as the grid is 'mobile first.' Other breakpoint props, increasing in size: `sm`, `md`, `lg`, can be used to adjust the layout of the row as the size of the viewport increases.

Basic examples: 
```
// Most common usage for basic layout:
<Row>
  <Col xs={4}> 33.33% of the row      </Col>
  <Col xs={6}> 50% of the row         </Col>
  <Col xs={2}> 16.6666.. % of the row </Col>
</Row>

// Responsive adjustment
<Row>
  <Col xs={12} sm={3} md={2} lg={1} />
  <Col xs={6} sm={6} md={8} lg={10} />
  <Col xs={6} sm={3} md={2} lg={1} />
</Row>
```

More examples can be found [here](https://roylee0704.github.io/react-flexbox-grid/)


### Upgrading from float-based grid.

Simply replace imports:

Change 
```
import { Row, Col } from 'react-bootstrap';
```
To
```
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

```
