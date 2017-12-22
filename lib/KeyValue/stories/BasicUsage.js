import React from 'react';
import { Row, Col } from '../../LayoutGrid';
import KeyValue from '../KeyValue';

const BasicUsage = () => (
  <div style={{ padding: '15px' }}>
    <Row>
      <Col md={2}>
        <KeyValue
          label="Name"
          value="Johnny Cash"
        />
      </Col>
      <Col md={2}>
        <KeyValue
          label="Birtday"
          value="February 26, 1932"
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
        <KeyValue
          label="Occupation"
          value="Singer-songwriter guitarist actor author"
        />
      </Col>
      <Col md={2}>
        <KeyValue
          label="Genres"
          value="Country rock and roll folk gospel"
        />
      </Col>
      <Col md={2}>
        <KeyValue
          label="Instruments"
          value="Vocals guitar"
        />
      </Col>
    </Row>
  </div>
);

export default BasicUsage;
