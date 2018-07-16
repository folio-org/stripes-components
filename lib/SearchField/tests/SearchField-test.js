import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import SearchField from '../SearchField';
import SearchFieldInteractor from './interactor';

describe('SearchField', () => {
  const searchField = new SearchFieldInteractor();

  describe('rendering a SearchField', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SearchField id="searchFieldTest" />
      );
    });

    it('applies the supplied id prop to the input', () => {
      expect(searchField.id).to.equal('searchFieldTest');
    });
  });

  describe('supplying an onChange handler', () => {
    let fieldValue = '';

    beforeEach(async () => {
      await mountWithContext(
        <SearchField
          onChange={(e) => { fieldValue = e.target.value; }}
        />
      );
    });

    describe('changing the field', () => {
      beforeEach(async () => {
        await searchField.fillInput('testing text');
      });

      it('should update value', () => {
        expect(fieldValue).to.equal('testing text');
      });
    });
  });

  // needs Select to be independent of Redux Form to unskip
  describe.skip('using with indexes', () => {
    const searchableIndexes = [
      { label: 'ID', value: 'id' },
      { label: 'Title', value: 'title' },
      { label: 'Identifier', value: 'identifier' },
      { label: 'ISBN', value: 'identifier/type=isbn' },
      { label: 'ISSN', value: 'identifier/type=issn' },
      { label: 'Contributor', value: 'contributor' },
      { label: 'Subject', value: 'subject' },
      { label: 'Classification', value: 'classification' },
      { label: 'Publisher', value: 'publisher' },
    ];

    beforeEach(async () => {
      await mountWithContext(
        <SearchField
          searchableIndexes={searchableIndexes}
        />
      );
    });

    describe('selecting an index', () => {
      beforeEach(async () => {
        await searchField.selectIndex('Publisher');
      });

      it('should update the placeholder', () => {
        expect(searchField.placeholder).to.equal('Search for publisher');
      });
    });
  });
});
