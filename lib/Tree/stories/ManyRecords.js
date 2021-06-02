/**
 * Avatar: Basic Usage
 */

import React, {
  Component,
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';

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
  <div
    style={{
      display: 'inline-block',
      verticalAlign: 'middle'
    }}
  >
    <Icon icon="calendar" />
    <span>{item.name} - Available</span>
    <Icon icon="check-out" />
  </div>
));

const makeRequest = (okapi, url, params) => {
  const headers = {
    'x-okapi-token': okapi.token,
    'x-okapi-tenant': okapi.tenant,
    'content-type': 'application/json',
    ...params.headers,
  };

  return fetch(`${okapi.url}/${url}`, {
    ...params,
    headers: {
      ...headers,
    },
  });
};

export default class BasicUsage extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      search: '',
      pages: {
        providers: 1,
        packages: 1,
        resources: 1,
      },
    };
  }

  componentDidMount() {
    makeRequest()
  }

  handlePageChange = (key, page) => {
    this.setState((state) => ({
      pages: {
        ...state.pages,
        [key]: page.selected,
      }
    }), () => this.loadData(key));
  };

  render() {
    return (
      <>
        <Tree
          treeData={this.state.data}
          levelMapping={{
          }}
        />
        <Pagination
          pageCount={50}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}
