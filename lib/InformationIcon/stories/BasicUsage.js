/**
 * InformationIcon Basic Usage
 */

import React from 'react';
import InformationIcon from '../InformationIcon';

export default () => (
  <div style={{ padding: '15px' }}>
    <InformationIcon
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat libero cursus, dignissim dolor nec, tristique lectus. Donec eu cursus lacus, congue interdum ipsum. "
      buttonLabel="Read more"
      buttonHref="https://wiki.folio.org/"
    />
  </div>
);
