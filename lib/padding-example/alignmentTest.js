/* eslint-disable */
import React from 'react';
import Button from '../Button';
import RadioButton from '../RadioButton';
import Layout from '../Layout';
import Checkbox from '../Checkbox';
import TextArea from '../TextArea';
import Headline from '../Headline';
import TextField from '../TextField';
import Select from '../Select';
import NavList from '../NavList';
import NavListItem from '../NavListItem';
import NavListSection from '../NavListSection';
import SearchField from '../SearchField';
import Icon from '../Icon';
import { Row, Col } from '../LayoutGrid';
import KeyValue from '../KeyValue';
import SegmentedControl from '../SegmentedControl';
import List from '../List';
import IconButton from '../IconButton';
import MCLExample from '../MultiColumnList/stories/basic';
import AccordionExample from '../Accordion/stories/BasicUsage';

const items = ['Bananas', 'Apples', 'Oranges', 'Kiwis', 'Strawberries'];

const itemFormatter = (item, i) => (
  <li key={i}>
    {item}
  </li>
);


export default () => (
  <div style={{ maxWidth: '800px', border: '1px solid blue', position: 'relative', padding: '1rem' }}>
  <div style={{
    display: 'block',
    position: 'absolute',
    right: '1rem',
    left: '1rem',
    top: '1rem',
    bottom: '1rem',
    border: '1px solid red',
    left: '1rem',
    opacity: '0.5',
    zIndex: 99,
    'pointer-events': 'none',
  }} />
    <AccordionExample />
    <br /><br />
    <List
      listStyle="bullets"
      items={items}
      itemFormatter={itemFormatter}
    />
    <br /><br />
    <List
        items={items}
        itemFormatter={itemFormatter}
      />
    <br /><br />
    <MCLExample />
    <br /><br />
    <IconButton
        icon="closeX"
      />
      <IconButton
        icon="comment"
        badgeCount="9+"
      />
      <IconButton
        icon="search"
      />
      <IconButton
        icon="edit"
      />
      <IconButton
        icon="duplicate"
      />
      <br />
      <br />
      <br />
      <Headline margin="small">Size: Small</Headline>
      <IconButton
        size="small"
        icon="closeX"
      />
      <IconButton
        size="small"
        icon="comment"
        badgeCount="9+"
      />
      <IconButton
        size="small"
        icon="search"
      />
      <IconButton
        size="small"
        icon="edit"
      />
      <IconButton
        size="small"
        icon="duplicate"
      />
    <br /><br />
    <SegmentedControl activeId="books">
      <Button id="books">Books</Button>
      <Button id="records">Records</Button>
      <Button id="cds">CDs</Button>
    </SegmentedControl>
    <br /><br />
    <Row>
      <Col md={4}>
        <KeyValue
          label="Name"
          value="Johnny Cash"
        />
      </Col>
      <Col md={4}>
        <KeyValue
          label="Birthday"
          value="February 26, 1932"
        />
      </Col>
      <Col md={4}>
        <KeyValue
          label="Years active"
          value="1954–2003"
        />
      </Col>
    </Row>
    <Row>
      <Col md={4}>
        <KeyValue label="Occupation">
          Singer-songwriter guitarist actor author
        </KeyValue>
      </Col>
      <Col md={4}>
        <KeyValue label="Genres">
          <span>Country rock and roll folk gospel</span>
        </KeyValue>
      </Col>
      <Col md={4}>
        <KeyValue label="Instruments">
          <span>Vocals guitar</span>
        </KeyValue>
      </Col>
    </Row>
    <Headline size="xx-small">
      XX Small Headline
    </Headline>
    <Headline size="x-small">
      X Small Headline
    </Headline>
    <Headline size="small">
      Small Headline
    </Headline>
    <Headline size="medium">
      Medium Headline
    </Headline>
    <Headline size="large">
      Large Headline
    </Headline>
    <Headline size="x-large">
      X Large Headline
    </Headline>
    <Headline size="xx-large">
      XX Large Headline
    </Headline>
    <hr />
    <Headline size="large" margin="none" faded>
      Faded headline
    </Headline>
    <hr />
    <Headline size="medium" margin="small">
      Here is a nice medium headline with a small margin
    </Headline>
    <Headline size="small" faded bold={false} tag="h3" aria-label="My headline">
      With a nice small faded non-bold sub headline
    </Headline>  
    <Button>Default button</Button><br/>
    <Button buttonStyle="primary">Primary</Button><br/>
    <Button buttonStyle="danger">Danger</Button><br/>
    <Button buttonStyle="success">Success</Button><br/>
    <Button buttonStyle="warning">Warning</Button><br/>
    <RadioButton label="Inline Radio Button 3" name="inline" value="inline1" label="Here's a radio button" />
    <Checkbox label="Here's a checkbox" />
    <TextArea>Here's a text area.</TextArea>
    <TextField label="Some label" value="Here's a text field" />
    <SearchField />
    <Select>
      <option>Here's a select field</option>
    </Select>
    <NavList>
      <NavListSection stripped>
        <NavListItem>
        <Icon icon="duplicate">
          Here's dropdownItem styled button with an icon
        </Icon>
        </NavListItem>
        <NavListItem>Here's a nav list item</NavListItem>
        <NavListItem>Here's a nav list item</NavListItem>
        <NavListItem>Here's a nav list item</NavListItem>
        <NavListItem>Here's a nav list item</NavListItem>
      </NavListSection>
    </NavList>
    <Button buttonStyle="dropdownItem">
      <Icon icon="duplicate">
        Here's dropdownItem styled button with an icon
      </Icon>
    </Button>
    <Button buttonStyle="dropdownItem">Here's a dropdownItem styled button</Button>
    <Button buttonStyle="dropdownItem">Here's a dropdownItem styled button</Button>
    <Button buttonStyle="dropdownItem">Here's a dropdownItem styled button</Button>
    <Button buttonStyle="dropdownItem">Here's a dropdownItem styled button</Button>
  </div>
);
