/**
 * MenuSection basic usage
 */

import React from 'react';
import MenuSection from '../MenuSection';
import Checkbox from '../../Checkbox';
import RadioButton from '../../RadioButton';
import Icon from '../../Icon';
import Button from '../../Button';

const BasicUsage = () => (
  <>
    <MenuSection label="Layout">
      <RadioButton name="layout" label="Automatic layout" />
      <RadioButton name="layout" label="Always use table layout" />
      <RadioButton name="layout" label="Always use cards layout" />
    </MenuSection>
    <MenuSection label="Columns">
      <Checkbox label="Name" />
      <Checkbox label="Barcode" />
      <Checkbox label="Patron Group" />
      <Checkbox label="Username" />
      <Checkbox label="Email" />
    </MenuSection>
    <MenuSection label="Actions">
      <Button buttonStyle="dropdownItem">
        <Icon icon="trash">Delete</Icon>
      </Button>
      <Button buttonStyle="dropdownItem">
        <Icon icon="edit">Batch edit</Icon>
      </Button>
      <Button buttonStyle="dropdownItem">
        <Icon icon="bookmark">Bookmark</Icon>
      </Button>
      <Button buttonStyle="dropdownItem">
        <Icon icon="duplicate">Duplicate</Icon>
      </Button>
    </MenuSection>
  </>
);

export default BasicUsage;
