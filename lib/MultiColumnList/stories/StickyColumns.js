import React from 'react';
import { syncGenerate } from './service';
import MCLHarness from '../tests/MCLHarness';

export default () => (
  <div style={{ width: '1404px' }}>
    <MCLHarness
      onNeedMore={() => syncGenerate(30)}
      columns={['name', 'email', 'phone', 'id', 'status']}
      onNeedMoreData={null}
      stickyLastColumn
      stickyFirstColumn
      columnMapping={{
        phone: 'phone all the way home'
      }}
    />
  </div>
);
