import React, { useRef } from 'react';
import AccordionStatus from '../AccordionStatus';
import ExpandAllButton from '../ExpandAllButton';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import AutoSuggest from '../../AutoSuggest';
import Button from '../../Button';
import Selection from '../../Selection';
import MultiSelection from '../../MultiSelection';
import DatePicker from '../../Datepicker';
import Dropdown from '../../Dropdown';
import DropdownMenu from '../../DropdownMenu';
import InfoPopover from '../../InfoPopover';
import { OVERLAY_CONTAINER_ID } from '../../../util/consts';
import { expandAllSections, collapseAllSections } from '../../Commander';
import translations from '../../../translations/stripes-components/en';

const AccordionStatusHarness = () => {
  const statusRef = useRef();
  const optionsRef = useRef([
    { label: 'one', value: 'one' },
    { label: 'two', value: 'two' },
    { label: 'three', value: 'three' },
  ]);

  return (
    <>
      <div id={OVERLAY_CONTAINER_ID} />
      <Button
        onClick={(e) => expandAllSections(e, statusRef)}
      >
        Keyhandler expand-all
      </Button>
      <Button
        onClick={(e) => collapseAllSections(e, statusRef)}
      >
        Keyhandler collapse-all
      </Button>
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
          <Accordion
            label="test5"
            id="accordion04"
          >
            <Selection
              label="Selection"
              id="selection-01"
              dataOptions={optionsRef.current}
            />
          </Accordion>
          <Accordion
            label="test5"
            id="accordion05"
          >
            <MultiSelection
              label="Multiselection"
              id="multiselection-01"
              dataOptions={optionsRef.current}
            />
          </Accordion>
          <Accordion
            label="test6"
            id="accordion06"
          >
            <DatePicker
              label="Datepicker"
              id="datepicker-01"
            />
          </Accordion>
          <Accordion
            label="test7"
            id="accordion07"
          >
            <Dropdown
              renderTrigger={({ getTriggerProps }) => (
                <Button autoFocus {...getTriggerProps()}>
                  Trigger
                </Button>
              )}
              renderMenu={() => (
                <DropdownMenu>
                  <Button>Select All</Button>
                </DropdownMenu>
              )}
            />
          </Accordion>
          <Accordion
            label="test8"
            id="accordion08"
          >
            <AutoSuggest
              label="Autosuggest"
              id="autosuggest-01"
              items={optionsRef.current}
            />
          </Accordion>
          <Accordion
            label="test9"
            id="accordion09"
          >
            <InfoPopover
              renderTrigger={({ ref, toggle }) => (
                <Button ref={ref} onClick={toggle} id="infopopover">
                  Toggle
                </Button>
              )}
              content="This is a test InfoPopover"
            />
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </>
  );
}

export default AccordionStatusHarness;
