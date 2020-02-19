/**
 * List Component: Basic Usage
 */

import React from 'react';
import NavList from '../NavList';
import NavListSection from '../../NavListSection';
import NavListItem from '../../NavListItem';

export default () => (
  <div>
    <NavList>
      <NavListSection label="Settings" activeLink="#organization">
        <NavListItem>Users</NavListItem>
        <NavListItem>Items</NavListItem>
        <NavListItem>Check out</NavListItem>
        <NavListItem href="#organization">Organization</NavListItem>
        <NavListItem>Circulation</NavListItem>
      </NavListSection>
    </NavList>
  </div>
);
