import React from 'react';
import MultiColumnList from '../MultiColumnList';
import TextLink from '../../TextLink';
import Button from '../../Button';
import Icon from '../../Icon';

import { asyncGenerate } from './service';

export default class VirtualizeStatic extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
    };
    this.requestMore(300, 0);
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(_curState => ({
      data: newData,
      loading: false
    }));
  }

  fetchData = () => {
    this.setState({
      loading: true
    },
    () => {
      const amount = Math.ceil(Math.random() * 200);
      this.requestMore(amount, 0);
    });
  }

  formatter = {
    title: (row) => <TextLink href="https://github.com/folio-org/stripes-components">{row.title}</TextLink>
  }

  render() {
    const columnWidths = {
      'title': '100px'
    };

    const { data, loading } = this.state;

    return (
      <>
        <Button onClick={this.fetchData}>Get new data</Button>
        <p><strong>Data length: { loading ? <Icon icon="spinner-ellipsis" /> : <span>{data.length}</span> }</strong></p>
        <div style={{ width: '500px', height:'400px' }}>
          <MultiColumnList
            contentData={this.state.data}
            columnWidths={columnWidths}
            visibleColumns={['title', 'index', 'date', 'email']}
            interactive={false}
            maxHeight={500}
            virtualize
            formatter={this.formatter}
          />
        </div>
      </>
    );
  }
}
