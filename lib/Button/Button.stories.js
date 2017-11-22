import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { withReadme, withDocs } from 'storybook-readme'; // eslint-disable-line import/no-extraneous-dependencies
import readme from './readme';
import stories from './stories';

storiesOf('Button', module)
    .add('General', withReadme(readme.general, stories.general))
    .add('Styles', withReadme(readme.styles, stories.styles))
    .add('Sizes', withReadme(readme.sizes, stories.sizes));
