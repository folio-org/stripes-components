import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

export default class PrevNextPagingOffset extends React.Component {
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
      offset: 0,
      page: 1,
    };
    this.requestMoreA(100, 0);
  }

  requestMoreA = async (amount, index, direction) => {
    const newData = await asyncGenerate(amount, 0, 3000);
    this.setState((curState) => {
      let newPage = curState.page;
      if (curState.offset < index) {
        newPage = curState.page + 1;
      } else  if (curState.offset > index){
        newPage = curState.page - 1;
      }
      return {
        dataA: newData,
        offset: index,
        page: newPage,
      };
    });
  }

  render() {
    const { dataB, dataA, widths, offset, page } = this.state;
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
              pagingOffset={offset}
              pagingCanGoNext = {(page < 10)}
              pagingCanGoPrevious = {(page > 1)}
              virtualize
            />
          </div>
        </div>
      </>
    );
  }
}
