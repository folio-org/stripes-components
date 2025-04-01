/**
 * AdvancedSearch test
 */

import React, { useState } from 'react';
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
import {
  BOOLEAN_OPERATORS,
  MATCH_OPTIONS,
} from '../constants';
import Button from '../../Button';

const Harness = (props) => {
  const [initState, setInitState] = useState({ query: 'try', option: 'keyword' });
  return (
    <>
      <Button onClick={() => { setInitState({ query: 'test', option: 'keyword' }) }}>Reset</Button>
      <AdvancedSearch
        firstRowInitialSearch={initState}
        {...props}
      >
        {({ resetRows }) => (
          <>
            <button
              type="button"
              onClick={resetRows}
            >
              Change
            </button>
          </>
        )}
      </AdvancedSearch>
    </>
  )
}

describe('AdvancedSearch', () => {
  const advancedSearch = new Interactor();
  const resetButton = ButtonInteractor('Reset');
  const searchButton = ButtonInteractor('Search');
  const resetAllButton = ButtonInteractor('Reset all');

  const onSearchSpy = sinon.spy();
  const onCancelSpy = sinon.spy();
  const acceptRowStateSpy = sinon.spy();
  const defaultSearchOptionValue = 'keyword';
  const firstRowInitialSearch = null;
  const searchOptions = [{
    label: 'keyword',
    value: 'keyword',
  }, {
    label: 'identifiers',
    value: 'identifiers.all',
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

  it('should render "Reset all" button', () => resetAllButton.is({ disabled: true }));

  it('should render component', () => advancedSearch.is({ visible: true }));

  it('should have 6 rows', () => advancedSearch.has({ rowCount: ROW_COUNT }));

  it('should select correct default options', async () => {
    for (let i = 0; i < ROW_COUNT; i++) {
      await advancedSearch.find(RowInteractor({ index: i })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal(defaultSearchOptionValue);
      });
    }
  });

  describe('when hasMatchSelection is false', () => {
    beforeEach(async () => {
      await renderComponent({
        hasMatchSelection: false,
      });
    });

    it('should not render match option selects', () => advancedSearch.has({ hasMatchSelect: false }));
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

    it('should place the cursor to the end of the query', async () => {
      await advancedSearch.find(RowInteractor({ index: 0 })).perform(el => {
        const queryField = el.querySelector('[data-test-advanced-search-query]');
        expect(queryField.selectionStart).to.equal('Test query'.length);
        expect(queryField.selectionEnd).to.equal('Test query'.length);
        expect(document.activeElement === queryField).to.be.true;
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
      await expect(acceptRowStateSpy.calledOnceWith(['rowState'])).to.be.true;
    });
  });

  describe('when making some changes to rows and searching', () => {
    beforeEach(async () => {
      await RowInteractor({ index: 0 }).fillQuery('Music');
      await RowInteractor({ index: 1 }).selectBoolean(1, 'OR');
      await RowInteractor({ index: 1 }).fillQuery('Painting');

      await advancedSearch.search();
    });

    it('should call onSearch with corectly formatted data', () => {
      expect(onSearchSpy.calledOnceWith('keyword==Music or keyword==Painting')).to.be.true;
    });
  });

  describe('when there is an unsupported search option', () => {
    beforeEach(async () => {
      await renderComponent({
        hasQueryOption: false,
        firstRowInitialSearch: {
          query: 'test',
          option: 'querySearch',
        },
      });

      await advancedSearch.search();
    });

    it('should be replaced with the default one', () => {
      expect(onSearchSpy.calledOnceWith('keyword==test')).to.be.true;
    });
  });

  describe('when searching with query in first row', () => {
    beforeEach(async () => {
      await RowInteractor({ index: 0 }).selectSearchOption(0, 'Query');
      await RowInteractor({ index: 0 }).fillQuery('personalName==test or corporateConferenceName==test2');

      await advancedSearch.search();
    });

    it('should call onSearch with corectly formatted data', () => {
      expect(onSearchSpy.calledOnceWith('personalName==test or corporateConferenceName==test2', [
        { query: 'test', match: MATCH_OPTIONS.CONTAINS_ALL, searchOption: 'personalName', bool: '' },
        { query: 'test2', match: MATCH_OPTIONS.CONTAINS_ALL, searchOption: 'corporateConferenceName', bool: BOOLEAN_OPERATORS.OR },
      ])).to.be.true;
    });
  });

  describe('when passing a query string to Advanced Search', () => {
    beforeEach(async () => {
      await renderComponent({
        firstRowInitialSearch: {
          query: 'keyword==San Martin or Buenos Aires or keyword==Chicago',
          option: 'advancedSearch',
        },
      });
    });

    it('should split it into several rows correctly', async () => {
      await advancedSearch.find(RowInteractor({ index: 0 })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('San Martin or Buenos Aires');
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal('keyword');
      });

      await advancedSearch.find(RowInteractor({ index: 1 })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('Chicago');
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal('keyword');
      });
    });
  });

  describe('when search options has a dot in name and opening advanced search again', () => {
    beforeEach(async () => {
      await RowInteractor({ index: 0 }).selectSearchOption(0, 'identifiers');
      await RowInteractor({ index: 0 }).fillQuery('id0001');
      await RowInteractor({ index: 1 }).selectBoolean(1, 'OR');
      await RowInteractor({ index: 1 }).selectSearchOption(1, 'identifiers');
      await RowInteractor({ index: 1 }).fillQuery('id0002');

      await advancedSearch.search();
    });

    it('should split it into several rows correctly', async () => {
      await advancedSearch.find(RowInteractor({ index: 0 })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('id0001');
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal('identifiers.all');
      });

      await advancedSearch.find(RowInteractor({ index: 1 })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('id0002');
        expect(el.querySelector('[data-test-advanced-search-option]').value).to.equal('identifiers.all');
      });
    });
  });

  describe('updating initialRowSearch', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Harness
          open
          onSearch={onSearchSpy}
          onCancel={onCancelSpy}
          defaultSearchOptionValue={defaultSearchOptionValue}
          searchOptions={searchOptions}
        />
      );
    });

    it('renders applicable values', async () => {
      await advancedSearch.find(RowInteractor({ index: 0 })).perform(el => {
        expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('try');
      });
    });

    describe('resetting from the outside', () => {
      beforeEach(async () => {
        await ButtonInteractor('Reset').click();
      });

      it('renders updated query values', async () => {
        await advancedSearch.find(RowInteractor({ index: 0 })).perform(el => {
          expect(el.querySelector('[data-test-advanced-search-query]').value).to.equal('test');
        });
      });
    })
  })
});
