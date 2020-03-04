/**
 * Accordion: Expand all within AccordionSet
 */

/* eslint-disable max-len */

import React from 'react';
import faker from 'faker';
import { AccordionSet, Accordion, ExpandAllButton } from '..';
import Button from '../../Button';

const ExpandAllWithin = () => {
  const [status, updateStatus] = React.useState({
    info: true,
    exinfo: true,
    proxy: true,
    loans: true,
  });

  const onToggleAll = () => {
    updateStatus(curStatus => {
      const newStatus = {};
      Object.keys(curStatus).forEach((s) => {
        newStatus[s] = !curStatus[s];
      });
      return newStatus;
    });
  };

  const onToggle = ({ id }) => {
    updateStatus(current => ({
      ...current,
      [id]: !current[id]
    }));
  };

  return (
    <AccordionSet accordionStatus={status} onToggle={onToggle}>
      <ExpandAllButton onToggle={onToggleAll} />
      <Accordion label="Information" id="info" displayWhenOpen={<Button icon="plus-sign">Add</Button>}>
        This is an example of an AccordionSet. The 2nd of these accordions is closed by default using the &quot;closedByDefault&quot; prop.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
        <br />
        <br />
        {faker.lorem.paragraph()}
      </Accordion>
      <Accordion label="Extended Information" id="exinfo" closedByDefault>
        {faker.lorem.paragraph()}
        <br />
        <br />
        {faker.lorem.paragraph()}
      </Accordion>
      <Accordion label="Proxy" id="proxy">
        {faker.lorem.paragraph()}
        <br />
        <br />
        {faker.lorem.paragraph()}
      </Accordion>
      <Accordion label="Loans" id="loans">
        {faker.lorem.paragraph()}
        <br />
        <br />
        {faker.lorem.paragraph()}
      </Accordion>
    </AccordionSet>
  );
};

export default ExpandAllWithin;
