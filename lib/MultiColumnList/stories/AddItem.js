import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';
import Button from '../../Button';

export default class AddItem extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      data2: [],
    };
  }

  componentDidMount() {
    this.addItem();
    this.shiftItem();
  }

  shiftItem = async () => {
    const newData = await asyncGenerate(1, 0, 0);
    this.setState(curState => ({
      data2: [...newData, ...curState.data2],
    }));
  }

  addItem = async () => {
    const newData = await asyncGenerate(1, 0, 0);
    this.setState(curState => ({
      data: [...curState.data, ...newData],
    }));
  }

  render() {
    return (
      <>
        <Button onClick={this.addItem}>Add item</Button>
        <MultiColumnList
          contentData={this.state.data}
          columnMapping={{
            active: 'Active',
            title: 'Title',
            email: 'Email',
            date: 'Date',
          }}
          visibleColumns={['active', 'email', 'title', 'date']}
        />
        <p>Content below list</p>
        <Button onClick={this.shiftItem}>Add item to beginning of list</Button>
        <MultiColumnList
          contentData={this.state.data2}
          columnMapping={{
            active: 'Active',
            title: 'Title',
            email: 'Email',
            date: 'Date',
          }}
          visibleColumns={['active', 'email', 'title', 'date']}
        />
        <p>Content below list</p>
      </>
    );
  }
}
