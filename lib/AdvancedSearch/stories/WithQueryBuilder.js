/**
 * AdvancedSearch: With query builder
 */

/* eslint-disable max-len */

import React, { useState } from 'react';
import { AdvancedSearch } from '..';
import Button from '../../Button';

const WithQueryBuilder = () => {
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

  const rowFormatter = (searchOption, rowQuery, bool, comparator) => {
    return `(${searchOption} ${comparator} ${rowQuery})`;
  };

  const queryBuilder = (rows, rowFormatterProp) => {
    const formatRowCondition = (row) => {
      return `${rowFormatterProp(row.searchOption, row.query, row.bool, 'equals')}`;
    };

    return rows.reduce((formattedQuery, row, index) => {
      const rowCondition = formatRowCondition(row);

      const boolMap = {
        and: '&&',
        or: '||',
        not: '!',
      };

      if (index === 0) {
        return rowCondition;
      }

      return `${formattedQuery} ${boolMap[row.bool]} ${rowCondition}`;
    }, '');
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
      >
        Advanced search
      </Button>
      <AdvancedSearch
        open={open}
        searchOptions={searchOptions}
        onSearch={onSearch}
        onCancel={onCancel}
        defaultSearchOptionValue="name"
        rowFormatter={rowFormatter}
        queryBuilder={queryBuilder}
      >
        {({ resetRows }) => (
          <Button
            onClick={resetRows}
          >
            Reset all
          </Button>
        )}
      </AdvancedSearch>
      <p>Query: <pre>{query}</pre></p>
    </>
  );
};

export default WithQueryBuilder;
