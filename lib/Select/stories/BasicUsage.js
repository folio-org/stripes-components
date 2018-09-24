/**
 * Select: Basic Usage
 */

import React from 'react';
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

const BasicUsage = () => (
  <div>
    <Select
      label="Select your favorite snack"
      dataOptions={options}
      id="select-default"
    />
    <br />
    <Select
      validStylesEnabled
      label="With valid styles"
      dataOptions={options}
      touched
      dirty
      valid
      id="select-with-valid-styles"
    />
    <br />
    <Select
      label="With warning styles"
      dataOptions={options}
      warning="Here is a warning"
      touched
      id="select-with-warning-styles"
    />
    <br />
    <Select
      label="With error styles"
      dataOptions={options}
      error="Here is an error"
      touched
      id="select-with-error-styles"
    />
    <br />
    <Select
      label="Select your favorite snack"
      dataOptions={options}
      placeholder="Here is a placeholder"
      value=""
      id="select-with-placeholder"
    />
    <br />
    <Select
      label="Read only field"
      dataOptions={options}
      placeholder="Here is a placeholder"
      value=""
      readOnly
    />
    <br />
    <Select
      label="Disabled field"
      dataOptions={options}
      placeholder="Here is a placeholder"
      value=""
      disabled
    />
  </div>
);

export default BasicUsage;
