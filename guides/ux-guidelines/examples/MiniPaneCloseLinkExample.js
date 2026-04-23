import React from 'react';
import Pane from '../../../lib/Pane';
import PaneCloseLink from '../../../lib/PaneCloseLink';
import PaneHeader from '../../../lib/PaneHeader';
import PaneMenu from '../../../lib/PaneMenu';
import Paneset from '../../../lib/Paneset';

export default function MiniPaneCloseLinkExample() {
  const firstMenu = (
    <PaneMenu>
      <PaneCloseLink href="#results" />
    </PaneMenu>
  );

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="fill"
          renderHeader={(renderProps) => (
            <PaneHeader
              {...renderProps}
              firstMenu={firstMenu}
              paneTitle="Detail view"
            />
          )}
        >
          Pane content
        </Pane>
      </Paneset>
    </div>
  );
}
