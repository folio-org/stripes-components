/**
 * Avatar: Basic Usage
 */

import React, { Component, createRef } from 'react';
import Tooltip from '../Tooltip';
import TextField from '../../TextField';
import IconButton from '../../IconButton';
import Button from '../../Button';

export default class BasicUsage extends Component {
  constructor(props) {
    super(props);
    this.triggerRef = createRef(null);
  }

  render() {
    return (
      <div>
        {
          /*
            Option 1: Use an external ref.
            Note: The <Tooltip> should be placed after the toggle
          */
        }
        <IconButton
          icon="edit"
          ref={this.triggerRef}
          aria-labelledby="tooltip-example-1-text tooltip-example-1-sub"
        />
        <Tooltip
          text="Edit record"
          sub="CMD+E"
          triggerRef={this.triggerRef}
          id="tooltip-example-1"
        />

        { /* Option 2: Use internal ref passed via. render function */ }
        <Tooltip
          text="Delete record"
          sub="CMD+D"
          id="tooltip-example-2"
        >
          {props => (
            <IconButton
              icon="trash"
              {...props}
            />
          )}
        </Tooltip>
        <br />
        <br />
        <Tooltip
          text="Show all notifications"
          sub="CMD + N"
          id="tooltip-example-3"
        >
          {({ ref, ...rest }) => (
            <Button buttonRef={ref} {...rest}>
              Notifications
            </Button>
          )}
        </Tooltip>
        <br />
        <br />
        <Tooltip
          text="Enter your first name"
          id="tooltip-example-4"
          placement="bottom-start"
        >
          {triggerProps => (
            <TextField
              id="example-text-field"
              text="Name"
              inputRef={triggerProps.ref}
              aria-describedby={triggerProps['aria-describedby']}
            />
          )}
        </Tooltip>
      </div>
    );
  }
}
