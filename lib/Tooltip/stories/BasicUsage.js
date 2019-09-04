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
          aria-labelledby="tooltip-example-1-label tooltip-example-1-shortcut"
        />
        <Tooltip
          label="Edit record"
          shortcut="CMD+E"
          triggerRef={this.triggerRef}
          id="tooltip-example-1"
        />

        { /* Option 2: Use internal ref passed via. render function */ }
        <Tooltip
          label="Delete record"
          shortcut="CMD+D"
          id="tooltip-example-2"
        >
          {props => (
            <IconButton
              icon="trash"
              {...props}
            />
          )}
        </Tooltip>
        <br /><br />
        <Tooltip
          label="Show all notifications"
          shortcut="CMD + N"
          id="tooltip-example-3"
        >
          {({ ref, ...rest }) => (
            <Button buttonRef={ref} {...rest}>
              Notifications
            </Button>
          )}
        </Tooltip>
        <br /><br />
        <Tooltip
          label="Enter your first name"
          id="tooltip-example-4"
          placement="bottom-start"
        >
          {triggerProps => (
            <TextField
              id="example-text-field"
              label="Name"
              inputRef={triggerProps.ref}
              aria-describedby={triggerProps['aria-describedby']}
            />
          )}
        </Tooltip>
      </div>
    );
  }
}
