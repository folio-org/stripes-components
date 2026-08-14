import React, { useRef, useState } from 'react';
import FilterPaneSearch from '../../../lib/FilterPaneSearch';

export default function MiniFilterPaneSearchExample() {
  const [value, setValue] = useState('');
  const resultsRef = useRef(null);

  return (
    <div style={{ width: '150px', height: '40px', margin: '1rem', position: 'relative' }}>
      <FilterPaneSearch
        searchFieldId="ux-filter-pane-search"
        clearSearchId="ux-filter-pane-search-clear"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue('')}
        searchAriaLabel="Search records"
        resultsList={resultsRef}
      />
      <div ref={resultsRef} tabIndex="-1" style={{ marginTop: '0.5rem' }}>
        Results area
      </div>
    </div>
  );
}
