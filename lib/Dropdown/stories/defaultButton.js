import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

export default class defaultButton extends Component {
  renderMenu = ({ onToggle }) => (
    <DropdownMenu
      data-role="menu"
      aria-label="available permissions"
      onToggle={this.onToggle}
    >
      <ul>
        <li><Button buttonStyle="dropdownItem">First option does not close menu</Button></li>
        <li><Button buttonStyle="dropdownItem" onClick={onToggle}>Second option does!</Button></li>
      </ul>
    </DropdownMenu>
  );

  render() {
    return (
      <Dropdown
        label="DropdownButton default"
        renderMenu={this.renderMenu}
      />
    );
  }
}
