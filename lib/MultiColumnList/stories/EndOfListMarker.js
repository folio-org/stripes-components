import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

export default class EndOfListMarker extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.limit = 32;
    this.requestMore(2, 0);
  }

  requestMore = async (amount, index) => {
    if (this.state.data.length < this.limit) {
      const newData = await asyncGenerate(amount, index, 1000);
      this.setState(curState => ({
        data: [...curState.data, ...newData]
      }));
    }
  }

  render() {
    const columnWidths = {
      'title': '100px'
    };

    return (
      <>
        <p>
          {`On virtualized lists, an end marker will display when 
          the end of the data is reached.
          Scroll to the bottom of the list and see!`}
        </p>
        <div style={{ width: '1000px', height:'400px' }}>
          <MultiColumnList
            contentData={this.state.data}
            columnIdPrefix="eolGrid"
            columnWidths={columnWidths}
            visibleColumns={['index', 'title', 'email']}
            interactive={false}
            maxHeight={400}
            totalCount={this.limit}
            virtualize
            onNeedMoreData={this.requestMore}
          />
        </div>
      </>
    );
  }
}
