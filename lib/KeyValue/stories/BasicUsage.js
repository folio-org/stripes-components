import React from 'react';
import { Row, Col } from '../../LayoutGrid';
import KeyValue from '../KeyValue';

const BasicUsage = () => (
  <div>
    <Row>
      <Col md={2}>
        <KeyValue
          label="Name"
          value="Johnny Cash"
        />
      </Col>
      <Col md={2}>
        <KeyValue
          label="Birthday"
          value="February 26, 1932"
          sub="Kingsland, Arkansas, United States"
        />
      </Col>
      <Col md={2}>
        <KeyValue
          label="Years active"
          value="1954–2003"
        />
      </Col>
    </Row>
    <Row>
      <Col md={2}>
        <KeyValue label="Occupation">
          Singer-songwriter guitarist actor author
        </KeyValue>
      </Col>
      <Col md={2}>
        <KeyValue label="Genres">
          <span>Country rock and roll folk gospel</span>
        </KeyValue>
      </Col>
      <Col md={2}>
        <KeyValue label="Instruments">
          <span>Vocals guitar</span>
        </KeyValue>
      </Col>
    </Row>
  </div>
);

export default BasicUsage;
