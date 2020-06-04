/**
 * TextField: Basic Usage
 */

import React from 'react';
import TextField from '../TextField';
import Timepicker from '../../Timepicker';
import Datepicker from '../../Datepicker';
import Icon from '../../Icon';
import Button from '../../Button';
import { Row, Col } from '../../LayoutGrid';

const BasicUsage = () => (
  <div>
    <Row>
      <Col sm={3}>
        <TextField
          label="Field with label"
          placeholder="Placeholder Text"
        />
      </Col>
      <Col sm={3}>
        <Timepicker
          timeZone="utc"
          label="Field with label"
        />
      </Col>
      <Col sm={3}>
        <Datepicker
          timeZone="utc"
          label="Field with label"
        />
      </Col>
      <Col sm={3}>
        <TextField
          label="Field end"
          placeholder="Placeholder Text"
        />
      </Col>
    </Row>
    
    <div id="myLabel">TaxtField</div>
    <TextField
      aria-labelledby="myLabel"
      placeholder="Aria-labelledby Text"
    />
    <form>
      <TextField
        label="Required field"
        placeholder="Placeholder Text"
        required
      />
      <Button type="submit">Submit</Button>
    </form>
    <hr />
    <TextField
      value="This field can't be changed"
      label="Read only field"
      readOnly
    />
    <TextField
      value="This field is required"
      label="Required field"
      required
    />
    <TextField
      value="This field is disabled"
      label="Disabled field"
      disabled
    />
    <TextField
      validStylesEnabled
      value="Good value"
      label="Field with validation success"
      valid
      dirty
    />
    <TextField
      label="Field with a validation error"
      value="Wrong value.."
      error="Here is an error message"
    />
    <TextField
      label="Field with validation warning"
      value="Not entirely valid value.."
      warning="Here is a warning"
    />
    <TextField
      label="Loading field"
      placeholder="Check out the spinner!"
      loading
    />
    <TextField
      label="Field with startControl and endControl props"
      startControl={<Icon icon="search" />}
      endControl={<Icon icon="trash" />}
    />
  </div>
);

export default BasicUsage;
