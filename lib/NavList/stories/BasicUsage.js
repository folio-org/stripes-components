/**
 * List Component: Basic Usage
 */

import React from 'react';
import NavList from '../NavList';
import NavListSection from '../../NavListSection';

export default () => {
  return (
    <div style={{ padding: '15px' }}>
      <NavList>
        <NavListSection label="Settings" activeLink="#">
          <a href="#">Users</a>
          <button>Items</button>
          <button>Check out</button>
          <button>Organization</button>
          <button>Circulation</button>
        </NavListSection>
      </NavList>
    </div>
  );
};
