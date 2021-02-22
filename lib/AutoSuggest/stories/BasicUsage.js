/**
 * AutoSuggest: Basic Usage
 */

import React from 'react';
import AutoSuggest from '../AutoSuggest';

const items = [
  {
    value: 'book',
    label: 'Book',
  },
  {
    value: 'cd',
    label: 'CD',
  },
  {
    value: 'ebook',
    label: 'eBook',
  },
  {
    value: 'vinyl',
    label: 'Vinyl',
  },
  {
    value: 'audiobook',
    label: 'Audiobook',
  },
];

export default () => (
  <AutoSuggest
    items={items}
    renderOption={item => item?.label}
    renderValue={item => item?.label}
    label="Enter type"
  />
);
