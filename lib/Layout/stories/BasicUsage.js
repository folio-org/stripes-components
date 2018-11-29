/**
 * Layout Basic Usage
 */

import React, { Component } from 'react';
import sortBy from 'lodash/sortBy';
import MultiColumnList from '../../MultiColumnList';
import SearchField from '../../SearchField';
import styles from '../Layout.css';
import classNamePropertiesMapping from './classNamePropertiesMapping';

const mappedData = sortBy(Object.keys(styles).map(className => ({
  className,
  properties: classNamePropertiesMapping[className] || '',
})), item => item.className);

class BasicUsage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: mappedData,
      query: '',
    };

    this.getData = this.getData.bind(this);
  }

  getData() {
    const { data, query } = this.state;

    if (query) {
      return data.filter(item => item.className.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
      item.properties.toLowerCase().indexOf(query.toLowerCase()) >= 0);
    }

    return data;
  }

  render() {
    const { query } = this.state;

    return (
      <div>
        <SearchField
          placeholder="Filter CSS properties and class names..."
          value={query}
          onChange={e => this.setState({ query: e.target.value })}
          onClear={() => this.setState({ query: '' })}
          autoFocus
        />
        <hr />
        <MultiColumnList
          interactive={false}
          contentData={this.getData()}
          visibleColumns={['Class', 'CSS properties']}
          isEmptyMessage={`No class names containing "${query}" was found.`}
          columnWidths={{
            'Class': '250px',
            'CSS properties': '500px',
          }}
          formatter={{
            'Class': (item) => item.className,
            'CSS properties': (item) => item.properties,
          }}
        />
      </div>
    );
  }
}

export default BasicUsage;
