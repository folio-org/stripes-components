import React from 'react';
import Pane from '../../../lib/Pane';
import PaneHeader from '../../../lib/PaneHeader';
import Paneset from '../../../lib/Paneset';

export default function MiniPaneExample() {
  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="30%"
          renderHeader={(renderProps) => (
            <PaneHeader {...renderProps} paneTitle="Search" paneSub="Filters" />
          )}
        >
          Pane content
        </Pane>
        <Pane
          defaultWidth="fill"
          renderHeader={(renderProps) => (
            <PaneHeader {...renderProps} paneTitle="Results" paneSub="84 records" />
          )}
        >
          Pane content
        </Pane>
      </Paneset>
    </div>
  );
}
