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
          onChange={e => this.changeValue(e, 'select-default')}
          value={this.state.selectedValues['select-default']}
          dataOptions={options}
          id="select-default"
        />
        <Select
          label="With valid styles"
          onChange={e => this.changeValue(e, 'select-with-valid-styles')}
          value={this.state.selectedValues['select-with-valid-styles']}
          dataOptions={options}
          touched
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
          touched
          id="select-with-warning-styles"
        />
        <Select
          label="With error styles"
          onChange={e => this.changeValue(e, 'select-with-error-styles')}
          value={this.state.selectedValues['select-with-error-styles']}
          dataOptions={options}
          error="Here is an error"
          touched
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
        <br />
        <Select
          label="Read only field"
          onChange={e => this.changeValue(e, 'select-readonly')}
          value={this.state.selectedValues['select-readonly']}
          dataOptions={options}
          placeholder="Here is a placeholder"
          readOnly
        />
        <br />
        <Select
          label="Disabled field"
          onChange={e => this.changeValue(e, 'disabled-field')}
          value={this.state.selectedValues['disabled-field']}
          id="disabled-select"
          dataOptions={options}
          placeholder="Here is a placeholder"
          disabled
        />
      </div>
    );
  }
}

export default BasicUsage;
