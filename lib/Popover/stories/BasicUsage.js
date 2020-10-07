/**
 * Popover Basic Usage
 */

import React from 'react';
import Popover from '../Popover';
import Headline from '../../Headline';
import Button from '../../Button';
import { AVAILABLE_PLACEMENTS } from '../../Popper';

export default () => (
  <div style={{ textAlign: 'center' }}>
    <Headline>Default Popover</Headline>
    <Popover renderAnchor={({ toggle, ref }) => <Button onClick={toggle} ref={ref}>Open Popover</Button>}>
      Lorem ipsum delor sit amet...
    </Popover>
    <br />
    <br />
    <Headline>Placement</Headline>
    {AVAILABLE_PLACEMENTS.map(placement => {
      const renderAnchor = ({ toggle, ref }) => (
        <Button onClick={toggle} ref={ref}>
          {placement}
        </Button>
      );

      return (
        <div>
          <Popover
            placement={placement}
            renderAnchor={renderAnchor}
          >
            Lorem ipsum delor sit amet...
          </Popover>
        </div>
      );
    })}
  </div>
);
