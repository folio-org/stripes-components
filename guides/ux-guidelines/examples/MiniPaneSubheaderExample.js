import React from 'react';
import Pane from '../../../lib/Pane';
import PaneHeader from '../../../lib/PaneHeader';
import Paneset from '../../../lib/Paneset';
import PaneSubheader from '../../../lib/PaneSubheader';

export default function MiniPaneSubheaderExample() {
  const subheader = (
    <PaneSubheader>
      View level controls
    </PaneSubheader>
  );

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="fill"
          subheader={subheader}
          renderHeader={(renderProps) => (
            <PaneHeader {...renderProps} paneTitle="Record details" />
          )}
        >
          Pane content
        </Pane>
      </Paneset>
    </div>
  );
}
