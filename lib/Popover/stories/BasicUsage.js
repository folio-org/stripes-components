/**
 * Popover Basic Usage
 */

/* eslint-disable react/prop-types */

import React from 'react';
import Popover from '../Popover';
import Headline from '../../Headline';
import Button from '../../Button';
import { AVAILABLE_PLACEMENTS } from '../../Popper';

export default () => (
  <div style={{ textAlign: 'center' }}>
    <Headline>Default Popover</Headline>
    <Popover renderTrigger={({ toggle, ref }) => <Button onClick={toggle} ref={ref}>Open Popover</Button>}>
      Lorem ipsum delor sit amet...
    </Popover>
    <br />
    <br />
    <Headline>Placement</Headline>
    {AVAILABLE_PLACEMENTS.map(placement => {
      const renderTrigger = ({ toggle, ref }) => (
        <Button onClick={toggle} ref={ref}>
          {placement}
        </Button>
      );

      return (
        <div>
          <Popover
            placement={placement}
            renderTrigger={renderTrigger}
          >
            Lorem ipsum delor sit amet...
          </Popover>
        </div>
      );
    })}
  </div>
);
