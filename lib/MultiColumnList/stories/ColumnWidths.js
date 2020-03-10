import React from 'react';
import MultiColumnList from '../MultiColumnList';
import Select from '../../Select';
import Layout from '../../Layout';
import { asyncGenerate } from './service';

export default class ColumnWidths extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      widths: {
        index: '100px',
        title: '150px',
        date: '200px',
        email: '50%',
      }
    };
    this.requestMore(2, 0);
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  updateWidth = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    this.setState((curState) => ({
      widths: { ...curState.widths, [name]: val }
    }));
  }

  render() {
    const dataOptions = [
      { label:'100px' },
      { label:'150px' },
      { label:'200px' },
      { label:'25%' },
      { label:'50%' }
    ];
    const { widths } = this.state;

    return (
      <>

        <div style={{ width: '600px', height:'400px' }}>
          <Layout className="display-flex">
            <div style={{ flex: `0 0 ${widths.index}`, width: widths.index }}>
              <Select
                name="index"
                onChange={this.updateWidth}
                value={widths.index}
                label="index width"
                dataOptions={dataOptions}
              />
            </div>
            <div style={{ flex: `0 0 ${widths.title}`, width: widths.title }}>
              <Select
                name="title"
                onChange={this.updateWidth}
                value={widths.title}
                label="title width"
                dataOptions={dataOptions}
              />
            </div>
            <div style={{ flex: `0 0 ${widths.date}`, width: widths.date }}>
              <Select
                name="date"
                onChange={this.updateWidth}
                value={widths.date}
                label="date width"
                dataOptions={dataOptions}
              />
            </div>
            <div style={{ flex: `0 0 ${widths.email}`, width: widths.email }}>
              <Select
                name="email"
                onChange={this.updateWidth}
                value={widths.email}
                label="email width"
                dataOptions={dataOptions}
              />
            </div>
          </Layout>
          <MultiColumnList
            contentData={this.state.data}
            columnWidths={this.state.widths}
            visibleColumns={['index', 'title', 'date', 'email']}
            interactive={false}
            maxHeight={500}
            virtualize
          />
        </div>
      </>
    );
  }
}
