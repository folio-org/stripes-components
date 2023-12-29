import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';

import getHookExecutionResult from "../../../../tests/helpers/getHookExecutionResult";
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
});
