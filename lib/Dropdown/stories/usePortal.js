import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

export default class UsePortal extends Component {
  renderTrigger = ({ getTriggerProps }) => (
    <Button
      {...getTriggerProps()}
    >
      Using Portals (only within scrollable containers!)
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
        <li><Button buttonStyle="dropdownItem" onClick={onToggle}>Third</Button></li>
        <li><Button buttonStyle="dropdownItem" onClick={onToggle}>Fourth</Button></li>
        <li><Button buttonStyle="dropdownItem" onClick={onToggle}>Fifth</Button></li>
      </ul>
    </DropdownMenu>
  );

  renderList = () => {
    const res = [];
    let count = 1;
    while (count < 20) {
      res.push(
        <div key={count}>
          <Dropdown
            renderTrigger={this.renderTrigger}
            renderMenu={this.renderMenu}
            usePortal
          />
        </div>
      );
      count += 1;
    }
    return res;
  }

  render() {
    return (
      <div style={{ height: '400px' }}>
        <div style={{
          padding: '1rem',
          overflow: 'scroll',
          maxHeight: '150px',
          border: '1px solid #888',
          marginBottom: '100px'
        }}
        >
          { this.renderList() }
        </div>
      </div>
    );
  }
}
