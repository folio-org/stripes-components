import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';


export default class Resizing extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.requestMore(2, 0);

    this.columnWidths = {
      active: '20%',
      name: '20%',
      patronGroup: '20%',
      email: '20%',
      barcode: '20%'
    };
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  render() {
    return (
      <>
        <h2>Window resize</h2>
        <p>
          <strong>If no width prop is provided, </strong>
          MCL will re-evaluate column widths when the window is resized.
        </p>
        <MultiColumnList
          striped
          contentData={this.state.data}
          selectedRow={this.state.selected}
          columnWidths={this.columnWidths}
          maxHeight={400}
          virtualize
          onNeedMoreData={this.requestMore}
          columnMapping={{
            active: 'Active',
            name: 'Name',
            patronGroup: 'Patron group',
            email: 'Email',
            barcode: 'Barcode'
          }}
          visibleColumns={['active', 'name', 'patronGroup', 'email', 'barcode']}
        />
      </>
    );
  }
}
