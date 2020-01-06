import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

export default class LoadAction extends React.Component {
  constructor() {
    super();
    this.endReached = false;
    this.state = {
      dataA: [],
      dataB: [],
      widths: {
        index: '100px',
        title: '150px',
        date: '200px',
        email: '50%',
      },
    };
    this.requestMoreA(2, 0);
    this.requestMoreB(2, 0);
  }

  requestMoreA = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      dataA: [...curState.dataA, ...newData]
    }));
  }

  requestMoreB = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      dataB: [...curState.dataB, ...newData]
    }));
  }

  render() {
    const { dataB, dataA, widths } = this.state;
    this.endReached = dataB.length > 500;
    return (
      <React.Fragment>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '480px', height:'400px' }}>
            <h2>Using totalCount prop</h2>
            <MultiColumnList
              contentData={dataA}
              columnWidths={widths}
              onNeedMoreData={this.requestMoreA}
              visibleColumns={['index', 'title', 'date', 'email']}
              interactive={false}
              maxHeight={500}
              pageAmount={100}
              totalCount={400}
              pagingType="click"
              virtualize
            />
          </div>
          <div style={{ width: '480px', height:'400px' }}>
            <h2>Using dataEndReached prop</h2>
            <MultiColumnList
              contentData={dataB}
              columnWidths={widths}
              dataEndReached={this.endReached}
              onNeedMoreData={this.requestMoreB}
              visibleColumns={['index', 'title', 'date', 'email']}
              interactive={false}
              maxHeight={500}
              pageAmount={100}
              pagingType="click"
              virtualize
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
