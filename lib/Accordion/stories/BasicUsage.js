/**
 * Accordion: Basic Usage
 */

/* eslint-disable max-len */

import React from 'react';
import faker from 'faker';
import { AccordionSet, Accordion } from '..';
import Button from '../../Button';

const BasicUsage = () => (
  <AccordionSet>
    <Accordion label="Information" displayWhenOpen={<Button icon="plus-sign">Add</Button>}>
      This is an example of an AccordionSet. The 2nd of these accordions is closed by default using the &quot;closedByDefault&quot; prop.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
      <br />
      <br />
      {faker.lorem.paragraph()}
    </Accordion>
    <Accordion label="Extended Information" closedByDefault>
      {faker.lorem.paragraph()}
      <br />
      <br />
      {faker.lorem.paragraph()}
    </Accordion>
    <Accordion label="Proxy">
      {faker.lorem.paragraph()}
      <br />
      <br />
      {faker.lorem.paragraph()}
    </Accordion>
    <Accordion label="Loans">
      {faker.lorem.paragraph()}
      <br />
      <br />
      {faker.lorem.paragraph()}
    </Accordion>
  </AccordionSet>
);

export default BasicUsage;
