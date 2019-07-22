import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';
import data from './dummyData';

export default class BasicMCL extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
    };
  }

  onRowClick = (e, row) => {
    action('button-click');
    this.setState({ selected: row });
  }

  render() {
    return (
      <MultiColumnList
        striped
        contentData={data}
        selectedRow={this.state.selected}
        onRowClick={this.onRowClick}
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
