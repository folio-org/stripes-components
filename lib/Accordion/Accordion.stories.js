import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './readme.md';

import Accordion from './Accordion';

storiesOf('Accordion', module)
  .addDecorator(withReadme(Readme))
  .add('with defaults', () => (
    <Accordion label="Hello">
      Content
    </Accordion>
  ));
