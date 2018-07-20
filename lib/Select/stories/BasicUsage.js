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
    />
    <br />
    <Select
      validStylesEnabled
      label="With valid styles"
      dataOptions={options}
      touched
      dirty
      valid
    />
    <br />
    <Select
      label="With warning styles"
      dataOptions={options}
      warning="Here is a warning"
      touched
    />
    <br />
    <Select
      label="With error styles"
      dataOptions={options}
      error="Here is an error"
      touched
    />
    <br />
    <Select
      label="Select your favorite snack"
      dataOptions={options}
      placeholder="Here is a placeholder"
      value=""
    />
  </div>
);

export default BasicUsage;
