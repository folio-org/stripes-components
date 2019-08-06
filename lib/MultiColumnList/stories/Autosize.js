import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate, syncGenerate } from './service';

export default class Autosize extends React.Component {
  constructor() {
    super();
    this.requestMore(2, 0);
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  render() {
    const data100 = syncGenerate(100, 0);
    return (
      <React.Fragment>
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList contentData={data100} autosize virtualize />
        </div>
      </React.Fragment>
    );
  }
}
