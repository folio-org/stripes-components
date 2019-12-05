import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

export default class LoadAction extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      widths: {
        index: '100px',
        title: '150px',
        date: '200px',
        email: '50%',
      },
      offset: 0,
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
    const { data, widths } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: '600px', height:'400px' }}>
          <MultiColumnList
            contentData={data}
            columnWidths={widths}
            onNeedMoreData={this.requestMore}
            visibleColumns={['index', 'title', 'date', 'email']}
            interactive={false}
            maxHeight={500}
            pageAmount={100}
            totalCount={400}
            pagingType="click"
            virtualize
          />
        </div>
      </React.Fragment>
    );
  }
}
