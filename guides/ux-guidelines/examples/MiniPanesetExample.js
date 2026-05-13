import React from 'react';
import Pane from '../../../lib/Pane';
import PaneHeader from '../../../lib/PaneHeader';
import Paneset from '../../../lib/Paneset';

export default function MiniPanesetExample() {
  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="30%"
          renderHeader={(renderProps) => <PaneHeader {...renderProps} paneTitle="Filters" />}
        >
          Filter controls
        </Pane>
        <Pane
          defaultWidth="fill"
          renderHeader={(renderProps) => <PaneHeader {...renderProps} paneTitle="Results" />}
        >
          Results content
        </Pane>
      </Paneset>
    </div>
  );
}
