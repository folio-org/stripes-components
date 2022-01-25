/**
 * AdvancedSearch: Basic Usage
 */

/* eslint-disable max-len */

import React, { useState } from 'react';
import { AdvancedSearch } from '..';
import Button from '../../Button';

const BasicUsage = () => {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');

  const searchOptions = [{
    label: 'Keyword',
    value: 'keyword',
  }, {
    label: 'Name',
    value: 'name',
  }, {
    label: 'Surname',
    value: 'surname',
  }];

  const onSearch = (newQuery) => setQuery(newQuery);
  const onCancel = () => setOpen(false);

  return (
    <>
      <AdvancedSearch
        open={open}
        searchOptions={searchOptions}
        onSearch={onSearch}
        onCancel={onCancel}
        defaultSearchOptionValue="name"
      />
      <Button
        onClick={() => setOpen(true)}
      >
        Advanced search
      </Button>
      <p>Query: <pre>{query}</pre></p>
    </>
  );
};

export default BasicUsage;
