import React from 'react';
import FilterGroups, { initialFilterState } from '../index';

export default class Basic extends React.Component {
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
  }

  onChangeFilter = (e) => {
    this.setState(prevState => {
      const filters = Object.assign({}, prevState.filters);
      filters[e.target.name] = e.target.checked;
      return { filters };
    });
  }

  render() {
    return (
      <div>
        <FilterGroups
          config={this.config}
          filters={this.state.filters}
          onChangeFilter={this.onChangeFilter}
        />
      </div>
    );
  }
}
