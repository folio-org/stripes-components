/**
 * Avatar: Basic Usage
 */

import React, { Component } from 'react';

import {
  Icon,
  Pagination,
} from '../../../';

import {
  Tree,
  TreeLevel,
} from '../index';

const InstanceRecord = ({ instance }) => ((
  <a
    href="https://google.com"
    style={{
      display: 'inline-block',
      verticalAlign: 'middle'
    }}
  >
    <Icon icon="source" />
    <span style={{ padding: '0 10px' }}>{instance.name}</span>
    <div style={{ margin: '5px 20px' }}>
      <Icon icon="profile" />
      <span>Edward Elgar, 2013</span>
      <Icon icon="bookmark" />
      <span>Print book</span>
    </div>
  </a>
));

const HoldingRecord = ({ holding }) => ((
  <a
    href="https://google.com"
    style={{
      display: 'inline-block',
      verticalAlign: 'middle'
    }}
  >
    <Icon icon="archive" />
    <span>Main library &gt; {holding.name}</span>
  </a>
));

const ItemRecord = ({ item }) => ((
  <div>
    <Icon icon="calendar" />
    <span>{item.name} - Available</span>
    <Icon icon="check-out" />
  </div>
));

const holdings = new Array(Math.floor(Math.random() * 100 + 100)).fill(0).map((_, hIndex) => ({
  id: hIndex,
  name: `holding ${hIndex}`,
  items: new Array(Math.floor(Math.random() * 50)).fill(0).map((_, iIndex) => ({
    id: iIndex,
    name: `item ${iIndex}`,
  })),
}));

const data = new Array(500).fill(0).map((_, index) => ({
  id: index,
  name: `instance ${index + 1}`,
  holdings: [],
}));

export default class BasicUsage extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        instances: data.slice(0, 10),
      },
      page: 0,
    };
  }

  loadData = () => {
    const { page } = this.state;

    this.setState({
      data: {
        instances: data.slice(page * 10, (page + 1) * 10),
      },
    });
  };

  handlePageChange = (page) => {
    this.setState({
      page: page.selected,
    }, () => this.loadData());
  };

  loadHoldingsForInstance = (instance) => {
    return new Promise((resolve) => {
      if (instance.holdings.length) {
        resolve();
      }

      setTimeout(() => {
        this.setState((state) => {
          resolve();
          return {
            data: {
              instances: state.data.instances.map((inst) => {
                if (inst.id === instance.id) {
                  return {
                    ...inst,
                    holdings,
                  };
                }

                return inst;
              }),
            },
          };
        });
      }, 1000);
    });
  };

  render() {
    return (
      <>
        <Tree
          data={this.state.data}
          childCollectionKey="instances"
        >
          <TreeLevel
            content={(instance) => <InstanceRecord instance={instance} />}
            childCollectionKey="holdings"
            loadChildren={this.loadHoldingsForInstance}
            totalChildren={1000}
          >
            <TreeLevel
              childCollectionKey="items"
              content={(holding) => <HoldingRecord holding={holding} />}
            >
              <TreeLevel
                content={(item) => <ItemRecord item={item} />}
              />
            </TreeLevel>
          </TreeLevel>
        </Tree>
        <Pagination
          pageCount={50}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}
