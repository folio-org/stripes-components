/**
 * Avatar: Basic Usage
 */

import React, { Component } from 'react';

import {
  Icon,
} from '../../../';

import Tree from '../Tree';

const InstanceRecord = () => ((
  <div style={{
    display: 'inline-block',
    verticalAlign: 'middle'
  }}>
    <Icon icon="source" />
    <span style={{ padding: '0 10px' }}>Climate change and indigenous people</span>
    <div style={{ margin: '5px 20px' }}>
      <Icon icon="profile" />
      <span>Edward Elgar, 2013</span>
      <Icon icon="bookmark" />
      <span>Print book</span>
    </div>
  </div>
));

const HoldingRecord = () => ((
  <div style={{
    display: 'inline-block',
    verticalAlign: 'middle'
  }}>
    <Icon icon="archive" />
    <span>Main library &gt; K32.209</span>
  </div>
));

const ItemRecord = () => ((
  <div>
    <Icon icon="calendar" />
    <span>1234567 - Available</span>
    <Icon icon="check-out" />
  </div>
));

export default class BasicUsage extends Component {
  renderItemRecords = (Content, count) => {
    return new Array(count).fill(0).map(() => {
      return <Tree content={<Content />} />;
    });
  };

  render() {
    return (
      <>
        <Tree content={<InstanceRecord />}>
          <Tree content={<HoldingRecord />}>
            {this.renderItemRecords(ItemRecord, 100)}
          </Tree>
          <Tree content={<HoldingRecord />}>
            {this.renderItemRecords(ItemRecord, 3)}
          </Tree>
          <Tree content={<HoldingRecord />}>
            {this.renderItemRecords(ItemRecord, 1)}
          </Tree>
          <Tree content={<HoldingRecord />}>
            {this.renderItemRecords(ItemRecord, 6)}
          </Tree>
          <Tree content={<HoldingRecord />}>
            {this.renderItemRecords(ItemRecord, 50)}
          </Tree>
        </Tree>
      </>
    );
  }
}
