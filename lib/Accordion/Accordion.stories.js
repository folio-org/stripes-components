import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies
import Readme from './readme.md';

import Accordion from './Accordion';

storiesOf('Accordion', module)
  .addDecorator(withReadme(Readme))
  .add('with defaults', () => (
    <Accordion label="Hello">
      Content
    </Accordion>
  ))
  .add('open', () => (
    <Accordion open>
      Content
    </Accordion>
  ))
  .add('id and contentId', () => (
    <Accordion contentId='pTag'>
      <p id='pTag'>
        Content
      </p>
    </Accordion>
  ))
  .add('displayWhenOpen', () => (
    <Accordion displayWhenOpen={<p>Add item</p>}>
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
      'delete': function() {alert('delete');}
    };
    return (
      <Accordion toggleKeyHandlers={handlers}>
        content
      </Accordion>
    )
  })
  .add('header', () => {
    const header = (props) => (<p>content</p>);
    return (
      <Accordion header={header}>
        Content
      </Accordion>
    );
  });
