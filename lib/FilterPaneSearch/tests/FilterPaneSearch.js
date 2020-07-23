import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import FilterPaneSearch from '../FilterPaneSearch';
import FilterPaneSearchInteractor from './interactor';

const baseProps = {
  searchAriaLabel: 'Search',
  clearSearchId: 'clearSearchId',
};

describe('FilterPaneSearch', () => {
  const filterPaneSearch = new FilterPaneSearchInteractor();

  describe('base', async () => {
    beforeEach(async () => {
      await mount(
        <FilterPaneSearch {...baseProps} />
      );
    });

    it('should render search box', () => {
      expect(filterPaneSearch.hasSearchBox).to.be.true;
    });

    it('should render clear button', () => {
      expect(filterPaneSearch.hasClearButton).to.be.true;
    });

    it('should not render search field selector', () => {
      expect(filterPaneSearch.hasSearchFieldSelector).to.be.false;
    });

    it('should not render results link', () => {
      expect(filterPaneSearch.hasSearchFieldSelector).to.be.false;
    });
  });

  describe('with search indexes', async () => {
    beforeEach(async () => {
      await mount(
        <FilterPaneSearch {...baseProps} searchableIndexes={[]} />
      );
    });

    it('should render search field selector', () => {
      expect(filterPaneSearch.hasSearchFieldSelector).to.be.true;
    });
  });

  describe('with results', async () => {
    beforeEach(async () => {
      await mount(
        <FilterPaneSearch {...baseProps} resultsList="/link" />
      );
    });

    it('should render results link', () => {
      expect(filterPaneSearch.hasResultsLink).to.be.true;
    });
  });
});
