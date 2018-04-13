/**
 * Radio Button example
 */

import React from 'react';
import RadioButton from '../RadioButton';

export default class BasicUsage extends React.Component {
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
                name: option.value,
                checked: option.value === selected,
                onChange: () => { this.setState({ selected: option.value }); },
              }
            }
            id={option.value}
            label={option.label}
          />
        )) }
        <br /><br />
        <RadioButton label="Inline Radio Button 1" name="inline" value="inline1" inline />
        <RadioButton label="Inline Radio Button 2" name="inline" value="inline1" inline />
        <RadioButton label="Inline Radio Button 3" name="inline" value="inline1" inline />
      </div>
    );
  }
}
