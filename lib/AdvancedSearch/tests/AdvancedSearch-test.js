/**
 * AdvancedSearch test
 */

import React from 'react';

import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
  afterEach,
} from 'mocha';
import sinon from 'sinon';

import {
  AdvancedSearch as Interactor,
  AdvancedSearchRow as RowInteractor,
  Button as ButtonInteractor,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';

import AdvancedSearch from '../AdvancedSearch';

describe('AdvancedSearch', () => {
  const advancedSearch = new Interactor();
  const resetButton = ButtonInteractor('Reset');
  const searchButton = ButtonInteractor('Search');

  const onSearchSpy = sinon.spy();
  const onCancelSpy = sinon.spy();
  const acceptRowStateSpy = sinon.spy();
  const defaultSearchOptionValue = 'keyword';
  const firstRowInitialSearch = null;
  const searchOptions = [{
    label: 'keyword',
    value: 'keyword',
  }, {
    label: 'name',
    value: 'name',
  }, {
    label: 'surname',
    value: 'surname',
  }];
  const ROW_COUNT = 6;
  const rowState = ['rowState'];

  const renderComponent = (props = {}) => {
    mountWithContext(
      <AdvancedSearch
        open
        onSearch={onSearchSpy}
        onCancel={onCancelSpy}
        defaultSearchOptionValue={defaultSearchOptionValue}
        firstRowInitialSearch={firstRowInitialSearch}
        searchOptions={searchOptions}
        {...props}
      >
        {({ resetRows }) => (
          <>
            <button
              type="button"
              onClick={resetRows}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => acceptRowStateSpy(rowState)}
            >
              Search
            </button>
          </>
        )}
      </AdvancedSearch>
    );
  };

  beforeEach(async () => {
    await renderComponent();
  });

  afterEach(() => {
    onSearchSpy.resetHistory();
    onCancelSpy.resetHistory();
  });

  it('should render component children', () => resetButton.is({ visible: true }));

  it('should render component children', () => searchButton.is({ visible: true }));

  it('should render component', () => advancedSearch.is({ visible: true }));

  it('should have 6 rows', () => advancedSearch.has({ rowCount: ROW_COUNT }));

  it('should select correct default options', async () => {
    for (let i = 0; i < ROW_COUNT; i++) {
      await advancedSearch.find(RowInteractor({ index: i })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal(defaultSearchOptionValue);
      });
    }
  });

  describe('when firstRowInitialSearch is passed', () => {
    beforeEach(async () => {
      await renderComponent({
        firstRowInitialSearch: {
          query: 'Test query',
          option: 'surname',
        },
      });
    });

    it('should set correct query an search option for first row', async () => {
      await advancedSearch.find(RowInteractor({ index: 0 })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('Test query');
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal('surname');
      });
    });
  });

  describe('when resetting advanced search', () => {
    beforeEach(async () => {
      await RowInteractor({ index: 0 }).fillQuery('Music');

      await resetButton.click();
    });

    it('should clear rows', async () => {
      for (let i = 0; i < ROW_COUNT; i++) {
        await advancedSearch.find(RowInteractor({ index: i })).perform(el => {
          expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('');
        });
      }
    });
  });

  describe('when searching advanced search', () => {
    beforeEach(async () => {
      await searchButton.click();
    });

    it('should called with correct items', async () => {
      expect(acceptRowStateSpy.calledOnceWith(['rowState'])).to.be.true;
    });
  });

  describe('when making some changes to rows and searching', () => {
    beforeEach(async () => {
      await RowInteractor({ index: 0 }).fillQuery('Music');
      await RowInteractor({ index: 1 }).selectBoolean(1, 'OR');
      await RowInteractor({ index: 1 }).fillQuery('Painting');

      await advancedSearch.onSearch();
    });

    it('should call onSearch with corectly formatted data', () => {
      expect(onSearchSpy.calledOnceWith('keyword==Music or keyword==Painting')).to.be.true;
    });
  });

  describe('when searching with query in first row', () => {
    beforeEach(async () => {
      await RowInteractor({ index: 0 }).selectSearchOption(0, 'Query');
      await RowInteractor({ index: 0 }).fillQuery('personalName==test or corporateConferenceName==test2');

      await advancedSearch.onSearch();
    });

    it('should call onSearch with corectly formatted data', () => {
      expect(onSearchSpy.calledOnceWith('personalName==test or corporateConferenceName==test2', [
        { query: 'test', searchOption: 'personalName', bool: '' },
        { query: 'test2', searchOption: 'corporateConferenceName', bool: 'or' },
      ])).to.be.true;
    });
  });

  describe('when clicking cancel', () => {
    beforeEach(async () => {
      await advancedSearch.cancel();
    });

    it('should call onCancel', () => {
      expect(onCancelSpy.calledOnce).to.be.true;
    });
  });
});
