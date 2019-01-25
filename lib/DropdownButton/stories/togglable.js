import React from 'react';
import DropdownButton from '../DropdownButton';

export default class Togglable extends React.Component {
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
      <DropdownButton
        open={this.state.isDropdownOpen}
        onToggle={this.onDropdownToggle}
        buttonContent="Toggle Dropdown"
      >
        <ul>
          <li>This is</li>
          <li>content</li>
          <li>of our dropdown</li>
        </ul>
      </DropdownButton>
    );
  }
}
