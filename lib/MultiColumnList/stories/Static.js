import React from 'react';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';
import { Accordion } from '../../Accordion';

export default class Static extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.container = React.createRef();
  }

  componentDidMount() {
    this.requestMore(20, 0);
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  render() {
    return (
      <>
        <Accordion label="Accordion 1" closedByDefault>
          <MultiColumnList
            height={200}
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
        </Accordion>
        <Accordion label="Accordion 2">
          <MultiColumnList
            height={200}
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
        </Accordion>
      </>
    );
  }
}
