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
          label: 'Option 3',
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
      </div>
    );
  }
}

storiesOf('Checkbox', module)
  .add('Basic Usage', () => (<CheckboxExample />));
