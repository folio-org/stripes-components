import React, { useRef } from 'react';
import AccordionStatus from '../AccordionStatus';
import ExpandAllButton from '../ExpandAllButton';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import Button from '../../Button';
import { expandAllSections, collapseAllSections } from '../../Commander';
import translations from '../../../translations/stripes-components/en';

const AccordionStatusHarness = () => {
  const statusRef = useRef();
  return (
    <>
      <Button
        onClick={(e) => expandAllSections(e, statusRef)}
      >Keyhandler expand-all</Button>
      <Button
        onClick={(e) => collapseAllSections(e, statusRef)}
      >Keyhandler collapse-all</Button>
      <AccordionStatus ref={statusRef}>
        <ExpandAllButton
          collapseLabel={translations.collapseAll}
          expandLabel={translations.expandAll}
          id="expand-button"
        />
        <AccordionSet closedByDefault id="testSet">
          <Accordion
            label="test"
            id="accordion01"
            closedByDefault
          >
            <input />
          </Accordion>
          <Accordion
            label="test"
            id="accordion02"
          >
            <input />
          </Accordion>
          <Accordion
            label="test"
            id="accordion03"
          >
            <input />
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </>
  );
}

export default AccordionStatusHarness;
