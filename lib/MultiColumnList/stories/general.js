import React from 'react';
import MultiColumnList from '../MultiColumnList';
import data from './dummyData';

export default class General extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
    };
  }

  render() {
    return (
      <MultiColumnList
        contentData={data}
        selectedRow={data[3]}
      />
    );
  }
}
