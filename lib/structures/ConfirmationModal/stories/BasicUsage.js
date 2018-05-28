/**
 * Confirmation Modal Example
 */

import React, { Component } from 'react';
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';

export default class ConfirmationModalExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }
  render() {
    return (
      <div>
        <ConfirmationModal
          open={this.state.open}
          heading="Please confirm!"
          message="Description of the thing that needs confirming"
        />
      </div>
    )
  }
}
