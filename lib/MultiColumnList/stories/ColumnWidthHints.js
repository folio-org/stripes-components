import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';

import { syncGenerate } from './service';
import faker from 'faker';

const generator = () => (
  {
    status: faker.random.boolean(),
    hrid: faker.random.number(),
    requester: faker.random.words(3),
    supplier: faker.random.words(3),
  }
);

export default class ColumnWidthHints extends React.Component {
  constructor() {
    super();
    this.state = {
      data: syncGenerate(5, 0, generator),
      selected: {},
      sorted: 'patronGroup',
    };

    // this.columnWidths = {
    //   active: '10%',
    //   title: { min: 50, max: 100 }
    // };

    this.columnWidths = {
      status: { min: 24, max: 24 },
      hrid: { min: 50, max: 60 },
      requester: { min: 60, max: 80 },
      supplier: { min: 60, max: 80 },
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
        sortedColumn={this.state.sorted}
        sortDirection="ascending"
        selectedRow={this.state.selected}
        onRowClick={this.onRowClick}
        onHeaderClick={this.onHeaderClick}
        columnWidths={this.columnWidths}
        visibleColumns={[
          'status',
          'hrid',
          'requester',
          'supplier'
        ]}
        columnMapping={{
          status: 'Status',
          hrid: 'HRID',
          requester: 'Requester',
          supplier: 'Supplier',
        }}
      />
    );
  }
}
