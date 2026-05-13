import React from 'react';
import Highlighter from '../../../lib/Highlighter';

export default function MiniHighlighterExample() {
  return (
    <Highlighter
      searchWords={['invoice', 'error']}
      text="Last invoice had an error and needs review."
    />
  );
}
