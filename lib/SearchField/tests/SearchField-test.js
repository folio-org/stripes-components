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

  describe('using with indexes', () => {
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

    class SearchFieldHarness extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          searchFieldIndex: 'identifier',
        };
      }

      render() {
        return (
          <SearchField
            onChangeIndex={(e) => { this.setState({ searchFieldIndex: e.target.value }); }}
            searchableIndexes={searchableIndexes}
            selectedIndex={this.state.searchFieldIndex}
          />
        );
      }
    }

    beforeEach(async () => {
      await mountWithContext(
        <SearchFieldHarness />
      );
    });

    describe('changing the index', () => {
      beforeEach(async () => {
        await searchField.selectIndex('Publisher');
      });

      it('should update the placeholder', () => {
        expect(searchField.placeholder).to.equal('Search for publisher');
      });
    });
  });
});
