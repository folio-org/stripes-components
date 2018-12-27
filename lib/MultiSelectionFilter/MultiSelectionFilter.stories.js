import React from 'react';
import { action } from '@storybook/addon-actions';
import withReadme from 'storybook-readme/with-readme';
import { storiesOf } from '@storybook/react';
import readme from './readme.md';
import MultiSelectionFilter from './MultiSelectionFilter';

const options = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ge', label: 'German' },
  { value: 'it', label: 'Italian' },
];

const styles = { maxWidth: '300px' };


const renderAddTag = ({ filterValue, exactMatch }) => {
  if (exactMatch) {
    return null;
  } else {
    return (
      <div>
        Add tag for
        <strong>
          &quot;
          {`${filterValue}`}
          &quot;
        </strong>
      </div>
    );
  }
};

storiesOf('MultiSelectionFilter', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (
    <div style={styles}>
      <MultiSelectionFilter
        name="language"
        options={options}
        onChange={action}
      />
    </div>
  ))
  .add('With label', () => (
    <div style={styles}>
      <MultiSelectionFilter
        name="language"
        options={options}
        onChange={action}
        label="Languages"
      />
    </div>
  ))
  .add('With placeholder', () => (
    <div style={styles}>
      <MultiSelectionFilter
        name="language"
        options={options}
        onChange={action}
        placeholder="Choose a language!"
      />
    </div>
  ))
  .add('With selected value', () => (
    <div style={styles}>
      <MultiSelectionFilter
        name="language"
        selectedValues={['en']}
        options={options}
        onChange={action}
      />
    </div>
  ))
  .add('With custom formatter', () => (
    <div style={styles}>
      <MultiSelectionFilter
        name="language"
        selectedValues={['en']}
        options={options}
        onChange={action}
        formatter={({ option, searchTerm }) => `${option.label}(${option.value} )`}
      />
    </div>
  ));
