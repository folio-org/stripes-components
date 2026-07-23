import React from 'react';
import { Accordion, AccordionSet } from '../../../lib/Accordion';

export default function MiniAccordionExample() {
  return (
    <AccordionSet>
      <Accordion label="Record details" id="mini-accordion-record-details">
        Summary information can be shown or hidden.
      </Accordion>
      <Accordion label="Administrative data" id="mini-accordion-admin" closedByDefault>
        Additional fields remain available without expanding page length.
      </Accordion>
    </AccordionSet>
  );
}
