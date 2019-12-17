import React, { Component } from 'react';
import FilterGroups, { 
  initialFilterState,
  filters2cql,
  handleFilterChange,
  handleFilterClear,
} from '../index';

export default class FilterGroupsFourthComponent extends Component {
  constructor() {
    super();

    this.config = [
      {
        label: 'Item Types',
        name: 'item',
        cql: 'materialType',
        values: ['Books', 'DVDs', 'Microfilm'],
      }, {
        label: 'Location',
        name: 'location',
        cql: 'location.name',
        values: [{ name: 'Main Library', cql: 'main' }, 'Annex Library'],
      },
    ];

    this.state = {
      filters: initialFilterState(this.config, null),
    };

    this.handleFilterClear = handleFilterClear.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.filters2cql = filters2cql.bind(this);
  }

  queryParam = param => param;

  transitionToParams = obj => obj;

  onChangeFilter = (e) => {
    this.setState(() => this.handleFilterChange)
  }

  onClearFilter = () => {
    this.config.map((item) => {
      this.setState(this.handleFilterClear(item.name))
    });
  }

  render() {
    return (
      <div>
        <FilterGroups
          config={this.config}
          filters={this.state.filters}
          onChangeFilter={this.onChangeFilter}
          onClearFilter={this.onClearFilter}
        />
      </div>
    );
  }
}
