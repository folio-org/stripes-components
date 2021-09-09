/**
 * Avatar: Basic Usage
 */

import React, { Component } from 'react';
import Tree from '../Tree';

export default class BasicUsage extends Component {
  render() {
    return (
      <>
        <Tree
          open
          content="test"
          onClick={() => console.log('test')}
        >
          <Tree
            content="test child 1"
            onClick={() => console.log('test child 1')}
          />
          <Tree
            content={() => <span style={{ color: 'red' }}>test child 2</span>}
            onClick={() => console.log('test child 2')}
          />
          <Tree
            content="test child 3"
            onClick={() => console.log('test child 3')}
          />
          <Tree
            content="level 2"
          >
            <Tree content="level 4">
              <Tree content="level 5">
                <Tree content="deepmost level" />
              </Tree>
            </Tree>
          </Tree>
        </Tree>
      </>
    );
  }
}
