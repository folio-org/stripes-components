import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

export default class PrevNextPagingOffset extends React.Component {
  constructor(props) {
    super(props);
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
      offset: props.pagingOffset || 0,
      page: 1,
      totalCount: props.totalCount || 350,
    };
    this.requestMoreA(100, 0);
  }

  requestMoreA = async (amount, index, direction) => {
    const { onNeedMoreData, test } = this.props;
    const { totalCount } = this.state;
    let adjustedAmount = amount;
    if ((index + amount) > totalCount) adjustedAmount = totalCount - index;
    if (onNeedMoreData) onNeedMoreData(adjustedAmount, index, direction);
    const newData = await asyncGenerate(adjustedAmount, 0, 3000, test);
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
    const { test, onScroll } = this.props;
    const { dataB, dataA, widths, offset, page, totalCount } = this.state;
    this.endReached = dataB.length > 500;
    return (
      <>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '480px', height:'400px' }}>
            <h2>Using pagingOffset prop</h2>
            <h3>Total count: {totalCount}</h3>
            <MultiColumnList
              contentData={dataA}
              columnWidths={widths}
              onNeedMoreData={this.requestMoreA}
              visibleColumns={['index', 'title', 'date', 'email']}
              interactive={false}
              maxHeight={500}
              pageAmount={100}
              totalCount={totalCount}
              pagingType="prev-next"
              pagingOffset={offset}
              virtualize = {!test}
              onScroll={onScroll}
            />
          </div>
        </div>
      </>
    );
  }
}
