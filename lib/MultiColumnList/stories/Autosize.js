import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate, syncGenerate } from './service';

export default class Autosize extends React.Component {
  constructor() {
    super();
    this.state = {
      data: syncGenerate(100, 0)
    };
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList contentData={data} autosize virtualize />
        </div>
      </React.Fragment>
    );
  }
}
