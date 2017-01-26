import React from 'react'; // eslint-disable-line
import {Row, Col} from 'react-bootstrap'; // eslint-disable-line

import Pane from '@folio/stripes-components/lib/Pane'; // eslint-disable-line
import Paneset from '@folio/stripes-components/lib/Paneset'; // eslint-disable-line
import PaneMenu from '@folio/stripes-components/lib/PaneMenu'; // eslint-disable-line
import Button from '@folio/stripes-components/lib/Button'; // eslint-disable-line
import Icon from '@folio/stripes-components/lib/Icon'; // eslint-disable-line
import Checkbox from '@folio/stripes-components/lib/Checkbox'; // eslint-disable-line
import TextField from '@folio/stripes-components/lib/TextField'; // eslint-disable-line
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList'; // eslint-disable-line
import KeyValue from '@folio/stripes-components/lib/KeyValue'; // eslint-disable-line
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch'; // eslint-disable-line
import FilterControlGroup from '@folio/stripes-components/lib/FilterControlGroup'; // eslint-disable-line

class Catalog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recordFilters: ['Bibliographic', 'Item', 'Holdings'],
      itemFilters: ['Books', 'DVDs', 'E-Books', 'Microfilm'],
      catalogResults: [
        { title: 'Biology Today',
          id: '199930490002',
          author: {
            firstName: 'James',
            lastName: 'Whitcomb',
          },
        },
        { title: 'Financial Matters',
          id: '199930490034',
          author: {
            firstName: 'Philip',
            lastName: 'Marston',
          },
        },
        { title: 'Modern Microbiotics',
          id: '199930490064',
          author: {
            firstName: 'Eric',
            lastName: 'Martin',
          },
        },
      ],
      selectedItem: { title: 'Biology Today' },
    };

    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeItemFilter = this.onChangeItemFilter.bind(this);
    this.selectRow = this.selectRow.bind(this);
  }

  // record types filter handler
  onChangeFilter(e) {
    const recordFilters = this.state.recordFilters;
    if (e.target.checked) {
      recordFilters.push(e.target.name);
    } else {
      this.removeFilter(e.target.name, recordFilters);
    }
    const stateObject = { recordFilters };
    this.setState(stateObject);
  }

 // item types filter handler
  onChangeItemFilter(e) {
    const itemFilters = this.state.itemFilters;
    if (e.target.checked) {
      itemFilters.push(e.target.name);
    } else {
      this.removeFilter(e.target.name, itemFilters);
    }
    const stateObject = { itemFilters };
    this.setState(stateObject);
  }

  // determines whether filter checkboxes are checked.
  isActiveFilter(name, arr) { // eslint-disable-line class-methods-use-this
    const ind = arr.indexOf(name);
    return ind !== -1;
  }

  // used to remove a selected filter from the state's filter list...
  removeFilter(name, arr) { // eslint-disable-line class-methods-use-this
    const ind = arr.indexOf(name);
    if (ind !== -1) {
      arr.splice(ind, 1);
    }
  }

  // Results Handler
  // row selection handler
  selectRow(e, meta) {
    this.setState({ selectedItem: meta });
  }

  render() {
    /* searchHeader is a 'custom pane header'*/
    const searchHeader = <FilterPaneSearch id="SearchField" onChange={this.onChangeSearch} onClear={this.onClearSearch} value={this.state.searchTerm} />;
    const resultMenu = <PaneMenu><button><Icon icon="bookmark" /></button></PaneMenu>;

    const resultsFormatter = {
      author: item => <td key={item.id}>{item.author.firstName} {item.author.lastName}</td>,
    };

    return (
      <Paneset>
        {/* Filter Pane */}
        <Pane defaultWidth="16%" header={searchHeader}>
          <FilterControlGroup label="Record Types">
            <Checkbox
              id="RecordBibliographicFilter"
              label="Bibliographic"
              name="Bibliographic"
              checked={this.isActiveFilter('Bibliographic', this.state.recordFilters)}
              onChange={this.onChangeFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
            <Checkbox
              id="RecordItemFilter"
              label="Item"
              name="Item"
              checked={this.isActiveFilter('Item', this.state.recordFilters)}
              onChange={this.onChangeFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
            <Checkbox
              id="RecordHoldingFilter"
              label="Holdings"
              name="Holdings"
              checked={this.isActiveFilter('Holdings', this.state.recordFilters)}
              onChange={this.onChangeFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
          </FilterControlGroup>
          <FilterControlGroup label="Item Types">
            <Checkbox
              id="BookItemFilter"
              label="Books"
              name="Books"
              checked={this.isActiveFilter('Books', this.state.itemFilters)}
              onChange={this.onChangeItemFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
            <Checkbox
              id="DVDItemFilter"
              label="DVDs"
              name="DVDs"
              checked={this.isActiveFilter('DVDs', this.state.itemFilters)}
              onChange={this.onChangeItemFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
            <Checkbox
              id="EbookItemFilter"
              label="E-Books"
              name="E-Books"
              checked={this.isActiveFilter('E-Books', this.state.itemFilters)}
              onChange={this.onChangeItemFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
            <Checkbox
              id="MicrofilmItemFilter"
              label="Microfilm"
              name="Microfilm"
              checked={this.isActiveFilter('Microfilm', this.state.itemFilters)}
              onChange={this.onChangeItemFilter}
              marginBottom0
              hover
              fullWidth
              checkedIcon={<Icon icon="eye" />}
            />
          </FilterControlGroup>
        </Pane>
        {/* Results Pane */}
        <Pane
          defaultWidth="32%"
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <strong>Results</strong>
              <div>
                <em>{this.state.catalogResults.length} Results Found</em>
              </div>
            </div>
          }
          lastMenu={resultMenu}
        >
          <MultiColumnList
            contentData={this.state.catalogResults}
            selectedRow={this.state.selectedItem}
            rowMetadata={['title']}
            headerMetadata={{ title: { _id: '001' } }}
            formatter={resultsFormatter}
            onRowClick={this.selectRow}
            visibleColumns={['title', 'author']}
            fullWidth
          />
        </Pane>
      </Paneset>
    );
  }
}

export default Catalog;
