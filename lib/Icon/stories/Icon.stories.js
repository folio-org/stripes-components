import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs';
import Readme from '../readme.md';
import AvailableIcons from './AvailableIcons';
import Contexts from './Contexts';
import IconWithLabel from './IconWithLabel';
import Icon from '../Icon';

storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add('Available Icons', () => <AvailableIcons />)
  .add('Contexts', () => <Contexts />)
  .add('Label', () => <IconWithLabel />)
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
