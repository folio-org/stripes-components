import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, HTML } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import FilterPaneSearch from '../FilterPaneSearch';

const baseProps = {
  searchAriaLabel: 'Search',
  clearSearchId: 'clearSearchId',
};

const FilterPaneSearchInteractor = HTML.extend('filter pane search')
  .selector('[class^=headerSearchContainer--]')
  .filters({
    searchBox: (el) => !!el.querySelector('[data-test-search-box]'),
    searchSelector: (el) => !!el.querySelector('[data-test-search-field-selector]'),
    clearButton: (el) => !!el.querySelector('[data-test-clear-search]'),
    resultLink: (el) => !!el.querySelector('[data-test-results-link]')
  });

describe('FilterPaneSearch', () => {
  const filterPaneSearch = FilterPaneSearchInteractor();

  describe('base', async () => {
    beforeEach(async () => {
      await mount(
        <FilterPaneSearch {...baseProps} />
      );
    });

    it('should render search box', () => filterPaneSearch.has({ searchBox: true }));

    it('should render clear button', () => filterPaneSearch.has({ clearButton: true }));

    it('should not render search field selector', () => filterPaneSearch.has({ searchSelector: false }));

    it('should not render results link', () => filterPaneSearch.has({ resultLink: false }));

    it('has no axe errors', runAxeTest);
  });

  describe('with search indexes', async () => {
    beforeEach(async () => {
      await mount(
        <FilterPaneSearch {...baseProps} searchableIndexes={[]} />
      );
    });

    it('should render search field selector', () => () => filterPaneSearch.has({ searchSelector: true }));
  });

  describe('with results', async () => {
    beforeEach(async () => {
      await mount(
        <FilterPaneSearch {...baseProps} resultsList="/link" />
      );
    });

    it('should render results link', () => () => filterPaneSearch.has({ resultLink: true }));
  });
});
