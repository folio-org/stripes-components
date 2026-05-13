import React from 'react';
import { StaticRouter } from 'react-router-dom';
import MetaSection from '../../../lib/MetaSection';

export default function MiniRecordMetadataExample() {
  return (
    <StaticRouter context={{}}>
      <MetaSection
        id="ux-mini-record-meta"
        contentId="ux-mini-record-meta-content"
        headingLevel={4}
        createdDate="2026-04-10"
        lastUpdatedDate="2026-04-20"
        showUserLink
        createdBy={{
          id: 'u-1001',
          personal: {
            firstName: 'Ari',
            lastName: 'Cole',
          },
        }}
        lastUpdatedBy={{
          personal: {
            firstName: 'Sam',
            lastName: 'Nguyen',
          },
        }}
      />
    </StaticRouter>
  );
}
