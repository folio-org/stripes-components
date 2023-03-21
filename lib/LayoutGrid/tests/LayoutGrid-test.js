import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { including, HTML } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import { Grid, Row, Col } from '..';

function withList(testList) {
  return {
    match(actual) {
      const res = actual.filter((c, i) => !c.includes(testList[i]))
      return res.length === 0;
    },
    description() {
      return `classlist comparison: ${testList}`;
    }
  };
}

describe.only('Layout Grid', () => {
  beforeEach(async () => {
    await mount(
      <Grid id="grid-1">
        <Row id="row-1">
          <Col xs={12} sm={3} md={2} lg={1} id="col-1">test</Col>
          <Col xs={6} sm={12} md={12} id="col-2">test</Col>
          <Col xs={8} sm={6} id="col-3" className="test">test</Col>
        </Row>
      </Grid>
    )
  });

  it('applies correct classname to grid', () => HTML({id: 'grid-1', classList: withList(['container'])}).exists());
  it('applies correct classname to row', () => HTML({id: 'row-1', classList: withList(['row'])}).exists());
  it('applies correct classnames to first column', () => HTML({ id: 'col-1', classList: withList(['col-xs-12', 'col-sm-3', 'col-md-2', 'col-lg-1']) }).exists());
  it('applies correct classnames to second column', () => HTML({ id: 'col-2', classList: withList(['col-xs-6', 'col-sm-12', 'col-md-12']) }).exists());
  it('applies correct classnames to third column', () => HTML({ id: 'col-3', classList: withList(['col-xs-8', 'col-sm-6', 'test']) }).exists());
});
