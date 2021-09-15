import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import AvailableIcons from './AvailableIcons';
import Contexts from './Contexts';
import CustomIcon from './CustomIcon';
import Styles from './Styles';
import IconWithLabel from './IconWithLabel';
import Icon from '../Icon';

storiesOf('Icon', module)
  .addDecorator(withReadme(readme))
  .add('Available Icons', () => <AvailableIcons />)
  .add('Custom icon', () => <CustomIcon />)
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
  ))
  .add('Styles', () => <Styles />);
