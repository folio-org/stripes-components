import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';

import getHookExecutionResult from '../../../../tests/helpers/getHookExecutionResult';
import { waitFor } from '../../../../tests/helpers/waitFor';
import useAdvancedSearch from '../useAdvancedSearch';

describe('useAdvancedSearch', () => {
  describe('when advanced search modal is closed', () => {
    it('should not replace the search option with default one', async () => {
      const firstRowInitialSearch = {
        query: "identifiers.value==n83169267",
        option: "advancedSearch",
      };

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        open: false,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      expect(hookResult.filledRows[0].searchOption).to.equal('identifiers.value');
    });
  });

  describe('when advanced search modal is open', () => {
    it('should replace the search option with default one', async () => {
      const firstRowInitialSearch = {
        query: "identifiers.value==n83169267",
        option: "advancedSearch",
      };

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        open: true,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      expect(hookResult.filledRows[0].searchOption).to.equal('keyword');
    });
  });

  describe('when reset is hit and user opens the modal', () => {
    it('should focus the query field of the first row', async () => {
      const firstRowInitialSearch = {
        query: '',
        option: '',
      };

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        open: true,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      hookResult.onChange(1, 'query', 'test');
      await waitFor(() => hookResult.activeQueryIndex === 1);
      hookResult.resetRows();
      await waitFor(() => hookResult.activeQueryIndex === 0);

      expect(hookResult.activeQueryIndex).to.equal(0);
    });
  });

  describe('when query is changed and next time user opens the modal', () => {
    it('should focus the changed query field', async () => {
      const firstRowInitialSearch = {
        query: '',
        option: '',
      };

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        open: true,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      hookResult.onChange(0, 'query', 'test1');
      hookResult.onChange(1, 'query', 'test2');
      await waitFor(() => hookResult.activeQueryIndex === 1);

      expect(hookResult.activeQueryIndex).to.equal(1);
    });
  });

  describe('when query is removed and search is not performed and next time user opens the modal', () => {
    it('should focus on the empty previously active query field', async () => {
      const firstRowInitialSearch = {
        query: '',
        option: '',
      };

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        open: true,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      hookResult.onChange(0, 'query', 'test1');
      hookResult.onChange(1, 'query', 'test2');
      hookResult.onChange(2, 'query', 'test3');
      await waitFor(() => hookResult.activeQueryIndex === 2);
      hookResult.onChange(0, 'query', '');
      await waitFor(() => hookResult.activeQueryIndex === 0);

      expect(hookResult.activeQueryIndex).to.equal(0);
    });
  });

  describe('when user opens the modal the first time', () => {
    it('should focus to the last field with a non-empty query', async () => {
      const firstRowInitialSearch = {
        query: 'keyword containsAll test1 and contributor containsAll test2',
        option: 'advancedSearch',
      };

      const queryToRow = () => [
        {
          bool: '',
          searchOption: 'keyword',
          match: 'containsAll',
          query: 'test1',
        },
        {
          bool: 'and',
          searchOption: 'contributor',
          match: 'containsAll',
          query: 'test2',
        }
      ];

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        queryToRow,
        open: true,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      await waitFor(() => hookResult.activeQueryIndex === 1);

      expect(hookResult.activeQueryIndex).to.equal(1);
    });
  });

  describe('when user changes query of one row and a search option of another one', () => {
    it('should focus to the last field with a non-empty query', async () => {
      const firstRowInitialSearch = {
        query: 'keyword containsAll test1 and contributor containsAll test2 and contributor containsAll test3',
        option: 'advancedSearch',
      };

      const queryToRow = () => [
        {
          bool: '',
          searchOption: 'keyword',
          match: 'containsAll',
          query: 'test1',
        },
        {
          bool: 'and',
          searchOption: 'contributor',
          match: 'containsAll',
          query: 'test2',
        },
        {
          bool: 'and',
          searchOption: 'contributor',
          match: 'containsAll',
          query: 'test3',
        },
      ];

      const args = {
        defaultSearchOptionValue: 'keyword',
        firstRowInitialSearch,
        queryToRow,
        open: true,
      };

      const hookResult = await getHookExecutionResult(useAdvancedSearch, args);

      hookResult.onChange(1, 'query', 'test3');
      hookResult.onChange(0, 'searchOption', 'contributor');

      await waitFor(() => hookResult.activeQueryIndex === 2);

      expect(hookResult.activeQueryIndex).to.equal(2);
    });
  });

  it('should expose isPristine', async () => {
    const hookResult = await getHookExecutionResult(useAdvancedSearch, {});

    expect(hookResult.isPristine).to.equal(true);
  });
});
