/**
 * Avatar: Basic Usage
 */

import React, { Component } from 'react';

import {
  Icon,
  Pagination,
} from '../../../';

import Tree from '../Tree';

const InstanceRecord = ({ instance }) => ((
  <div style={{
    display: 'inline-block',
    verticalAlign: 'middle'
  }}>
    <Icon icon="source" />
    <span style={{ padding: '0 10px' }}>{instance.name}</span>
    <div style={{ margin: '5px 20px' }}>
      <Icon icon="profile" />
      <span>Edward Elgar, 2013</span>
      <Icon icon="bookmark" />
      <span>Print book</span>
    </div>
  </div>
));

const HoldingRecord = ({ holding }) => ((
  <div style={{
    display: 'inline-block',
    verticalAlign: 'middle'
  }}>
    <Icon icon="archive" />
    <span>Main library &gt; {holding.name}</span>
  </div>
));

const ItemRecord = ({ item }) => ((
  <div>
    <Icon icon="calendar" />
    <span>{item.name} - Available</span>
    <Icon icon="check-out" />
  </div>
));

const data = new Array(500).fill(0).map((_, index) => ({
  id: index,
  name: `instance ${index + 1}`,
  holdings: new Array(Math.floor(Math.random() * 100 + 100)).fill(0).map((_, hIndex) => ({
    id: hIndex,
    name: `holding ${hIndex}`,
    items: new Array(Math.floor(Math.random() * 50)).fill(0).map((_, iIndex) => ({
      id: iIndex,
      name: `item ${iIndex}`,
    })),
  })),
}));

export default class BasicUsage extends Component {
  constructor() {
    super();
    this.state = {
      data: data.slice(0, 10),
      page: 0,
    };
  }

  loadData = () => {
    const { page } = this.state;

    this.setState({
      data: data.slice(page * 10, (page + 1) * 10),
    });
  };

  handlePageChange = (page) => {
    this.setState({
      page: page.selected,
    }, () => this.loadData());
  };

  render() {
    return (
      <>
        {
          this.state.data.map(instance => ((
            <Tree
              content={<InstanceRecord instance={instance} />}
            >
              {
                instance.holdings.map(holding => ((
                  <Tree
                    content={<HoldingRecord holding={holding} />}
                  >
                    {
                      holding.items.map(item => ((
                        <Tree
                          content={<ItemRecord item={item} />}
                        >

                        </Tree>
                      )))
                    }
                  </Tree>
                )))
              }
            </Tree>
          )))
        }
        <Pagination
          pageCount={50}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}
