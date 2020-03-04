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
    <br />
    <br />
    <NavList aria-label="example navigation list">
      <NavListSection activeLink="#organization" label="Using aria-label">
        <NavListItem>Users</NavListItem>
        <NavListItem>Items</NavListItem>
        <NavListItem>Check out</NavListItem>
        <NavListItem href="#organization">Organization</NavListItem>
        <NavListItem>Circulation</NavListItem>
      </NavListSection>
    </NavList>
  </div>
);
