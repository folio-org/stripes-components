import React, { useState } from 'react';
import Button from '../../../lib/Button';
import Layer from '../../../lib/Layer';
import Pane from '../../../lib/Pane';
import PaneHeader from '../../../lib/PaneHeader';
import Paneset from '../../../lib/Paneset';

export default function MiniLayerExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="fill"
          renderHeader={(renderProps) => <PaneHeader {...renderProps} paneTitle="Main pane" />}
        >
          <Button onClick={() => setIsOpen(true)}>Open layer</Button>
        </Pane>
        <Layer isOpen={isOpen} contentLabel="Example layer" afterClose={() => setIsOpen(false)}>
          <Paneset isRoot>
            <Pane
              defaultWidth="fill"
              renderHeader={(renderProps) => (
                <PaneHeader {...renderProps} paneTitle="Layer" dismissible onClose={() => setIsOpen(false)} />
              )}
            >
              Layer content
            </Pane>
          </Paneset>
        </Layer>
      </Paneset>
    </div>
  );
}
