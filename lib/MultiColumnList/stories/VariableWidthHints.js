import React from 'react';
import MultiColumnList from '../MultiColumnList';
import Select from '../../Select';
import Layout from '../../Layout';
import { asyncGenerate } from './service';

export default class VariableWidthHints extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      widths: {
        index: { min: '50px', max:'100px' },
        title: { min: '50px', max:'150px' },
        date: { min: '50px', max:'200px' },
        email: { min: '50px', max:'50%' },
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
      widths: { ...curState.widths, [name]: { min: '50px', max: val } }
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
            <div style={{ flex: `0 0 ${widths.index.max}`, width: widths.index.max }}>
              <Select
                name="index"
                onChange={this.updateWidth}
                value={widths.index.max}
                label="index width"
                dataOptions={dataOptions}
              />
            </div>
            <div style={{ flex: `0 0 ${widths.title.max}`, width: widths.title.max }}>
              <Select
                name="title"
                onChange={this.updateWidth}
                value={widths.title.max}
                label="title width"
                dataOptions={dataOptions}
              />
            </div>
            <div style={{ flex: `0 0 ${widths.date.max}`, width: widths.date.max }}>
              <Select
                name="date"
                onChange={this.updateWidth}
                value={widths.date.max}
                label="date width"
                dataOptions={dataOptions}
              />
            </div>
            <div style={{ flex: `0 0 ${widths.email.max}`, width: widths.email.max }}>
              <Select
                name="email"
                onChange={this.updateWidth}
                value={widths.email.max}
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
