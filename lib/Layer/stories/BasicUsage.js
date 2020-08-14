/**
 * Layer -> Basic usage
 */

import React, { useState } from 'react';
import Paneset from '../../Paneset';
import Button from '../../Button';
import Pane from '../../Pane';
import Layer from '../Layer';

const BasicUsage = () => {
  const [showLayer, setShowLayer] = useState(false);
  const handleToggleLayer = () => setShowLayer(!showLayer);

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane defaultWidth="100%" paneTitle="Layer example">
          <Button onClick={handleToggleLayer}>Open layer</Button>
        </Pane>
        <Layer isOpen={showLayer} contentLabel="demonstration layer">
          <Paneset isRoot>
            <Pane defaultWidth="100%" paneTitle="Layer" dismissible onClose={handleToggleLayer}>
              This is a layer
            </Pane>
          </Paneset>
        </Layer>
      </Paneset>
    </div>
  );
};

export default BasicUsage;
