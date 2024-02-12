import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import MultiColumnList from '../MultiColumnList';
import Button from '../../Button';
import { generate } from './generate';
import { asyncGenerate, syncGenerate } from '../stories/service';


class MCLHarness extends React.Component {
  static defaultProps = {
    displayGrid: true
  }

  constructor(props) {
    super(props);

    this.state = {
      data: props.initialData || syncGenerate(30),
      height: 400,
      selected: {},
      displayGrid: props.displayGrid,
      columns: this.props.columns || ['name', 'email', 'phone'],
      placeMarker: null,
    };

    this.onNeedMore = this.onNeedMore.bind(this);
    this.twoColumns = this.twoColumns.bind(this);
    this.increaseHeight = this.increaseHeight.bind(this);
    this.loadData = this.loadData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.markPosition = this.markPosition.bind(this);
  }

  loadData() {
    this.onNeedMore();
  }

  async onNeedMore() {
    const { onNeedMoreSpy, asyncPaging } = this.props;
    if (onNeedMoreSpy) onNeedMoreSpy();
    let newData;
    if (asyncPaging) {
      newData = await asyncGenerate(30, null, 500);
    } else {
      newData = await Promise.resolve(syncGenerate(30));
    }

    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  twoColumns() {
    this.setState({
      columns: ['name', 'email'],
    });
  }

  increaseHeight() {
    this.setState(curState => {
      return {
        height: curState.height === 800 ? 400 : 800,
      };
    });
  }

  fakeSort = () => {
    this.setState(curState => {
      const dataClone = cloneDeep(curState.data);
      const lastItem = dataClone.pop();
      dataClone.unshift(lastItem);
      return { data: dataClone };
    });
  }

  filterData() {
    this.setState(curState => {
      return {
        data: curState.data.filter((m, i) => {
          return (i % 2 === 0);
        })
      };
    });
  }

  handleRowClick(e, row) {
    this.setState({
      selected: row,
    });
  }

  displayGrid = () => {
    this.setState(curState => ({
      displayGrid: !curState.displayGrid,
    }));
  }

  markPosition(marker) {
    this.setState({
      placeMarker: marker,
    });
  }

  resetData = () => {
    const { initialData } = this.props;
    this.setState({
      data: initialData || generate(3)
    });
  }

  render() {
    const { displayGrid, placeMarker } = this.state;
    const { initialData, onNeedMoreSpy, asyncPaging, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return (
      <div>
        <Button data-test-display-grid onClick={this.displayGrid}>show grid</Button>
        <Button data-test-load onClick={this.loadData}>loadData</Button>
        <Button data-test-two-columns onClick={this.twoColumns}>Two Columns</Button>
        <Button data-test-800-height onClick={this.increaseHeight}>800 height</Button>
        <Button data-test-filter onClick={this.filterData}>Filter</Button>
        <Button data-test-filter onClick={this.resetData}>Reset</Button>
        <div style={{
          height: `${this.state.height}px`,
          display: displayGrid ? 'block' : 'none',
          width: Object.keys(this.state.selected).length > 0 ? '300px' : '80%'
        }}
        >
          <MultiColumnList
            contentData={this.state.data}
            onNeedMoreData={this.onNeedMore}
            visibleColumns={this.state.columns}
            autosize
            virtualize
            selectedRow={this.state.selected}
            onRowClick={this.handleRowClick}
            onHeaderClick={this.fakeSort}
            onMarkPosition={this.markPosition}
            itemToView={placeMarker}
            {...rest}
          />
        </div>
      </div>
    );
  }
}

export default MCLHarness;
