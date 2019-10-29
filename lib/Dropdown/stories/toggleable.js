import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

export default class Toggleable extends Component {
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

  render() {
    return (
      <Dropdown
        open={this.state.dropdownOpen}
        onToggle={this.onToggle}
      >
        <Button
          data-role="toggle"
          aria-haspopup="true"
        >
          Toggle Dropdown
        </Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available permissions"
          onToggle={this.onToggle}
        >
          <ul>
            <li>Example 1</li>
            <li>Example 2</li>
          </ul>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
