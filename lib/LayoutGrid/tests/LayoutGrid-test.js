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

describe('Layout Grid', () => {
  beforeEach(async () => {
    await mount(
      <Grid>
        <Row>
          <Col xs={12} sm={3} md={2} lg={1} id="col-1">test</Col>
          <Col xs={12} sm={3} md={2} id="col-2">test</Col>
          <Col xs={12} sm={3} id="col-3" className="test">test</Col>
        </Row>
      </Grid>
    )
  });

  it('applies correct classnames to first column', () => HTML({ id: 'col-1', classList: withList(['col-xs', 'col-sm', 'col-md', 'col-lg']) }).exists());
  it('applies correct classnames to second column', () => HTML({ id: 'col-2', classList: withList(['col-xs', 'col-sm', 'col-md']) }).exists());
  it('applies correct classnames to third column', () => HTML({ id: 'col-3', classList: withList(['col-xs', 'col-sm', 'test']) }).exists());
});
