/**
 * LayoutGrid: Basic Usage
 */

import React from 'react';
import Headline from '../../Headline';
import Icon from '../../Icon';
import Button from '../../Button';
import { Row, Col } from '../index';
import css from './LayoutGridExample.css';

export default () => (
  <div>
    <Headline className={css.headline} size="x-large">Basic usage</Headline>
    <pre>
<Row>
  <Col className={css.col} xs={12} sm={3} md={2} lg={1}><div /></Col>
  <Col className={css.col} xs={6} sm={6} md={8} lg={10}><div /></Col>
  <Col className={css.col} xs={6} sm={3} md={2} lg={1}><div /></Col>
</Row>
<Row>
  <Col className={css.col} xs={12} sm={3} md={2} lg={4}><div /></Col>
  <Col className={css.col} xs={6} sm={6} md={8} lg={4}><div /></Col>
  <Col className={css.col} xs={6} sm={3} md={2} lg={4}><div /></Col>
</Row>
    </pre>
    <Row>
      <Col className={css.col} xs={12} sm={3} md={2} lg={1}>
        <div />
      </Col>
      <Col className={css.col} xs={6} sm={6} md={8} lg={10}>
        <div />
      </Col>
      <Col className={css.col} xs={6} sm={3} md={2} lg={1}>
        <div />
      </Col>
    </Row>
    <Row>
      <Col className={css.col} xs={12} sm={3} md={2} lg={4}>
        <div />
      </Col>
      <Col className={css.col} xs={6} sm={6} md={8} lg={4}>
        <div />
      </Col>
      <Col className={css.col} xs={6} sm={3} md={2} lg={4}>
        <div />
      </Col>
    </Row>

    <Headline className={css.headline} size="x-large">Auto width</Headline>
    <pre>
<Row>
  <Col className={css.col} xs><div /></Col>
  <Col className={css.col} xs><div /></Col>
</Row>
<Row>
  <Col className={css.col} xs><div /></Col>
  <Col className={css.col} xs><div /></Col>
  <Col className={css.col} xs><div /></Col>
</Row>
    </pre>
    <Row>
      <Col className={css.col} xs>
        <div />
      </Col>
      <Col className={css.col} xs>
        <div />
      </Col>
    </Row>
    <Row>
      <Col className={css.col} xs>
        <div />
      </Col>
      <Col className={css.col} xs>
        <div />
      </Col>
      <Col className={css.col} xs>
        <div />
      </Col>
    </Row>

    <Headline className={css.headline} size="x-large">Alignment</Headline>
    <pre>
<Row end="xs">
  <Col className={css.col} xs={6}><div>End</div></Col>
</Row>
<Row center="xs">
  <Col className={css.col} xs={6}><div>Centered</div></Col>
</Row>
<Row start="xs">
  <Col className={css.col} xs={6}><div>Start</div></Col>
</Row>
    </pre>
    <Row end="xs">
      <Col className={css.col} xs={6}>
        <div>
          End
        </div>
      </Col>
    </Row>
    <Row center="xs">
      <Col className={css.col} xs={6}>
        <div>
          Centered
        </div>
      </Col>
    </Row>
    <Row start="xs">
      <Col className={css.col} xs={6}>
        <div>
          Start
        </div>
      </Col>
    </Row>

    <Headline className={css.headline} size="x-large">Offsets</Headline>
    <pre>
<Row>
  <Col className={css.col} xsOffset={11} xs={1}><div /></Col>
  <Col className={css.col} xsOffset={10} xs={2}><div /></Col>
  <Col className={css.col} xsOffset={9} xs={3}><div /></Col>
  <Col className={css.col} xsOffset={8} xs={4}><div /></Col>
  <Col className={css.col} xsOffset={7} xs={5}><div /></Col>
  <Col className={css.col} xsOffset={6} xs={6}><div /></Col>
  <Col className={css.col} xsOffset={5} xs={7}><div /></Col>
  <Col className={css.col} xsOffset={4} xs={8}><div /></Col>
  <Col className={css.col} xsOffset={3} xs={9}><div /></Col>
  <Col className={css.col} xsOffset={2} xs={10}><div /></Col>
  <Col className={css.col} xsOffset={1} xs={11}><div /></Col>
</Row>
    </pre>
    <Row>
      <Col className={css.col} xsOffset={11} xs={1}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={10} xs={2}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={9} xs={3}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={8} xs={4}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={7} xs={5}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={6} xs={6}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={5} xs={7}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={4} xs={8}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={3} xs={9}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={2} xs={10}>
        <div />
      </Col>
      <Col className={css.col} xsOffset={1} xs={11}>
        <div />
      </Col>
    </Row>

    <Row center="xs">
      <Col className={css.col} xs={12}>
        <Button
          href="https://roylee0704.github.io/react-flexbox-grid"
          allowAnchorClick
          target="_blank"
          buttonStyle="primary"
          buttonClass={css.button}
        >
          <Icon icon="external-link" iconPosition="end">
            Click here to see more examples
          </Icon>
        </Button>
      </Col>
    </Row>
  </div>
);
