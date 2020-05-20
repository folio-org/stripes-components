import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';

import { syncGenerate } from './service';

export default class ColumnWidthHints extends React.Component {
  constructor() {
    super();
    this.state = {
      data: syncGenerate(5, 0),
      selected: {},
      sorted: 'patronGroup',
    };

    this.columnWidths = {
      active: '10%',
      title: { min: 50, max: 100 }
    };
  }

  onRowClick = (e, row) => {
    action('button-click');
    this.setState({ selected: row });
  }

  onHeaderClick = (e, { name }) => {
    this.setState({
      sorted: name,
    });
  }

  formatter = {
    range: (item) => {
      return item.active ? (
        <div style={{ display: 'flex' }}>
          <div>{item.date.substring(0, 3)}</div>
          <div>--&gt;</div>
          <div>{item.date.substring(0, 3)}</div>
        </div>
      ) : '-';
    },
  }

  render() {
    const { data } = this.state;
    return (
      <MultiColumnList
        striped
        contentData={data}
        formatter={this.formatter}
        sortedColumn={this.state.sorted}
        sortDirection="ascending"
        selectedRow={this.state.selected}
        onRowClick={this.onRowClick}
        onHeaderClick={this.onHeaderClick}
        columnWidths={this.columnWidths}
        visibleColumns={[
          'active',
          'title',
          'range',
          'email'
        ]}
        columnMapping={{
          active: 'Active',
          title: 'Title',
          patronGroup: 'Patron group',
          range: 'Range',
        }}
      />
    );
  }
}
