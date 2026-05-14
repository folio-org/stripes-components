import React from 'react';
import Button from '../../../lib/Button';
import Icon from '../../../lib/Icon';
import MenuSection from '../../../lib/MenuSection';

export default function MiniMenuSectionExample() {
  return (
    <MenuSection label="Actions">
      <Button buttonStyle="dropdownItem">
        <Icon icon="edit">Edit</Icon>
      </Button>
      <Button buttonStyle="dropdownItem">
        <Icon icon="duplicate">Duplicate</Icon>
      </Button>
    </MenuSection>
  );
}
