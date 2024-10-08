/**
 * Selection basic usage
 */

import { useCallback, useState } from 'react';
import faker from 'faker';
import Selection from '../Selection';
import { syncGenerate, asyncGenerate } from '../../MultiColumnList/stories/service';


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



export default ({ filterSpy = () => {} }) => {
  const [data, setData] = useState(hugeOptionsList);
  const [empty, setEmpty] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (
    filter,
    // dataOptions
  ) => {
    setLoading(true);
    setData([]);
    if (filter) {
      const newData = await asyncGenerate(30, 0, 1000, false, () => {
        const item = faker.address.city();
        return { value: item, label: item };
      });
      filterSpy();
      setData(newData);
    }
    setLoading(false);
  };

  const handleFilterEmpty = async (filter) => {
    setLoading(true);
    setEmpty([]);
    if (filter) {
      const newData = await asyncGenerate(30, 0, 1000, false, () => {
        const item = faker.address.city();
        return { value: item, label: item };
      });
      filterSpy();
      setEmpty(newData);
    }
    setLoading(false);
  };

  return (
    <div>
      <Selection
        name="SelectionCountry"
        label="Country Long List"
        id="countryLongSelect"
        placeholder="Select country"
        dataOptions={data}
        asyncFilter
        onFilter={handleFilter}
        loading={loading}
      />
      <Selection
        name="SelectionCountry"
        label="Initially Empty List"
        id="countryLongSelectEmpty"
        placeholder="Select city"
        dataOptions={empty}
        asyncFilter
        onFilter={handleFilterEmpty}
        loading={loading}
      />
    </div>
  )
};
