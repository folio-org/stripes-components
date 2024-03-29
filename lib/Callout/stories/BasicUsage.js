/**
 * Callout: Basic Usage
 */

import React, { Component, createRef } from 'react';
import Callout from '../Callout';
import Button from '../../Button';
import TextField from '../../TextField';
import Select from '../../Select';

class BasicUsage extends Component {
  constructor(props) {
    super(props);
    this.callout = createRef();

    this.state = {
      message: 'Here is some message for the user',
      type: 'success',
      timeout: 6000,
    };
  }

  onClick = () => {
    const { type, message, timeout } = this.state;

    // Send callout
    this.callout.current.sendCallout({
      type,
      message,
      timeout: parseInt(timeout, 10),
    });
  }

  onChange = (name, e) => {
    this.setState({
      [name]: e.target.value,
    });
  }

  render() {
    const { message, type, timeout } = this.state;
    return (
      <div>
        <Callout ref={this.callout} />
        <Select
          label="Type"
          value={type}
          onChange={(e)=>this.onChange('type', e)}
        >
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </Select>
        <TextField
          label="Message"
          onChange={(e)=>this.onChange('message', e)}
          value={message}
        />
        <TextField
          label="Timeout"
          onChange={(e)=>this.onChange('timeout', e)}
          value={timeout}
          type="number"
        />
        <Button buttonStyle="primary" onClick={this.onClick}>
          Send callout
        </Button>
      </div>
    );
  }
}
export default BasicUsage;
