import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';
import Layout from '../../Layout';
import Button from '../../Button';
import data from './dummyData';

export default class Formatter extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
      sorted: 'patronGroup',
    };

    this.listFormatter = {
      action: ({active, rowIndex}) => (
          <Button buttonStyle="primary" disabled={!active} marginBottom0 onClick={() => alert(`Row ${rowIndex} action clicked!`)}>Send Invoice</Button>
      )
    }
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
        formatter={this.listFormatter}
        selectedRow={this.state.selected}
        onRowClick={this.onRowClick}
        onHeaderClick={this.onHeaderClick}
        visibleColumns={['name', 'patronGroup', 'phone', 'action']}
        columnMapping={{
          name: 'Name',
          patronGroup: 'Patron group',
          phone: 'Phone',
          action: 'Action'
        }}
      />
    );
  }
}
