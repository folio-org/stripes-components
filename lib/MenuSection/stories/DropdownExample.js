/**
 * MenuSection -> Dropdown Example
 */

import React, { Component } from 'react';
import Dropdown from '../../Dropdown';
import DropdownMenu from '../../DropdownMenu';
import Button from '../../Button';

import BasicUsage from './BasicUsage';

class MenuInContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <Dropdown
        id="AddPermissionDropdown"
        onToggle={() => this.setState(state => ({ open: !state.open }))}
        open={this.state.open}
      >
        <Button
          data-role="toggle"
          aria-haspopup="true"
        >
          Toggle Menu
        </Button>
        <DropdownMenu
          data-role="menu"
        >
          <BasicUsage />
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default MenuInContext;
