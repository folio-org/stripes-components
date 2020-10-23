/**
 * Avatar: Basic Usage
 */

import React, { Component, createRef } from 'react';
import { FormattedMessage } from 'react-intl';
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
    // Tooltip accepts either a `string` or a `<FormattedMessage>` for its sub and text props.
    const tipText = <FormattedMessage id="stripes-components.clearThisField" />;
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
          text={tipText}
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
          {({ ref, ariaIds }) => (
            <IconButton
              icon="trash"
              ref={ref}
              aria-labelledby={ariaIds.text}
              aria-describedby={ariaIds.sub}
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
          {({ ref, ariaIds }) => (
            <Button buttonRef={ref} aria-describedby={`${ariaIds.text} ${ariaIds.sub}`}>
              Notifications
            </Button>
          )}
        </Tooltip>
        <br />
        <br />
        <Tooltip
          text="Show all notifications"
          sub="CMD + N"
          id="tooltip-example-4"
          placement="top"
          hideOnTouch
        >
          {({ ref, ariaIds }) => (
            <Button buttonRef={ref} aria-describedby={`${ariaIds.text} ${ariaIds.sub}`}>
              Notifications (hide on touch)
            </Button>
          )}
        </Tooltip>
        <br />
        <br />
        <Tooltip
          text="Enter your first name"
          id="tooltip-example-5"
          placement="bottom-start"
        >
          {({ ref, ariaIds }) => (
            <TextField
              id="example-text-field"
              text="Name"
              inputRef={ref}
              label="Name"
              aria-describedby={ariaIds.text}
            />
          )}
        </Tooltip>
      </div>
    );
  }
}
