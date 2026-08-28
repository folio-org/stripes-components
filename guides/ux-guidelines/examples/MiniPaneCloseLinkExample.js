import React from 'react';
import Pane from '../../../lib/Pane';
import PaneCloseLink from '../../../lib/PaneCloseLink';
import PaneHeader from '../../../lib/PaneHeader';
import PaneMenu from '../../../lib/PaneMenu';
import Paneset from '../../../lib/Paneset';
import { HashRouter } from 'react-router-dom';

export default function MiniPaneCloseLinkExample() {
  const firstMenu = (
    <PaneMenu>
      <PaneCloseLink href="#results" />
    </PaneMenu>
  );

  return (
    <HashRouter>
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
    </HashRouter>
  );
}
