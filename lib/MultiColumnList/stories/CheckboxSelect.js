import React from 'react';
import MultiColumnList from '../MultiColumnList';
import Checkbox from '../../Checkbox';

import { asyncGenerate, syncGenerate } from './service';

export default class CheckboxSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      data: syncGenerate(100, 0),
      allSelected: false,
      selected: [],
    };

    this.formatter = {
      select: (item) => (
        <Checkbox
          value={item.index.toString()}
          onChange={this.updateSelection}
          checked={this.state.allSelected ||
            (this.state.selected.findIndex(s => (s.index === item.index)) !== -1)
          }
        />),
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
          selected: [...curState.selected, curState.data[value]],
        };
      });
    } else {
      this.setState(curState => {
        return {
          selected: curState.selected.filter(
            (s) => s.index.toString() !== value
          ),
          allSelected: false,
        };
      });
    }
  }

  toggleSelectAll = (e) => {
    if (e.target.checked) {
      this.setState(curState => {
        return {
          selected: [...curState.data],
          allSelected: true,
        };
      });
    } else {
      this.setState(() => {
        return {
          selected: [],
          allSelected: false
        };
      });
    }
  }

  isSelected =({ item }) => (
    this.state.allSelected ||
    (this.state.selected.findIndex(s => s.index === item.index) !== -1)
  );

  render() {
    this.columnMapping = {
      select: <Checkbox value="selectAll" onChange={this.toggleSelectAll} checked={this.state.allSelected} />
    };
    return (
      <React.Fragment>
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList
            contentData={this.state.data}
            columnMapping={this.columnMapping}
            formatter={this.formatter}
            isSelected={this.isSelected}
            visibleColumns={['select', 'index', 'title', 'email']}
            autosize
            virtualize
          />
        </div>
      </React.Fragment>
    );
  }
}
