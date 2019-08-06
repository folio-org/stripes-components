import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate, syncGenerate } from './service';

export default class Autosize extends React.Component {
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

    const data100 = syncGenerate(100, 0);
    let scrolled = false;
    return (
      <React.Fragment>
        {/* <div style={{ width: '500px', height:'300px' }}>
          <MultiColumnList
            contentData={this.state.data}
            columnWidths={columnWidths}
            visibleColumns={['index', 'title', 'date', 'email']}
            interactive={false}
            autosize
            virtualize
            onNeedMoreData={this.requestMore}
          />
        </div> */}
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList onScroll={() => { scrolled = true; }} contentData={data100} autosize virtualize />
        </div>
      </React.Fragment>
    );
  }
}
