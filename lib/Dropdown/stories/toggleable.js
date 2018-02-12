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

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    const isOpen = this.state.dropdownOpen;
    this.setState({
      dropdownOpen: !isOpen,
    });
  }

  render() {
    return (
      <Dropdown
        open={this.state ? this.state.dropdownOpen : false}
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
