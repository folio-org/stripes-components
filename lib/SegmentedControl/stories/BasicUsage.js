/**
 * SegmentedControl example
 */

import React, { Component } from 'react';
import SegmentedControl from '../SegmentedControl';
import Button from '../../Button';

class SegmentedControlBasicUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: 'books',
    };
  }
  handleActivate = ({ id }) => {
    this.setState({
      activeId: id,
    });
  }
  render() {
    return (
      <div style={{ padding: '15px' }}>
        <SegmentedControl activeId={this.state.activeId} onActivate={this.handleActivate}>
          <Button id="books">Books</Button>
          <Button id="records">Records</Button>
          <Button id="cds">CDs</Button>
        </SegmentedControl>
      </div>
    );
  }
}

export default SegmentedControlBasicUsage;
