import React from 'react';
import { action } from '@storybook/addon-actions';
import withReadme from 'storybook-readme/with-readme';
import { storiesOf } from '@storybook/react';
import readme from './readme.md';
import CheckboxFilter from './CheckboxFilter';

const options = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ge', label: 'German' },
  { value: 'it', label: 'Italian' },
];

const styles = { maxWidth: '300px' };

storiesOf('CheckboxFilter', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (
    <div style={styles}>
      <CheckboxFilter
        name="language"
        options={options}
        onChange={action}
      />
    </div>
  ))
  .add('With selected values', () => (
    <div style={styles}>
      <CheckboxFilter
        name="language"
        selectedValues={['en', 'fr']}
        options={options}
        onChange={action}
      />
    </div>
  ))
  .add('With readOnly option', () => (
    <div style={styles}>
      <CheckboxFilter
        name="language"
        selectedValues={['en', 'fr']}
        options={[
          { value: 'en', label: 'English', readOnly: true },
          { value: 'fr', label: 'French' },
          { value: 'ge', label: 'German' },
          { value: 'it', label: 'Italian' },
        ]}
        onChange={action}
      />
    </div>
  ))
  .add('With disabled option', () => (
    <div style={styles}>
      <CheckboxFilter
        name="language"
        options={[
          { value: 'en', label: 'English', disabled: true },
          { value: 'fr', label: 'French' },
          { value: 'ge', label: 'German' },
          { value: 'it', label: 'Italian' },
        ]}
        onChange={action}
      />
    </div>
  ));
