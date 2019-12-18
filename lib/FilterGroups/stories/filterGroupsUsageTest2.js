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
  this.handleFilterClear = handleFilterClear.bind(this);
}

updateFilters = (filters) => {
  this.setState(() => {
    return { filters: filters }
  });
}

 onChangeFilterHandler = e => {
  e.persist();
  return this.onChangeFilter(e);
}

queryParam = param => param;
transitionToParams = obj => obj;

onClearFilter = () => {
  const newConfiq = this.config.map(item => this.handleFilterClear(item.name));
  this.setState({
    filters: initialFilterState(newConfiq, null)
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
