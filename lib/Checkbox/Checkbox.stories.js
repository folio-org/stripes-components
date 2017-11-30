import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Checkbox from './Checkbox';

class CheckboxExample extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: 'option_1',
      options: [
        {
          label: 'Option 1',
          value: 'option_1',
          input: {
            onChange: () => {},
            onFocus: () => {},
            onBlur: () => {},
          },
          meta: {},
        },
        {
          label: 'Option 2',
          value: 'option_2',
          input: {
            onChange: () => {},
            onFocus: () => {},
            onBlur: () => {},
          },
          meta: {},
        },
        {
          label: 'Option 3 (Controlled input - can only be changed by adding onChange handler)',
          value: 'option_3',
          input: {
            checked: true,
            onChange: () => {},
            onFocus: () => {},
            onBlur: () => {},
          },
        },
        {
          label: 'Option 4 (with error)',
          value: 'option_4',
          meta: {
            error: 'Validation error!',
            warning: 'We also have warning?',
            touched: true,
          },
        },
        {
          label: 'Option 5 (with warning)',
          value: 'option_5',
          input: {
            onChange: () => {},
            onFocus: () => {},
            onBlur: () => {},
          },
          meta: {
            warning: 'Validation warning!',
            touched: true,
          },
        },
      ],
    };
  }

  render() {
    const { options } = this.state;
    return (
      <div style={{ padding: '15px' }}>
        { options.map(option => (
          <Checkbox
            onChange={() => {}}
            input={option.input}
            key={option.value}
            id={option.value}
            label={option.label}
            meta={option.meta}
          />
        )) }
        <br /><br />
        <Checkbox inline id="inline-input" /> Here is an inline checkbox with text outside. Clicking the text will not toggle the checkbox.
        <br /><br />
        <label htmlFor="inline-input2">
          <Checkbox inline id="inline-input2" /> Here is an inline checkbox with text outside wrapped in label-tag.Clicking text will toggle the checkbox.
        </label>
      </div>
    );
  }
}

storiesOf('Checkbox', module)
  .add('Basic Usage', () => (<CheckboxExample />));
