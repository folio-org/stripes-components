/**
 * AutoSuggest: Basic Usage
 */

import React, { Component } from 'react';
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
    renderOption={item => item.label}
    renderValue={item => item.label}
    label="Select type"
    placeholder="Enter something here.."
    onChange={this.onChange}
  />
);