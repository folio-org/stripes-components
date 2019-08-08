import React from 'react';
import MultiColumnList from '../MultiColumnList';
import Checkbox from '../../Checkbox';

import { asyncGenerate, syncGenerate } from './service';

export default class CheckboxSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      allSelected: false,
      selected: [],
    };

    this.data100 = syncGenerate(100, 0);

    this.formatter = {
      select: (item) => <Checkbox value={item.index} onChange={this.updateSelection} checked={this.state.allSelected || this.state.selected.includes(item.index.toString())} />
    };

    
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  updateSelection = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      this.setState(curState => {
        return {
          selected: [...curState.selected, ...[value]]
        };
      });
    } else {
      this.setState(curState => {
        return {
          selected: curState.selected.filter((s) => s !== value)
        };
      });
    }
  }



  isSelected =({ item }) => { return this.state.allSelected || this.state.selected.includes(item.index.toString());};

  render() {
    this.columnMapping = {
      select: ' '
    };
    return (
      <React.Fragment>
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList
            contentData={this.data100}
            columnMapping={this.columnMapping}
            formatter={this.formatter}
            isSelected={this.isSelected}
            visibleColumns={['select', 'index', 'title', 'email']}
            autosize
            virtualize />
        </div>
      </React.Fragment>
    );
  }
}
