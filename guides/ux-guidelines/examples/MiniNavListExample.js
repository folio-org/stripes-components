import React from 'react';
import NavList from '../../../lib/NavList';
import NavListItem from '../../../lib/NavListItem';
import NavListSection from '../../../lib/NavListSection';

export default function MiniNavListExample() {
  return (
    <NavList>
      <NavListSection label="Settings" activeLink="#users" striped>
        <NavListItem href="#users">Users</NavListItem>
        <NavListItem href="#permissions">Permissions</NavListItem>
        <NavListItem href="#locations">Locations</NavListItem>
      </NavListSection>
    </NavList>
  );
}
