import React, { Component } from 'react';
import FilterGroups, { 
  initialFilterState,
  handleFilterChange,
  handleClearAllFilters,
} from '../index';

export default class FilterGroupsFourthComponent extends Component {
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

    this.state = {
      filters: initialFilterState(this.config, 'item.Books,item.Microfilm'),
    };

    this.handleClearAllFilters = handleClearAllFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this); 
  }

  queryParam = param => param;
  transitionToParams = obj => obj;

  render() {
    return (
      <div>
        <FilterGroups
          config={this.config}
          filters={this.state.filters}
          onChangeFilter={this.handleFilterChange}
          onClearFilter={this.handleClearAllFilters}
        />
      </div>
    );
  }
}
