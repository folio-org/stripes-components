import React from 'react';
import DropdownButton from '../DropdownButton';
import { UncontrolledDropdown } from '../../Dropdown';
import DropdownMenu from '../../DropdownMenu';

const WithUncontrolledDropdown = () => (
  <UncontrolledDropdown>
    <DropdownButton data-role="toggle">
      Toggle dropdown
    </DropdownButton>
    <DropdownMenu data-role="menu">
      <span>This is our dropdown</span>
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default WithUncontrolledDropdown;
