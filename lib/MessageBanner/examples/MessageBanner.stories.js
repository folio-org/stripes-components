import { storiesOf } from '@storybook/react';
import BasicUsage from './BasicUsage';
import Dismissable from './Dismissable';
import readme from '../readme.md';

storiesOf('MessageBanner', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('Basic Usage', BasicUsage)
  .add('Dismissable', Dismissable);
