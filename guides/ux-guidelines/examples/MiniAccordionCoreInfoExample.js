import React from 'react';
import { Col, Row } from '../../../lib/LayoutGrid';
import Headline from '../../../lib/Headline';
import KeyValue from '../../../lib/KeyValue';

export default function MiniAccordionCoreInfoExample() {
  return (
    <div>
      <Headline tag="h3" size="large" margin="small">Rosalyn Roman</Headline>
      <Row>
        <Col md={4}>
          <KeyValue label="Patron group" value="Faculty" />
        </Col>
        <Col md={4}>
          <KeyValue label="Status" value="Active" />
        </Col>
        <Col md={4}>
          <KeyValue label="Barcode" value="100000258" />
        </Col>
      </Row>
    </div>
  );
}
