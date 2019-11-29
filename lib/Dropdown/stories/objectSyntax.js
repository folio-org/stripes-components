import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

export default class Toggleable extends Component {
  render() {
    return (
      <Dropdown>
        {() => (
          {
            trigger: ({ getTriggerProps }) => (
              <Button
                {...getTriggerProps()}
              >
                If you must use a render function...
              </Button>
            ),
            menu: ({ onToggle }) => (
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
            )
          }
        )
        }
      </Dropdown>
    );
  }
}
