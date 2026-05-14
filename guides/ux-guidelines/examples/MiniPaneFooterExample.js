import React from 'react';
import Button from '../../../lib/Button';
import Pane from '../../../lib/Pane';
import PaneFooter from '../../../lib/PaneFooter';
import PaneHeader from '../../../lib/PaneHeader';
import Paneset from '../../../lib/Paneset';

export default function MiniPaneFooterExample() {
  const footer = (
    <PaneFooter
      renderStart={<Button>Cancel</Button>}
      renderEnd={<Button buttonStyle="primary">Save</Button>}
    />
  );

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="fill"
          footer={footer}
          renderHeader={(renderProps) => (
            <PaneHeader {...renderProps} paneTitle="Edit record" />
          )}
        >
          Form content
        </Pane>
      </Paneset>
    </div>
  );
}
