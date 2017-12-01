import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './readme.md';
import BasicUsage from './stories/BasicUsage';
import Accordion from './Accordion';

storiesOf('Accordion', module)
  .addDecorator(withReadme(Readme))
  .add('with defaults', () => <BasicUsage />)
  .add('open', () => (
    <Accordion open>
      Content
    </Accordion>
  ))
  .add('id and contentId', () => (
    <Accordion contentId="pTag">
      <p id="pTag">
        Content
      </p>
    </Accordion>
  ))
  .add('displayWhenOpen', () => (
    <Accordion label="Here is a label" displayWhenOpen={<p>Add item</p>}>
      Content
    </Accordion>
  ))
  .add('displayWhenClosed', () => (
    <Accordion open={false} displayWhenClosed={<p>Some items</p>}>
      Content
    </Accordion>
  ))
  .add('separator', () => (
    <Accordion separator={false}>
      Separator set to false.
    </Accordion>
  ))
  .add('toggleKeyHandlers', () => {
    const handlers = {
      delete() { console.log('delete'); },
    };
    return (
      <Accordion toggleKeyHandlers={handlers}>
        content
      </Accordion>
    );
  })
  .add('header', () => {
    const header = () => (<p>content</p>);
    return (
      <Accordion header={header}>
        Content
      </Accordion>
    );
  });
