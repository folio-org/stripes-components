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
    <label id="wannabe-label">Wants to label</label>
    <Selection
      name="SelectionCountry"
      aria-labelledby="wannabe-label"
      id="countrySelect"
      dataOptions={countriesOptions}
    />
    <Selection
      name="SelectionCountry"
      label="Country"
      id="countrySelect"
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
    <br />
    <br />
    <Selection
      name="SelectionCountryDisabled"
      aria-label="Country aria label"
      id="countrySelectAriaLabelled"
      placeholder="Select country with non-visible label (via aria-label)"
      dataOptions={countriesOptions}
      required
    />
    <h2 id="myownlabel">My own label</h2>
    <Selection
      name="SelectionCountryDisabled"
      aria-labelledby="myownlabel"
      id="countrySelectLabelledby"
      placeholder="Select country"
      dataOptions={countriesOptions}
      required
    />
  </div>
);
