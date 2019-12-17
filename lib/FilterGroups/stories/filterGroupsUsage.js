import React, { Component } from 'react';
import FilterGroups, {
  initialFilterState,
  filterState,
  filters2cql,
  onChangeFilter,
  handleFilterChange,
  handleFilterClear,
  handleClearAllFilters,
} from '../index';

export default class FilterGroupsComponent extends Component {
  constructor() {
    super();

    this.config = [
      {
        label: 'Item Types',
        name: 'item',
        cql: 'materialType',
        values: [
          { name: 'Books', cql: 'true' },
          { name: 'DVDs', cql: 'false' },
          { name: 'Microfilm', cql: 'false' }
        ],
      }
    ];

    this.names = [
      { value: 'books', displayName: 'Books' },
      { value: 'dvds', displayName: 'DVDs' },
      { value: 'microfilm', displayName: 'Microfilm' },
    ];

  //   this.props = [
  //     {
  //       label: 'Item Types',
  //       groupName: 'item',
  //       disabled: false,
  //       names: [
  //         { value: 'books', displayName: 'Books' },
  //         { value: 'dvds', displayName: 'DVDs' },
  //         { value: 'microfilm', displayName: 'Microfilm' },
  //       ],
  //       filters: { 'item.books': true }
  //     }
  //   ];
  // }

  this.state = {
    filters: initialFilterState(this.config, null),
    //checked: false,
  };
}

onChangeFilter = () => {
  this.setState(prevState => {
    return {
      ...prevState,
      filters: { "item.books": true  }
    };
  });
}

onClearFilter = () => {
  this.setState({
    filters: initialFilterState(this.config, null)
  });
}

render() {
  return (
    <FilterGroups
      id="filter-groups"
      config={this.config}
      names={this.names}
      filters={this.state.filters}
      onChangeFilter={this.onChangeFilter}
      onClearFilter={this.onClearFilter}
    />
  )};
}
