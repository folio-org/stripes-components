import React from 'react';
import MultiColumnList from '../MultiColumnList';
import TextLink from '../../TextLink';
import Button from '../../Button';
import Paneset from '../../Paneset';
import Pane from '../../Pane';
import data from './dummyData';

export default class CustomFlex extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
      sorted: 'patronGroup',
    };
  }

  render() {
    return (
      <Paneset>
        <Pane defaultWidth="fill">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div><Button>Top</Button></div>
              <div style={{ flex: '1 0 auto', marginBottom: '1rem' }}>
                <MultiColumnList
                  striped
                  autosize
                  contentData={data}
                  sortedColumn={this.state.sorted}
                  sortDirection="ascending"
                  selectedRow={this.state.selected}
                  columnMapping={{
                    active: 'Active',
                    name: 'Name',
                    patronGroup: 'Patron group',
                    email: 'Email',
                    phone: 'Phone',
                    barcode: 'Barcode'
                  }}
                  formatter={{
                    active: (row) => <TextLink href="www.google.com">{row.active ? 'active' : 'inactive'}</TextLink>
                  }}
                />
              </div>
              <div>
                <Button>Load More</Button>
              </div>
            </div>
        </Pane>
      </Paneset>
    );
  }
}
