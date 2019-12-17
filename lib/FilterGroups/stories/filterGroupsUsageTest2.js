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
    filters: initialFilterState(this.config, "item.books,item.dvds,item.microfilm"),
  };
}

updateFilters = (filters) => {
  this.setState({ filters: filters });
}

 onChangeFilter = e => {
  e.persist();
  this.setState(prevState => {
    const filters = Object.assign({}, prevState.filters);
    filters[e.target.name] = e.target.checked;
    this.updateFilters(filters);
    return { filters };
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
