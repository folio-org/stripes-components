import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import SearchField from '../SearchField';
import SearchFieldInteractor from './interactor';

const LABEL_PUBLISHER = 'Publisher';
const LABEL_SUBJECT = 'Subject';
const PLACEHOLDER_SUBJECT = 'Subject...';

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

    describe('rendering a SearchField in loading state', () => {
      beforeEach(async () => {
        await mountWithContext(
          <SearchField
            id="searchFieldTest"
            loading
            searchableIndexes={[{ label: 'ID', value: 'id' }]}
          />
        );
      });

      it('input and select are disabled', () => {
        expect(searchField.isDisabled).to.be.true;
        expect(searchField.isDisabledIndex).to.be.true;
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
      { label: LABEL_SUBJECT, value: 'subject', placeholder: PLACEHOLDER_SUBJECT },
      { label: 'Classification', value: 'classification' },
      { label: LABEL_PUBLISHER, value: 'publisher' },
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

    it('input and select are not disabled', () => {
      expect(searchField.isDisabled).to.be.false;
      expect(searchField.isDisabledIndex).to.be.false;
    });

    describe('changing the index', () => {
      beforeEach(async () => {
        await searchField.selectIndex(LABEL_PUBLISHER);
      });

      it('should update the placeholder', () => {
        expect(searchField.placeholder).to.be.empty;
      });
    });

    describe('changing the index with placeholder', () => {
      beforeEach(async () => {
        await searchField.selectIndex(LABEL_SUBJECT);
      });

      it('should update the placeholder', () => {
        expect(searchField.placeholder).to.equal(PLACEHOLDER_SUBJECT);
      });
    });
  });
});
