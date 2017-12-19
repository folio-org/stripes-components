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
        <NavListSection label="Settings" activeLink="#organization">
          <a>Users</a>
          <button>Items</button>
          <button>Check out</button>
          <a href="#organization">Organization</a>
          <button>Circulation</button>
        </NavListSection>
      </NavList>
    </div>
  );
};
