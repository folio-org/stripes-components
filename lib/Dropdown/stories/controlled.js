import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

export default class Controlled extends Component {
  constructor() {
    super();
    this.state = {
      dropdownOpen: false,
    };
  }

  onToggle = () => {
    this.setState((curState) => ({
      dropdownOpen: !curState.dropdownOpen,
    }));
  }

  renderTrigger = ({ getTriggerProps }) => (
    <Button
      {...getTriggerProps()}
    >
      Controlled dropdown
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
        open={this.state.dropdownOpen}
        onToggle={this.onToggle}
        renderTrigger={this.renderTrigger}
        renderMenu={this.renderMenu}
      />
    );
  }
}
