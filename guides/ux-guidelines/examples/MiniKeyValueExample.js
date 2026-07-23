import React from 'react';
import { Col, Row } from '../../../lib/LayoutGrid';
import KeyValue from '../../../lib/KeyValue';

export default function MiniKeyValueExample() {
  return (
    <Row>
      <Col md={4}>
        <KeyValue label="Status" value="Open" />
      </Col>
      <Col md={4}>
        <KeyValue label="Type" value="Electronic resource" />
      </Col>
      <Col md={4}>
        <KeyValue label="Language" value="English" />
      </Col>
    </Row>
  );
}
