import React from 'react';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import AccordionStatus from '../AccordionStatus';
import ExpandAllButton from '../ExpandAllButton';

export default () => {
  return (
    <div>
      <h2>AccordionStatus with AccordionSet (uncontrolled - State managed by AccordionStatus)</h2>
      <AccordionStatus>
        <ExpandAllButton />
        <AccordionSet>
          <Accordion label="AccordionStatus_one">
            <p>first content</p>
          </Accordion>
          <Accordion label="AccordionStatus_two">
            <p>second content</p>
          </Accordion>
        </AccordionSet>
      </AccordionStatus>

      <h2>Nested AccordionSet</h2>
      <AccordionStatus>
        <ExpandAllButton />
        <AccordionSet>
          <Accordion id="has_nested" label="container">
            <AccordionStatus>
              <ExpandAllButton />
              <AccordionSet>
                <Accordion id="nested_1" label="nested_1">
                  <p>first nested content</p>
                </Accordion>
                <Accordion id="nested_2" label="nested_2">
                  <p>second nested content</p>
                </Accordion>
              </AccordionSet>
            </AccordionStatus>
          </Accordion>
          <Accordion label="sibling">
            <p>second content</p>
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </div>
  );
};
