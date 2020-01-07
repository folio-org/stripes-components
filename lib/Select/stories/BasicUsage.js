/**
 * Select: Basic Usage
 */

import React, { Component } from 'react';
import Select from '../Select';

const options = [
  {
    id: 'apples',
    value: 'Apples',
    label: 'Apples',
  },
  {
    id: 'bananas',
    value: 'Bananas',
    label: 'Bananas',
  },
  {
    id: 'oranges',
    value: 'Oranges',
    label: 'Oranges',
  },
  {
    id: 'strawberries',
    value: 'Strawberries',
    label: 'Strawberries',
  },
];

class BasicUsage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValues: {
        'select-readonly': 'Bananas',
      }
    };
  }

  changeValue = (e, selectId) => {
    const value = e.target.value;
    this.setState(state => ({
      selectedValues: {
        ...state.selectedValues,
        [selectId]: value,
      }
    }));
  }

  render() {
    return (
      <div>
        <Select
          label="Select your favorite snack"
          onChange={e => this.changeValue(e, 'select-required')}
          value={this.state.selectedValues['select-required']}
          dataOptions={options}
          id="select-required"
        />
        <Select
          label="Required field"
          onChange={e => this.changeValue(e, 'select-required')}
          value={this.state.selectedValues['select-required']}
          dataOptions={options}
          id="select-required"
          required
        />
        <Select
          label="With valid styles"
          onChange={e => this.changeValue(e, 'select-with-valid-styles')}
          value={this.state.selectedValues['select-with-valid-styles']}
          dataOptions={options}
          dirty
          valid
          validStylesEnabled
          id="select-with-valid-styles"
        />
        <Select
          label="With warning styles"
          onChange={e => this.changeValue(e, 'select-with-warning-styles')}
          value={this.state.selectedValues['select-with-warning-styles']}
          dataOptions={options}
          warning="Here is a warning"
          id="select-with-warning-styles"
        />
        <Select
          label="With error styles"
          onChange={e => this.changeValue(e, 'select-with-error-styles')}
          value={this.state.selectedValues['select-with-error-styles']}
          dataOptions={options}
          error="Here is an error"
          id="select-with-error-styles"
        />
        <Select
          label="Select your favorite snack"
          onChange={e => this.changeValue(e, 'select-with-placeholder')}
          value={this.state.selectedValues['select-with-placeholder']}
          dataOptions={options}
          placeholder="Here is a placeholder"
          id="select-with-placeholder"
        />
        <Select
          label="Read only field"
          onChange={e => this.changeValue(e, 'select-readonly')}
          value={this.state.selectedValues['select-readonly']}
          dataOptions={options}
          placeholder="Here is a placeholder"
          readOnly
        />
        <Select
          label="Disabled field"
          onChange={e => this.changeValue(e, 'disabled-field')}
          value={this.state.selectedValues['disabled-field']}
          id="disabled-select"
          dataOptions={options}
          placeholder="Here is a placeholder"
          disabled
        />
        <br />
        <span>Custom label via &quot;aria-labelledby&quot; prop</span>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="custom-label-select" id="customLabelId">Custom Label</label>
        <Select
          aria-labelledby="customLabelId"
          onChange={e => this.changeValue(e, 'disabled-field')}
          value={this.state.selectedValues['disabled-field']}
          id="custom-label-select"
          dataOptions={options}
          placeholder="Here is a placeholder"
        />
        <br />
        <span>Custom label via &quot;aria-label&quot; prop (not visible)</span>
        <br />
        <Select
          onChange={e => this.changeValue(e, 'disabled-field')}
          value={this.state.selectedValues['disabled-field']}
          id="custom-aria-label"
          dataOptions={options}
          placeholder="Here is a placeholder"
          aria-label="Custom aria label"
        />
      </div>
    );
  }
}

export default BasicUsage;
