import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import Status from './Status';
import ExpandAllWithin from './ExpandAllWithinSet';
import { FilterAccordionHeader } from '../headers';

const as = {
  acc1: false,
  acc2: false,
  acc3: false,
  acc4: false,
};

export default {
  title: 'Accordion',
  decorators: [withReadme(Readme)],
};

export const WithDefaults = () => <BasicUsage />;

WithDefaults.story = {
  name: 'With defaults',
};

export const AccordionStatus = () => <Status />;

export const KeyboardNavigation = () => (
  <AccordionSet accordionStatus={as}>
    <Accordion label="Up Arrow" id="acc1">
      Content
    </Accordion>
    <Accordion label="Down Arrow" id="acc2">
      Content
    </Accordion>
    <Accordion label="Home" id="acc3">
      Content
    </Accordion>
    <Accordion label="End" id="acc4">
      Content
    </Accordion>
  </AccordionSet>
);

export const DisplayWhenProps = () => (
  <>
    <h2>&quot;displayWhenOpen&quot; prop</h2>
    <Accordion label="Here is a label" displayWhenOpen={<p>Add item</p>}>
      Content
    </Accordion>
    <h2>&quot;displayWhenClosed&quot; prop</h2>
    <Accordion open={false} displayWhenClosed={<p>Some items</p>}>
      Content
    </Accordion>
  </>
);

DisplayWhenProps.story = {
  name: 'DisplayWhen',
};

export const Separator = () => <Accordion separator={false}>Separator set to false.</Accordion>;

Separator.story = {
  name: 'Separator',
};

export const Header = () => {
  const header = ({
    contentId,
    toggleRef,
    open,
    onToggle,
    label
  }) => (
      <p style={{ border: '1px solid #ddd', padding: '0 4px' }}>
      <button ref={toggleRef} onClick={onToggle} aria-owns={contentId}>{`${label} Header Content (click to ${open ? 'close':'expand'})`}</button>
      </p>
    );
  return (
    <>
      <div style={{border: '1px solid #ccc', padding: '0 1rem'}}>
        <Accordion header={header} label={'Example'}>Body Content</Accordion>
      </div>
      <br/>
      <br/>
      <br/>
      <Accordion header={FilterAccordionHeader} label={'Filter Accordion Header'}>Content</Accordion>
    </>
  );
};

Header.story = {
  name: 'Header',
};

export const ExpandAllWithinSet = () => <ExpandAllWithin />;

ExpandAllWithinSet.story = {
  name: 'ExpandAll within set',
};
