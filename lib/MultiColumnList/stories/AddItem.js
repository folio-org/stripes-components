import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';
import Button from '../../Button';

export default class AddItem extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.addItem();
  }

  addItem = async () => {
    const newData = await asyncGenerate(1, 0, 0);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.addItem}>Add Item</Button>
        <MultiColumnList
          contentData={this.state.data}
          containerRef={this.container}
          columnMapping={{
            active: 'Active',
            title: 'Title',
            email: 'Email',
            date: 'Date',
          }}
          visibleColumns={['active', 'email', 'title', 'date']}
        />
      </React.Fragment>
    );
  }
}