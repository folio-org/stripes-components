/**
 * Popover Basic Usage
 */

import React from 'react';
import Popover from '../Popover';
import Headline from '../../Headline';
import Button from '../../Button';

export default () => (
  <div style={{ textAlign: 'center' }}>
    <Headline>Default Popover</Headline>
    <Popover>
      <Button data-role="target">Open Popover</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <br /><br />
    <Headline>Position</Headline>
    <Popover position="top">
      <Button data-role="target">Top</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <Popover position="bottom">
      <Button data-role="target">Bottom</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <Popover position="start">
      <Button data-role="target">Start</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <Popover position="end">
      <Button data-role="target">End</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <br /><br />
    <Headline>Alignment</Headline>
    <Popover alignment="center">
      <Button data-role="target">Center</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <Popover alignment="start">
      <Button data-role="target">Start</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
    <Popover alignment="end">
      <Button data-role="target">End</Button>
      <p data-role="popover">Lorem ipsum delor sit amet...</p>
    </Popover>
  </div>
);
