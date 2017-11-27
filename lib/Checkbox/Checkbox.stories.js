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
          selected: false,
        },
        {
          label: 'Option 2',
          value: 'option_2',
          selected: false,
        },
        {
          label: 'Option 3',
          value: 'option_3',
          selected: false,
        },
        {
          label: 'Option 4',
          value: 'option_4',
        },
        {
          label: 'Option 5 (with error)',
          value: 'option_5',
          selected: false,
          error: true,
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
            key={option.value}
            id={option.value}
            label={option.label}
            meta={{
              error: option.error === true,
            }}
          />
        )) }
      </div>
    );
  }
}

storiesOf('Checkbox', module)
  .add('Basic Usage', () => (<CheckboxExample />));
