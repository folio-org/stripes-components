import React, { Component } from 'react';
import ButtonGroup from '../ButtonGroup';
import Button from '../../Button';

export default class ButtonGroupBasicUsage extends Component {
  render() {
    return (
      <div>
        <ButtonGroup>
          <Button>Books</Button>
          <Button>Records</Button>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <Button>Books</Button>
          <Button>Records</Button>
          <Button>CDs</Button>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <Button>Books</Button>
          <Button>Records</Button>
          <Button>CDs</Button>
          <Button>VHS</Button>
        </ButtonGroup>
        <ButtonGroup
          fullWidth
          tagName="nav"
        >
          <Button>Books</Button>
          <Button>Records</Button>
          <Button>CDs</Button>
          <Button>VHS</Button>
          <Button>LaserDisc</Button>
        </ButtonGroup>
      </div>
    );
  }
}
