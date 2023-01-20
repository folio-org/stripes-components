import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

export default class Toggleable extends Component {
  renderTrigger = ({ getTriggerProps }) => (
    <Button
      {...getTriggerProps()}
    >
      Dropdown
    </Button>
  );

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
        renderTrigger={this.renderTrigger}
        renderMenu={this.renderMenu}
      />
    );
  }
}
