import React from 'react';
import DropdownButton from '../DropdownButton';
import Dropdown from '../../Dropdown';
import DropdownMenu from '../../DropdownMenu';

export default class BasicUsage extends React.Component {
  constructor() {
    super();

    this.state = {
      isDropdownOpen: false,
    };
  }

  onDropdownToggle = () => {
    this.setState(({ isDropdownOpen }) => ({
      isDropdownOpen: !isDropdownOpen,
    }));
  }

  render() {
    return (
      <Dropdown
        open={this.state.isDropdownOpen}
        onToggle={this.onDropdownToggle}
      >
        <DropdownButton data-role="toggle">
          Toggle dropdown
        </DropdownButton>
        <DropdownMenu data-role="menu">
          <span>This is our dropdown</span>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
