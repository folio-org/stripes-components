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
      <NavListSection label="Settings" activeLink="#organization" stripped>
        <NavListItem>Users</NavListItem>
        <NavListItem>Items</NavListItem>
        <NavListItem>Check out</NavListItem>
        <NavListItem href="#organization">Organization</NavListItem>
        <NavListItem>Circulation</NavListItem>
      </NavListSection>
    </NavList>
    <br />
    <br />
    <NavList>
      <NavListSection label="NavList with icons" activeLink="#organization" stripped>
        <NavListItem icon="eye-open">View</NavListItem>
        <NavListItem icon="duplicate">Duplicate</NavListItem>
        <NavListItem icon="comment">Comment</NavListItem>
        <NavListItem icon="gear">Settings</NavListItem>
        <NavListItem icon="bookmark">Bookmark</NavListItem>
      </NavListSection>
    </NavList>
  </div>
);
