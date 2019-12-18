import React, { Component } from 'react';
import FilterGroups, { 
  initialFilterState,
  filters2cql,
  handleClearAllFilters
} from '../index';

export default class FilterGroupsSixthComponent extends Component {
  constructor() {
    super();

    this.config = [
      {
        label: 'Item Types',
        name: 'item',
        cql: 'materialType',
        values: ['Books', 'DVDs', 'Microfilm'],
        restrictWhenAllSelected: true,
      }, {
        label: 'Location',
        name: 'location',
        cql: 'location.name',
        values: [
          { name: 'Library of Trantor', cql: 'trantor', hidden: true},
          { name: 'Main Library', cql: 'main' },
          'Annex Library'],
      },
    ];

    this.state = {
      filters: initialFilterState(this.config, 'item.Books,item.Microfilm,location.trantor,location.main'),
    };

    this.handleClearAllFilters = handleClearAllFilters.bind(this);
    this.filters2cql = filters2cql.bind(this);
  }

  queryParam = param => param;
  transitionToParams = obj => obj;

  onChangeFilter = () => {
    this.setState(() => {
      return this.filters2cql(this.config, 'item.Books,item.Microfilm,location.trantor,location.main');
    });
  }

  onClearFilter = () => {
    this.setState(this.handleClearAllFilters(this.state.filters))
  }

  render() {
    return (
      <div>
        <FilterGroups
          config={this.config}
          filters={this.state.filters}
          onChangeFilter={ this.onChangeFilter}
          onClearFilter={this.onClearFilter}
        />
      </div>
    );
  }
}
