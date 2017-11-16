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
  ));
