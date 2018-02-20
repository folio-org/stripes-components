/**
 * List Component: Basic Usage
 */

import React from 'react';
import NavList from '../NavList';
import NavListSection from '../../NavListSection';

export default () => (
  <div style={{ padding: '15px' }}>
    <NavList>
      <NavListSection label="Settings" activeLink="#organization">
        <a href="#users">Users</a>
        <button>Items</button>
        <button>Check out</button>
        <a href="#organization">Organization</a>
        <button>Circulation</button>
      </NavListSection>
    </NavList>
  </div>
);
