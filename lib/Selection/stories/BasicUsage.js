/**
 * Selection basic usage
 */

import { useState } from 'react';
import faker from 'faker';
import Selection from '../Selection';
import Button from '../../Button';
import { syncGenerate } from '../../MultiColumnList/stories/service';


const hugeOptionsList = syncGenerate(3000, 0, () => {
  const item = faker.address.city();
  return { value: item, label: item };
});

// the dataOptions prop takes an array of objects with 'label' and 'value' keys
const countriesOptions = [
  { value: '', label: 'blank' },
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
  const [value, setValue] = useState(null);

  const changeValue = (val) => {
    setValue(val);
  };

  return (
    <div>
    <Button onClick={() => changeValue('MX')}>Set Value to MX (Mexico)</Button>
    <Button onClick={() => changeValue('AU')}>Set Value to AU (Austrailia)</Button>
    <p>value: { value ? value : 'null' }</p>
      <Selection
        name="SelectionCountry"
        value={value}
        onChange={(value) => {setValue(value)}}
        label="Country"
        id="countrySelect"
        placeholder="Select country"
        dataOptions={countriesOptions}
      />
    </div>
  )
};
