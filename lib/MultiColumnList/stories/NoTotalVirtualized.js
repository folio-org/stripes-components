import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { Accordion } from '../../Accordion';
import { generate } from './service';

export default class NoTotalVirtualized extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selected: {},
      open: false,
    };
    this.requestMore(2, 0);
  }

  onRowClick = (e, row) => {
    action('button-click');
    this.setState({ selected: row });
  }

  requestMore = async(amount, index) => {
    const newData = await generate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  toggleAccordion = () => {
    this.setState(curState => ({
      open: !curState.open
    }));
  }

  render() {
    const columnWidths = {
      'title': '100px'
    }

    return (
      <div style={{width: '500px'}}>
        <Accordion label="Show me the list" onToggle={this.toggleAccordion} open={this.state.open}>
          <div style={{width: '500px', height:'400px'}}>
            <MultiColumnList
              contentData={this.state.data}
              columnWidths={columnWidths}
              visibleColumns={['index', 'title', 'date', 'email']}
              interactive={false}
              onRowClick={this.onRowClick}
              height={500}
              virtualize
              autosize
              onNeedMoreData={this.requestMore}
            />
          </div>
        </Accordion>
      </div>
    );
  }
}
