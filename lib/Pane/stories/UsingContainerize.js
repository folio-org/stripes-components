/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import Button from '../../Button';
import TextField from '../../TextField';
import TextArea from '../../TextArea';
import PaneMenu from '../../PaneMenu';
import Select from '../../Select';
import { Row, Col } from '../../LayoutGrid';

const UsingContainerize = () => (
  <div style={{ margin: '-1rem' }}>
    <Paneset>
      <Pane
        containerize
        defaultWidth="fill"
        paneTitle="Personal details"
        lastMenu={
          <PaneMenu>
            <Button marginBottom0 buttonStyle="primary">
              Save
            </Button>
          </PaneMenu>
        }
      >
        <Row>
          <Col xs={12} md={6} lg={3}>
            <TextField
              label="First name"
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <TextField
              label="Last name"
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Select label="Gender" placeholder="Select gender" defaultValue="">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <TextField
              label="City"
            />
          </Col>
          <Col xs={12}>
            <TextArea rows={5} label="Bio" />
          </Col>
        </Row>
      </Pane>
    </Paneset>
  </div>
);

export default UsingContainerize;
