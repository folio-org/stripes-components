import React from 'react';
import ErrorBoundary from '../../../lib/ErrorBoundary';

export default function MiniErrorBoundaryExample() {
  return (
    <ErrorBoundary>
      <div>Wrapped content remains visible unless an error occurs.</div>
    </ErrorBoundary>
  );
}
