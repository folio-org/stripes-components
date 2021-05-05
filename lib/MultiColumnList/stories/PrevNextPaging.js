import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerateSparse } from './service';

export default class PrevNextPaging extends React.Component {
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
    this.requestMoreA(100, 0);
    this.requestMoreB(100, 0);
  }

  requestMoreA = async (amount, index) => {
    const newData = await asyncGenerateSparse(amount, index, 10000, 1000);
    this.setState(curState => ({
      dataA: newData
    }));
  }

  requestMoreB = async (amount, index) => {
    const newData = await asyncGenerateSparse(amount, index, 10000, 1000);
    this.setState(curState => ({
      dataB: newData
    }));
  }

  render() {
    const { dataB, dataA, widths } = this.state;
    this.endReached = dataB.length > 500;
    return (
      <>
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
              totalCount={10000}
              pagingType="prev-next"
            />
          </div>
          {/* <div style={{ width: '480px', height:'400px' }}>
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
              pagingType="prev-next"
            />
          </div> */}
        </div>
      </>
    );
  }
}
