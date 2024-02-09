/**
 * Accordion: Basic Usage
 */

/* eslint-disable max-len */

import React, {useState, useRef} from 'react';
import faker from 'faker';
import { AccordionSet, Accordion } from '..';
import Button from '../../Button';
import Datepicker from '../../Datepicker';

const BasicUsage = () => {
  const [textValue, updateTextValue] = useState();
  const paragraphs = useRef([
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
    faker.lorem.paragraph()
  ]).current;
  return(
  <AccordionSet>
    <Accordion label="Information" displayWhenOpen={<Button icon="plus-sign">Add</Button>} headerProps={{ headingLevel: 2 }}>
      This is an example of an AccordionSet. The 2nd of these accordions is closed by default using the &quot;closedByDefault&quot; prop.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
      <br />
      <br />
      <input aria-label="I'm hidden! when closed!" type="text" id="testTextField" value={textValue} onChange={(e) => updateTextValue(e.target.value)} />
      {paragraphs[0]}
    </Accordion>
    <Accordion label="Extended Information" closedByDefault>
      {paragraphs[1]}
      <br />
      <Datepicker />
      <br />
      {paragraphs[2]}
    </Accordion>
    <Accordion label="Proxy">
      {paragraphs[3]}
      <br />
      <br />
      {paragraphs[4]}
    </Accordion>
    <Accordion label="Loans">
      {paragraphs[5]}
      <br />
      <br />
      {paragraphs[6]}
    </Accordion>
  </AccordionSet>
)};

export default BasicUsage;
