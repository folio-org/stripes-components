import React from 'react';
import Headline from '../../../lib/Headline';

export default function MiniHeadlineExample() {
  return (
    <div>
      <Headline tag="h3" size="large">Users</Headline>
      <Headline tag="h4" size="small" faded>
        Record summary
      </Headline>
    </div>
  );
}
