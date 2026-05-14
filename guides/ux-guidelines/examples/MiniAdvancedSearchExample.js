import React, { useState } from 'react';
import Button from '../../../lib/Button';
import AdvancedSearch from '../../../lib/AdvancedSearch';

const searchOptions = [
  { id: 'keyword', label: 'Keyword', value: 'keyword' },
  { id: 'title', label: 'Title', value: 'title' },
];

export default function MiniAdvancedSearchExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open advanced search</Button>
      <AdvancedSearch
        open={open}
        searchOptions={searchOptions}
        defaultSearchOptionValue="keyword"
        firstRowInitialSearch={{ option: 'keyword', query: 'global warming' }}
        onCancel={() => setOpen(false)}
        onSearch={() => setOpen(false)}
      />
    </div>
  );
}
