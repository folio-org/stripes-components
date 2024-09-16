/**
 * Selection basic usage
 */

import React from 'react';
import Selection from '../Selection';

const eastCountries = [
  { value: 'AU', label: 'Australia' },
  { value: 'CN', label: 'China' },
  { value: 'DK', label: 'Denmark' },
  { value: 'SE', label: 'Sweden' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' }
];

const westCountries = [
  { value: 'US', label: 'United States' },
  { value: 'MX', label: 'Mexico' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CA', label: 'Canada' }
];

const groupedOptions = [
  {label: 'All countries', value: 'ALL'},
  {
    label: 'Eastern hemisphere',
    options: eastCountries,
  },
  {
    label: 'Western hemisphere',
    options: westCountries
  },
  {label: 'Antarctica', value: 'AQ'},
];

export default () => (
  <div>
    <Selection
      name="SelectionCountry"
      label="Country"
      id="countrySelect"
      placeholder="Select country"
      dataOptions={groupedOptions}
    />
    <Selection
      name="SelectionCountryDisabled"
      label="Country (disabled)"
      id="countrySelectDisabled"
      placeholder="Select country"
      dataOptions={groupedOptions}
      disabled
    />
    <Selection
      name="SelectionCountryDisabled"
      label="Country (readonly)"
      id="countrySelectDisabled"
      value="AU"
      placeholder="Select country"
      dataOptions={groupedOptions}
      readOnly
    />
    <Selection
      name="SelectionCountryDisabled"
      label="Country (required)"
      id="countrySelectDisabled"
      placeholder="Select country"
      dataOptions={groupedOptions}
      required
    />
    <br />
    <br />
    <Selection
      name="SelectionCountryDisabled"
      aria-label="Country aria label"
      id="countrySelectAriaLabelled"
      placeholder="Select country with non-visible label (via aria-label)"
      dataOptions={groupedOptions}
      required
    />
    <h2 id="myownlabel">My own label</h2>
    <Selection
      name="SelectionCountryDisabled"
      aria-labelledby="myownlabel"
      id="countrySelectLabelledby"
      placeholder="Select country"
      dataOptions={groupedOptions}
      required
    />
  </div>
);
