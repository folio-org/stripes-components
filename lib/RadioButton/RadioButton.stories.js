import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import RadioButton from './RadioButton';

class RadioButtonsExample extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: 'option_1',
      options: [
        {
          label: 'Option 1',
          value: 'option_1',
        },
        {
          label: 'Option 2',
          value: 'option_2',
        },
        {
          label: 'Option 3',
          value: 'option_3',
        },
        {
          label: 'Option 4',
          value: 'option_4',
        },
        {
          label: 'Option 5 (with error)',
          value: 'option_5',
          error: true,
        },
      ],
    };
  }
  render() {
    const { selected, options } = this.state;
    return (
      <div style={{ padding: '15px' }}>
        { options.map((option, i) => (
          <RadioButton
            key={i}
            error={option.error === true}
            input={
              {
                checked: option.value === selected,
                onChange: () => { this.setState({ selected: option.value }); },
              }
            }
            id={option.value}
            label={option.label}
          />
        )) }
      </div>
    );
  }
}

storiesOf('Radio Button', module)
  .add('Basic Usage', () => (<RadioButtonsExample />));
