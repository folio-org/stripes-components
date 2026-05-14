import React, { useState } from 'react';
import FilterGroups, { initialFilterState } from '../../../lib/FilterGroups';

const config = [
  {
    label: 'Format',
    name: 'format',
    cql: 'materialType',
    values: ['Book', 'Video'],
  },
  {
    label: 'Status',
    name: 'status',
    cql: 'status.name',
    values: ['Available', 'Checked out'],
  },
];

export default function MiniFilterGroupsExample() {
  const [filters, setFilters] = useState(initialFilterState(config, null));

  const onChangeFilter = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const onClearFilter = (name) => {
    setFilters((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${name}.`)) next[key] = false;
      });
      return next;
    });
  };

  return (
    <FilterGroups
      config={config}
      filters={filters}
      onChangeFilter={onChangeFilter}
      onClearFilter={onClearFilter}
    />
  );
}
