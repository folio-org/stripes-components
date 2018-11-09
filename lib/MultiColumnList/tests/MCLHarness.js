import React from 'react';
import MultiColumnList from '../MultiColumnList';
import Button from '../../Button';
import generate from './generate';

class MCLHarness extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.initialData || this.onNeedMore(),
      height: '400px',
      selected: {},
    };

    this.onNeedMore = this.onNeedMore.bind(this);
    this.twoColumns = this.twoColumns.bind(this);
    this.increaseHeight = this.increaseHeight.bind(this);
    this.loadData = this.loadData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  loadData() {
    this.onNeedMore();
  }

  onNeedMore() {
    this.setState(curState => ({
      data: [...curState.data, ...generate(30)]
    }));
  }

  twoColumns() {
    this.setState({
      columns: ['name', 'email'],
    });
  }

  increaseHeight() {
    this.setState({
      height: '800px',
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

  render() {
    const { initialData, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return (
      <div>
        <Button data-test-load onClick={this.loadData}>loadData</Button>
        <Button data-test-two-columns onClick={this.twoColumns}>Two Columns</Button>
        <Button data-test-800-height onClick={this.increaseHeight}>800 height</Button>
        <Button data-test-filter onClick={this.filterData}>Filter</Button>
        <div style={{ height: this.state.height }}>
          <MultiColumnList
            contentData={this.state.data}
            onNeedMoreData={this.onNeedMore}
            visibleColumns={this.state.columns}
            autosize
            virtualize
            selectedRow={this.state.selected}
            onRowClick={this.handleRowClick}
            {...rest}
          />
        </div>
      </div>
    );
  }
}

export default MCLHarness;
