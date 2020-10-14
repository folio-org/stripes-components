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
      data: new Array(4000),
      queue: [{ start: 0, data: [] }], // eslint-disable-line
      widths: {
        index: '100px',
        title: '150px',
        date: '200px',
        email: '50%',
      },
      mclKey: 0,
      first: 0,
    };
    // this.requestMore(30, 30, 0);
    this.itemsPerPage = 34;
  }

  requestMore = async (amount, index, first) => {
    console.log(`requesting more at ${index}`); // eslint-disable-line
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => {
      const dataClone = curState.data.slice();
      newData.forEach((d, i) => {
        dataClone[i + index] = d;
      });

      return {
        data: dataClone,
        first,
      };
    });
  }

  initPageFive = () => {
    this.setState(() => {
      const newData = new Array(119);
      return {
        data: newData,
        queue: [],
        first: 120,
        mclKey: 120,
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
              totalCount={4000}
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
