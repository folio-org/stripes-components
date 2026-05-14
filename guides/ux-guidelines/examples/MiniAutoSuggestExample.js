import React, { useState } from 'react';
import AutoSuggest from '../../../lib/AutoSuggest';

const items = [
  { value: 'book', label: 'Book' },
  { value: 'cd', label: 'CD' },
  { value: 'ebook', label: 'eBook' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'audiobook', label: 'Audiobook' },
];

export default function MiniAutoSuggestExample() {
  const [value, setValue] = useState('ebook');

  return (
    <AutoSuggest
      items={items}
      renderOption={(item) => item?.label}
      renderValue={(item) => item?.label}
      label="Material type"
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
    />
  );
}
