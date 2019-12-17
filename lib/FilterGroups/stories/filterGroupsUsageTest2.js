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

export default class FilterGroupsSecondComponent extends Component {
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

  
  this.state = {
    filters: initialFilterState(this.config, 'item.books,item.dvds,item.microfilm'),
  };

  this.onChangeFilter = onChangeFilter.bind(this);
}

updateFilters = (filters) => {
  this.setState(() => {
    return { filters: filters }
  });
}

 onChangeFilterHandler = e => {
  e.persist();
  this.setState(() => {
    return { filters: this.onChangeFilter(e) }
  });
  //return this.onChangeFilter(e);
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
      onChangeFilter={this.onChangeFilterHandler}
      onClearFilter={this.onClearFilter}
    />
  )};
}
