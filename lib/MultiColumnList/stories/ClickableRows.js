import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';
import Button from '../../Button';
import { asyncGenerate } from './service';

export default class ClickableRows extends React.Component {
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

  onRowClick = (e, i) => { // eslint-disable-line no-unused-vars
    const act = action(`clicked row ${i.index}!`);
    act({ row: i });
  }

  onRowActionClick = (e, i) => {
    e.stopPropagation();
    const act = action(`clicked button in row ${i}!`);
    act();
    // console.log('clicked button!');
  }

  formatter = {
    actions: ({ index }) => (<Button onClick={(e) => this.onRowActionClick(e, index)}>{`Row ${index} action`}</Button>),
  }

  render() {
    const columnWidths = {
      'title': '100px'
    };

    return (
      <div style={{ width: '800px', height:'400px' }}>
        <p>Check out the actions tab below to see logged row clicks and row action clicks.</p>
        <MultiColumnList
          contentData={this.state.data}
          columnWidths={columnWidths}
          visibleColumns={['index', 'title', 'date', 'email', 'actions']}
          onRowClick={this.onRowClick}
          formatter={this.formatter}
          height={400}
          virtualize
          onNeedMoreData={this.requestMore}
        />
      </div>
    );
  }
}
