/**
 * Selection basic usage
 */

import React from 'react';
import Selection from '../Selection';

// the dataOptions prop takes an array of objects with 'label' and 'value' keys
const countriesOptions = [
  { value: 'AU', label: 'Australia' },
  { value: 'CN', label: 'China' },
  { value: 'DK', label: 'Denmark' },
  { value: 'MX', label: 'Mexico' },
  { value: 'SE', label: 'Sweden' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  // ...obviously there are more....
];

export default () => (
  <div>
    <Selection
      name="SelectionCountry"
      label="Country"
      id="countrySelect"
      placeholder="Select country"
      dataOptions={countriesOptions}
    />
    <Selection
      name="SelectionCountryDisabled"
      label="Country (disabled)"
      id="countrySelectDisabled"
      placeholder="Select country"
      dataOptions={countriesOptions}
      disabled
    />
    <Selection
      name="SelectionCountryDisabled"
      label="Country (readonly)"
      id="countrySelectDisabled"
      placeholder="Select country"
      dataOptions={countriesOptions}
      readonly
    />
    <Selection
      name="SelectionCountryDisabled"
      label="Country (required)"
      id="countrySelectDisabled"
      placeholder="Select country"
      dataOptions={countriesOptions}
      required
    />
  </div>
);
