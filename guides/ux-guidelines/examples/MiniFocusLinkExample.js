import React, { useRef } from 'react';
import FocusLink from '../../../lib/FocusLink';

export default function MiniFocusLinkExample() {
  const targetRef = useRef(null);

  return (
    <div>
      <FocusLink target="#search-results-heading" showOnFocus>
        Skip to results heading
      </FocusLink>
      <div style={{ marginTop: '0.75rem' }}>
        <strong id="search-results-heading" ref={targetRef} tabIndex={-1}>Search results</strong>
      </div>
      <p style={{ marginTop: '0.5rem' }}>10 records found for your query.</p>
    </div>
  );
}
