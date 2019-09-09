import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

export default class MaxHeightVirtualized extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.requestMore(2, 0);
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  render() {
    const columnWidths = {
      'title': '100px'
    };

    return (
      <div style={{ width: '500px', height:'400px' }}>
        <MultiColumnList
          contentData={this.state.data}
          columnWidths={columnWidths}
          visibleColumns={['index', 'title', 'date', 'email']}
          interactive={false}
          maxHeight={500}
          virtualize
          onNeedMoreData={this.requestMore}
        />
      </div>
    );
  }
}
