import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';
import data from './dummyData';

export default class ColumnWidthHints extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
      sorted: 'patronGroup',
    };

    this.columnWidths = {
      active: '25%',
      patronGroup: '50%'
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

  render() {
    return (
      <MultiColumnList
        striped
        contentData={data}
        sortedColumn={this.state.sorted}
        sortDirection="ascending"
        selectedRow={this.state.selected}
        onRowClick={this.onRowClick}
        onHeaderClick={this.onHeaderClick}
        columnWidths={this.columnWidths}
        visibleColumns={[
          'active',
          'name',
          'phone'
        ]}
        columnMapping={{
          active: 'Active',
          name: 'Name',
          patronGroup: 'Patron group',
          email: 'Email',
          phone: 'Phone',
          barcode: 'Barcode'
        }}
      />
    );
  }
}
