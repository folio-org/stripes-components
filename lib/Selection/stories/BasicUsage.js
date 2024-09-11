/**
 * Selection basic usage
 */

import React, { useState, useEffect, useRef } from 'react';
import faker from 'faker';
import Selection from '../Selection';
import { syncGenerate, asyncGenerate } from '../../MultiColumnList/stories/service';
import {asyncForEach, useProcessedData } from '../utils';


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

const processData = (items) => {
  return items.map((item) => item);
}

/* eslint-disable */
const TestComponent = ({ items }) => {
  const testRunFirst = useRef((data) => {
    return data.map((item) => item)
  });
  const { loading: loading1, result: result1 } = useProcessedData(items, testRunFirst.current);
  const { loading: loading2, result: result2 } = useProcessedData(result1, testRunFirst.current);
  const { loading: loading3, result: result3 } = useProcessedData(result2, testRunFirst.current);
  const { loading: loading4, result: result4 } = useProcessedData(result3, testRunFirst.current);
  const { loading: loading5, result: result5 } = useProcessedData(result4, testRunFirst.current);
  return (
    <>
    <label>Test component</label>
    <div style={{ display: 'block', height: '200px', backgroundColor: 'cyan', overflow: 'scroll' }}>
      <ul>
        {result5.map((item, i) => (
          <li key={JSON.stringify(item)}>
            <div>{item.label}</div>
            <div>{item.value}</div>
            <div>{i}</div>
          </li>
        ))}
      </ul>
    </div>
    </>

  )
}
/* eslint-enable */


export default () => {
  const { loading, result } = useProcessedData(hugeOptionsList, processData);
  if (loading) return null;
  return (
    <div>
      {/* <TestComponent
        items={result || []}
      /> */}
      <Selection
        name="SelectionCountry"
        label="Country Long List"
        id="countryLongSelect"
        placeholder="Select country"
        dataOptions={result || []}
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
