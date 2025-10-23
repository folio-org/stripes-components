import React from 'react';
import { action } from '@storybook/addon-actions';
import Checkbox from '../../Checkbox';
import MultiColumnList from '../MultiColumnList';
import { syncGenerate } from './service';

export default class ItemToView extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: null,
      sorted: 'patronGroup',
      data: syncGenerate(100, 0),
      viewWidth: '800px',
      viewItem: null,
    };

    this.columnWidths = {
      active: '25%',
      email: '50%',
      index: '25%'
    };
  }

  onRowClick = (e, row) => {
    action('button-click');
    this.setState(cur => ({
      viewWidth: cur.viewWidth === '800px' ? '400px' : '800px',
      selected: row
    }));
  }

  markItem = (item) => {
    this.setState({ viewItem: item });
  }

  onHeaderClick = (e, { name }) => {
    this.setState({
      sorted: name,
    });
  }

  handleCheckbox = (e,item) => {
    this.setState(cur => {
      const rowIndex = cur.data.findIndex(i => item.email === i.email);
      const newData = cur.data;
      newData[rowIndex].active = e.target.checked;
      return {
        ...cur,
        data: newData,
        selected: newData[rowIndex],
        viewWidth: cur.viewWidth === '800px' ? '400px' : '800px',
      };
    })
  }

  formatter = {
    active: (item) => <Checkbox onChange={(e) => this.handleCheckbox(e,item)} checked={item.active}/>
  }

  render() {
    const {
      viewWidth,
      viewItem
    } = this.state;

    return (
      <div style={{ height: '300px', width: viewWidth }}>
        <MultiColumnList
          striped
          onMarkPosition={this.markItem}
          contentData={this.state.data}
          sortedColumn={this.state.sorted}
          sortDirection="ascending"
          selectedRow={this.state.selected}
          onHeaderClick={this.onHeaderClick}
          columnWidths={this.columnWidths}
          itemToView={viewItem}
          columnMapping={{
            active: 'Active',
            email: 'Email',
            index: 'Index'
          }}
          visibleColumns={[
            'active', 'email', 'index'
          ]}
          formatter={this.formatter}
          autosize
        />
      </div>
    );
  }
}
