import React from 'react';
import PaneMenu from '../../../lib/PaneMenu';
import PaneHeaderIconButton from '../../../lib/PaneHeaderIconButton';

export default function MiniPaneMenuExample() {
  return (
    <PaneMenu>
      <PaneHeaderIconButton icon="search" aria-label="Search" />
      <PaneHeaderIconButton icon="times" aria-label="Close" />
    </PaneMenu>
  );
}
