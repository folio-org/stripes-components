import React, { Component } from 'react';
import FilterGroups, {
  initialFilterState,
  filters2cql,
  onChangeFilter,
  handleFilterChange,
  handleFilterClear,
  handleClearAllFilters,
} from '../../index';

const config1 = [
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
const config2 = [
  {
    label: 'Item Types',
    name: 'item',
    cql: 'materialType',
    values: ['Books', 'DVDs', 'Microfilm'],
  }, {
    label: 'Location',
    name: 'location',
    cql: 'location.name',
    values: [
      {
        name: 'Main Library',
        cql: 'main',
      },
      'Annex Library'
    ],
  },
];
const config3 = [
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
      {
        name: 'Library of Trantor',
        cql: 'trantor',
        hidden: true,
      },
      {
        name: 'Main Library',
        cql: 'main',
      },
      'Annex Library'
    ],
  },
];

export class FilterGroupsFirstComponent extends Component {
  constructor() {
    super();

    this.config = config1;
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
      return { filters };
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
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export class FilterGroupsSecondComponent extends Component {
  constructor() {
    super();

    this.config = config2;
    this.state = {
      filters: initialFilterState(this.config, 'item.Books,item.Microfilm'),
    };

    this.filters2cql = filters2cql.bind(this);
  }

  onChangeFilter = () => {
    this.filters2cql(this.config);
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

// eslint-disable-next-line react/no-multi-comp
export class FilterGroupsThirdComponent extends Component {
  constructor() {
    super();

    this.config = config1;
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

// eslint-disable-next-line react/no-multi-comp
export class FilterGroupsFourthComponent extends Component {
  constructor() {
    super();

    this.config = config3;
    this.state = {
      filters: initialFilterState(this.config, 'item.Books,item.Microfilm,location.Library of Trantor'),
    };

    this.handleClearAllFilters = handleClearAllFilters.bind(this);
    this.filters2cql = filters2cql.bind(this);
  }

  queryParam = param => param;
  transitionToParams = obj => obj;

  onChangeFilter = () => {
    this.setState(({ filters }) => {
      this.filters2cql(this.config, filters);
    });
  }

  onClearFilter = () => {
    this.setState(({ filters }) => {
      this.handleClearAllFilters(filters);
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

// eslint-disable-next-line react/no-multi-comp
export class FilterGroupsFifthComponent extends Component {
  constructor() {
    super();

    this.config = config3;
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
    this.setState(({ filters }) => {
      this.handleClearAllFilters(filters);
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
