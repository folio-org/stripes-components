import React, { Component } from 'react';
import FilterGroups, { 
  initialFilterState,
  filters2cql,
} from '../index';

export default class FilterGroupsThirdComponent extends Component {
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
      filters: initialFilterState(this.config, 'item.Books,item.Microfilm'),
    };
    
    this.filters2cql = filters2cql.bind(this);
  }

  onChangeFilter = () => {
    this.filters2cql(this.config)
  }

  onClearFilter = () => {
    this.setState({
      filters: initialFilterState(this.config, null)
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
