import React from 'react';
import faker from 'faker';
import cloneDeep from 'lodash/cloneDeep';
import MultiColumnList from '../MultiColumnList';
import Button from '../../Button';
import { asyncGenerate, syncGenerate } from './service';

export default class OffsetPaging extends React.Component {
  constructor() {
    super();
    this.endReached = false;
    this.state = {
      data: new Array(4).fill(null),
      queue: [{ start: 0, data: syncGenerate(4, 0) }], // eslint-disable-line
      widths: {
        index: '100px',
        title: '150px',
        date: '200px',
        email: '50%',
      },
      mclKey: 0,
      first: 0,
    };
    this.requestMore(4, 4, 0);
    this.itemsPerPage = 30;
  }

  requestMore = async (amount, index, first) => {
    console.log(`requesting more at ${index}`); // eslint-disable-line
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData],
      first,
    }));
  }

  addSome = () => {
    this.setState(curState => {
      const newQueue = syncGenerate(6, curState.data.length);
      const newData = new Array(6);
      return {
        data: [...curState.data, ...newData],
        queue: [...curState.queue, { start: curState.data.length, data: newQueue }]
      };
    });
  }

  insertNewData = () => {
    this.setState(curState => {
      const newData = cloneDeep(curState.data);
      curState.queue.forEach((q) => {
        q.data.forEach((d, i) => { newData[q.start + i] = d; });
      });
      return {
        data: newData,
        queue: []
      };
    });
  }

  initPageFive = () => {
    this.setState((curState) => {
      const newData = [...new Array(119).fill(null)];
      return {
        data: newData,
        queue: [],
        first: 120,
        mclKey: curState.mclKey + 1,
      };
    });
  }

  reset = () => {
    this.setState(curState => {
      return {
        data: new Array(4).fill(null),
        queue: [{ start: 0, data: syncGenerate(4, 0) }], // eslint-disable-line
        mclKey: curState.mclKey + 1,
        first: 0
      };
    });
  }

  render() {
    const { data, widths } = this.state;
    return (
      <React.Fragment>
        <Button onClick={this.addSome}>Add some</Button>
        <Button onClick={this.insertNewData}>Insert new data</Button>
        <Button onClick={this.initPageFive}>Init at page 5</Button>
        <Button onClick={this.reset}>Init at page 1</Button>
        <br />
        <div style={{ display: 'flex' }}>
          <div style={{ width: '1000px', height:'400px' }}>
            <MultiColumnList
              contentData={data}
              columnWidths={widths}
              onNeedMoreData={this.requestMore}
              visibleColumns={['index', 'title', 'date', 'email']}
              interactive={false}
              maxHeight={500}
              totalCount={925}
              itemsPerPage={this.itemsPerPage}
              scrollToIndex={this.state.first}
              key={this.state.mclKey}
              virtualize
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
