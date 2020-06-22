/**
 * Radio Button example
 */

import React from 'react';
import RadioButton from '../RadioButton';
import Label from '../../Label';

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
        {
          label: 'Option 6',
          value: 'option_6',
          name: 'option',
          warning: '(with warning)',
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
            warning={option.warning}
          />
        )) }
        <br />
        <br />
        <RadioButton label="Inline Radio Button 1" name="inline" value="inline1" inline />
        <RadioButton label="Inline Radio Button 2" name="inline" value="inline2" inline />
        <RadioButton label="Inline Radio Button 3" name="inline" value="inline3" inline />
        <RadioButton label="Inline Radio Button 3" name="inline" value="inline4" inline readOnly />
        <br />
        <br />
        <br />
        <Label>
          Inline RadioButton without a label-prop:
        </Label>
        <RadioButton name="inline" value="inline5" inline />
      </div>
    );
  }
}
