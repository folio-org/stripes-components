import React from 'react';
import DropdownButton from '../DropdownButton';

export default class DropdownButtonHarness extends React.Component {
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
      <React.Fragment>
        <span data-test-other-content>Dropdown button:</span>
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
      </React.Fragment>
    );
  }
}
