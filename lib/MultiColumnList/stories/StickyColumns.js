import React from 'react';
import MultiColumnList from '../MultiColumnList';
import Checkbox from '../../Checkbox';
import IconButton from '../../IconButton';
import { asyncGenerate, syncGenerate } from './service';
import { Actions } from '../../MultiSelection/stories/MultiSelection.stories';
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
