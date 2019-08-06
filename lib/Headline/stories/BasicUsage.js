/**
 * Headline: Basic Usage
 */

import React from 'react';
import Headline from '../Headline';

const BasicUsage = () => (
  <div>
    <Headline size="small">
      Small Headline
    </Headline>
    <Headline size="medium">
      Medium Headline
    </Headline>
    <Headline size="large">
      Large Headline
    </Headline>
    <Headline size="x-large">
      X Large Headline
    </Headline>
    <Headline size="xx-large">
      XX Large Headline
    </Headline>
    <hr />
    <Headline size="large" margin="none" faded>
      Faded headline
    </Headline>
    <hr />
    <Headline size="medium" margin="small">
      Here is a nice medium headline with a small margin
    </Headline>
    <Headline size="small" faded tag="h3" aria-label="My headline">
      With a nice small faded non-bold sub headline
    </Headline>
    <hr />
    <Headline size="large" weight="regular">
      Regular font-weight
    </Headline>
    <Headline size="large" weight="medium">
      Medium font-weight
    </Headline>
    <Headline size="large" weight="bold">
      Bold font-weight
    </Headline>
    <Headline size="large" weight="black">
      Black font-weight
    </Headline>
  </div>
);

export default BasicUsage;
