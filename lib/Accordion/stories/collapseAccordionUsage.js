import React, { useRef } from 'react';
import ExpandAllButton from '../ExpandAllButton';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import AccordionStatus from '../AccordionStatus';
import { defaultKeyboardShortcuts, expandAllSections, collapseAllSections } from '../../Commander/keyboardShortcuts';
import { CommandList, HasCommand } from '../../Commander';
import translations from '../../../translations/stripes-components/en';


export default () => {
  const acRef = useRef(null);

  const accordionCommands = useRef([
    {
      name: 'expandAllSections',
      handler: (e) => { expandAllSections(e, acRef); },
    },
    {
      name: 'collapseAllSections',
      handler: (e) => { collapseAllSections(e, acRef); },
    }
  ]).current;

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <HasCommand commands={accordionCommands} scope={document.body}>
        <div>
        <AccordionStatus ref={acRef}>
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
        </div>
      </HasCommand>
    </CommandList>
  );
};
