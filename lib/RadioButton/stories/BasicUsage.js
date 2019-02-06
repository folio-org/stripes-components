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
          name: 'option',
        },
        {
          label: 'Option 2 (disabled)',
          disabled: true,
          value: 'option_2',
          name: 'option',
        },
        {
          label: 'Option 3 (read only)',
          value: 'option_3',
          name: 'option',
          readOnly: true,
        },
        {
          label: 'Option 4 (required)',
          value: 'option_4',
          name: 'option',
          required: true,
        },
        {
          label: 'Option 5',
          value: 'option_5',
          name: 'option',
          error: '(with error)',
        },
      ],
    };
  }

  render() {
    const { selected, options } = this.state;
    return (
      <div>
        { options.map((option, i) => (
          <RadioButton
            key={i}
            error={option.error}
            name={option.name}
            checked={option.value === selected}
            onChange={() => { this.setState({ selected: option.value }); }}
            id={option.value}
            label={option.label}
            disabled={option.disabled}
            readOnly={option.readOnly}
            required={option.required}
          />
        )) }
        <br />
        <br />
        <RadioButton label="Inline Radio Button 1" name="inline" value="inline1" inline />
        <RadioButton label="Inline Radio Button 2" name="inline" value="inline1" inline />
        <RadioButton label="Inline Radio Button 3" name="inline" value="inline1" inline />
        <RadioButton label="Inline Radio Button 3" name="inline" value="inline1" inline readOnly />
      </div>
    );
  }
}
