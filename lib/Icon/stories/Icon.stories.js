import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs';
import Readme from '../readme.md';
import stories from './index';
import Icon from '../';

storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <stories.BasicUsage />)
  .add('Statuses', () => (
    <div>
      <div>
        <pre><strong>success</strong></pre>
        <Icon size="large" icon="info" status="success" />
      </div>
      <div>
        <pre><strong>warn</strong></pre>
        <Icon size="large" icon="info" status="warn" />
      </div>
      <div>
        <pre><strong>error</strong></pre>
        <Icon size="large" icon="info" status="error" />
      </div>
    </div>
  ));
