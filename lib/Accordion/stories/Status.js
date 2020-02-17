import React, { useState } from 'react';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import AccordionStatus from '../AccordionStatus';
import ExpandAllButton from '../ExpandAllButton';

export default () => {
  const [expanded, setExpanded] = useState({
    first: true,
    second: false,
    third: true
  });

  const handleToggle = id => {
    setExpanded(cur => ({
      ...cur,
      [id]: !cur[id]
    }));
  };

  return (
    <div className="App">
      <h1>Hello Accordions</h1>
      <h2>Accordions with AccordionSet ((external status/onToggle)</h2>
      <ExpandAllButton accordionStatus={expanded} setStatus={setExpanded} />
      <AccordionSet accordionStatus={expanded} onToggle={handleToggle}>
        <Accordion id="first" label="first">
          <p>first content</p>
        </Accordion>
        <Accordion id="second" label="second">
          <p>second content</p>
        </Accordion>
        <Accordion id="third" label="third">
          <p>third content</p>
        </Accordion>
      </AccordionSet>

      <h2>Accordions with AccordionSet (internal status/onToggle)</h2>
      <AccordionSet>
        <Accordion id="internal_first" label="internal-first">
          <p>first content</p>
        </Accordion>
        <Accordion id="internal_second" label="internal-second">
          <p>second content</p>
        </Accordion>
      </AccordionSet>

      <h2>AccordionStatus with AccordionSet</h2>
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
