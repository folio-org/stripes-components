/**
 * Modal: Form Example
 */

import React, { Component } from 'react';
import Modal from '@folio/stripes-components/lib/Modal';
import ModalFooter from '@folio/stripes-components/lib/ModalFooter';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';

export default class ModalWithFormExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const footer = (
      <ModalFooter
        primaryButton={{
          label: 'Save',
          onClick: this.toggleModal,
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: this.toggleModal,
        }}
      />
    );

    return (
      <div style={{ padding: '15px' }}>
        <Button buttonStyle="primary" onClick={this.toggleModal}>Add contact</Button>
        <Modal
          wrappingElement="form"
          open={this.state.open}
          size="small"
          dismissible
          label="Create contact"
          onClose={this.toggleModal}
          footer={footer}
        >
          <TextField
            autoFocus
            label="Name"
          />
          <TextField
            label="Email"
            type="email"
          />
          <TextField
            label="Phone"
            type="tel"
          />
          <TextField
            label="Street"
          />
          <TextField
            label="City"
          />
          <TextField
            label="Zip"
          />
          <TextField
            label="Country"
          />
        </Modal>
      </div>
    );
  }
}
