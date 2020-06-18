import React from 'react';
import ExpandAllButton from '../ExpandAllButton';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import translations from '../../../translations/stripes-components/en';

export default () => {
  return (
    <AccordionSet closedByDefault>
      <ExpandAllButton
        collapseLabel={translations.collapseAll}
        expandLabel={translations.expandAll}
        id="expand-button"
      />
      <Accordion
        label="test"
        id="accordion01"
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
  );
};
