import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';
import Button from '../../Button';
import data from './dummyData';

export default class Formatter extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
      mclKey: 0,
    };

    this.listFormatter = {
      action: ({ active, rowIndex }) => (
        <Button
          buttonStyle="primary"
          disabled={!active}
          marginBottom0
          onClick={() => alert(`Row ${rowIndex} action clicked!`)} // eslint-disable-line
        >
          Send Invoice
        </Button>
      )
    };
  }

  onRowClick = (e, row) => {
    action('button-click');
    this.setState({ selected: row });
  }

  resetMCL = () => {
    this.setState(curState => ({
      mclKey: curState.mclKey + 1
    }));
  }

  render() {
    return (
      <>
        <Button onClick={this.resetMCL}>Reinitialize</Button>
        <MultiColumnList
          striped
          key={this.state.mclKey}
          contentData={data}
          formatter={this.listFormatter}
          selectedRow={this.state.selected}
          onRowClick={this.onRowClick}
          visibleColumns={['name', 'patronGroup', 'phone', 'action']}
          columnMapping={{
            name: 'Name',
            patronGroup: 'Patron group',
            phone: 'Phone',
            action: 'Action'
          }}
        />
      </>
    );
  }
}
