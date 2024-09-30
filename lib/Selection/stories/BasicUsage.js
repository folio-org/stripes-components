/**
 * Selection basic usage
 */

import faker from 'faker';
import Selection from '../Selection';
import { syncGenerate } from '../../MultiColumnList/stories/service';


const hugeOptionsList = syncGenerate(3000, 0, () => {
  const item = faker.address.city();
  return { value: item, label: item };
});

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

export default () => {
  return (
    <div>
      <Selection
        name="SelectionCountry"
        label="Country Long List"
        id="countryLongSelect"
        placeholder="Select country"
        dataOptions={hugeOptionsList || []}
      />
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
        value="CN"
        readOnly
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
  )
};
