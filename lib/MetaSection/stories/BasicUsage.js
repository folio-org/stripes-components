/**
 * MetaSection -> Basic Usage
 */

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import MetaSection from '../MetaSection';

const BasicUsage = () => (
  <StaticRouter context={{}}>
    <MetaSection
      id="meta-section-example"
      headerElement="h3"
      contentId="meta-section-example-content"
      createdDate="12/12/2019"
      lastUpdatedDate="12/12/2019"
      showUserLink
      createdBy={{
        id: '1234',
        personal: {
          firstName: 'Cutter',
          lastName: 'John',
        }
      }}
      lastUpdatedBy={{
        personal: {
          firstName: 'Oliver',
          lastName: 'Jones',
          middleName: 'Wendell',
        }
      }}
    />
  </StaticRouter>
);

export default BasicUsage;
