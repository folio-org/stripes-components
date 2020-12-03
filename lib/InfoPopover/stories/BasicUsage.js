/**
 * InfoPopover Basic Usage
 */

import React from 'react';
import InfoPopover from '../InfoPopover';

export default () => (
  <InfoPopover
    iconSize="medium"
    content={
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat libero cursus,
        dignissim dolor nec, tristique lectus. Donec eu cursus lacus, congue interdum ipsum.
      </div>
    }
    buttonLabel="Read more"
    buttonHref="https://wiki.folio.org/"
    buttonTarget="_blank"
  />
);
